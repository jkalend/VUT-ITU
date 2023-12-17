// @ts-nocheck
// Author: Jan Kalenda
import prisma from '@/app/db'
import { NextRequest, NextResponse } from 'next/server'
import { deleteFile, saveFile } from '@/app/api/social/route'

var CryptoJS = require('crypto-js')

// delete plant
export const DELETE = async (
    request: NextRequest,
    { params }: { params: { userid: string; plantId: string } }
) => {
    try {
        const plant = await prisma.plant.findUnique({
            where: {
                plantId: Number(params.plantId),
            },
            select: {
                speciesImage: true,
                customImage: true,
            },
        })

        // delete custom plant image
        if (plant?.speciesImage == false) {
            deleteFile(`./public/images/${plant?.customImage}`)
        }

        const _ = await prisma.plant.delete({
            where: {
                plantId: Number(params.plantId),
            },
        })

        return NextResponse.json('done', { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json(error, { status: 500 })
    }
}

// update plant
export const PUT = async (
    request: NextRequest,
    { params }: { params: { userid: string; plantId: string } }
) => {
    try {
        const arr = CryptoJS.enc.Hex.parse(params.userid)
        const email = CryptoJS.enc.Utf8.stringify(arr)
        const { nickname, description, image, species } = await request.json()
        let image_name = `plant-${email}${Date.now()}.txt`
        // get old plant data
        const plant = await prisma.plant.findUnique({
            where: {
                plantId: Number(params.plantId),
            },
            select: {
                speciesId: true,
                speciesImage: true,
                customImage: true,
            },
        })

        // get specified species data
        const spc = await prisma.species.findUnique({
            where: {
                speciesId: species,
            },
            select: {
                speciesImage: true,
                wateringAmount: true,
                wateringPeriod: true,
            },
        })

        // if plant species changed and no new image was provided, use species image
        if (plant?.speciesId != species) {
            if (image == '') {
                image_name = spc?.speciesImage as string
            }
        }

        // update plant
        const updated = await prisma.plant.update({
            where: {
                plantId: Number(params.plantId),
            },
            data: {
                nickname: nickname,
                description: description,
                customImage:
                    image || plant?.speciesId != species
                        ? image_name
                        : undefined,
                speciesImage: !image && plant?.speciesId != species,
                speciesId: plant?.speciesId != species ? species : undefined,
            },
        })

        // save custom image if provided and delete old one
        if (image != '') {
            if (plant?.speciesImage == false) {
                //is custom image
                deleteFile(`./public/images/${plant?.customImage}`)
            }
            await saveFile(updated.customImage, image)
            updated.customImage = image
        }
        if (
            plant?.speciesImage == false && //is custom image
            image == '' && //no new image
            plant?.speciesId != species //species changed
        ) {
            console.log('delete old image')
            deleteFile(`./public/images/${plant?.customImage}`)
        }

        // update watering if species changed
        if (plant?.speciesId != species) {
            const del = await prisma.watering.deleteMany({
                where: {
                    plantId: updated?.plantId,
                },
            })
            const rs = await prisma.watering.create({
                data: {
                    plantId: updated?.plantId,
                    amount: spc?.wateringAmount as number,
                    dateWatered: new Date(
                        Date.now() + spc?.wateringPeriod * (1000 * 60 * 60 * 24)
                    ),
                },
            })
        }

        return NextResponse.json(plant, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json(error, { status: 500 })
    }
}
