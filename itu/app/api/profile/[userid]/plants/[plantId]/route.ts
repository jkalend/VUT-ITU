// @ts-nocheck
// Author: Jan Kalenda
import prisma from '@/app/db'
import { NextRequest, NextResponse } from 'next/server'

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
        })

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
        let { nickname, description, image, species } = await request.json()

        // get old plant data
        const plant = await prisma.plant.findUnique({
            where: {
                plantId: Number(params.plantId),
            },
            select: {
                speciesId: true,
            },
        })

        // get specified species data
        const spc = await prisma.species.findUnique({
            where: {
                speciesId: species,
            },
            select: {
                speciesImage: image ? false : true,
                wateringAmount: true,
                wateringPeriod: true,
            },
        })

        // if plant species changed, use species image
        if (plant?.speciesId != species) {
            if (image == '') {
                image = spc?.speciesImage
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
                        ? Buffer.from(image, 'utf8')
                        : undefined,
                speciesId: plant?.speciesId != species ? species : undefined,
            },
        })

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
