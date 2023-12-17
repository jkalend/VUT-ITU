// @ts-nocheck
// Author: Jan Kalenda
import prisma from '@/app/db'
import { NextRequest, NextResponse } from 'next/server'
import CryptoJS from 'crypto-js'
import { saveFile } from '@/app/api/social/route'

// add new plant to database
export const POST = async (
    request: NextRequest,
    { params }: { params: { userid: string } }
) => {
    try {
        const arr = CryptoJS.enc.Hex.parse(params.userid)
        const email = CryptoJS.enc.Utf8.stringify(arr)

        let { nickname, description, species, image } = await request.json()
        const image_name = `plant-${email}${Date.now()}.txt`

        // get species data
        const res = await prisma.species.findUnique({
            where: {
                speciesId: species,
            },
            select: {
                speciesImage: true,
                wateringAmount: true,
                wateringPeriod: true,
                name: true,
            },
        })

        // add plant to database
        const post = await prisma.plant.create({
            data: {
                email: email,
                nickname: nickname ? nickname : res?.name,
                description: description,
                speciesId: species,
                customImage: image ? image_name : res?.speciesImage,
                speciesImage: !image,
            },
        })
        // add initial watering to database
        const rs = await prisma.watering.create({
            data: {
                plantId: post.plantId,
                amount: res?.wateringAmount as number,
                dateWatered: new Date(
                    Date.now() + res?.wateringPeriod * (1000 * 60 * 60 * 24)
                ),
            },
        })

        if (image != '') {
            await saveFile(post.customImage, image)
        }
        post.customImage = image ? image : res?.speciesImage
        return new Response(JSON.stringify(post), { status: 200 })
    } catch (error) {
        console.log(error)
        return new Response('Failed to create plant ' + error, { status: 500 })
    }
}
