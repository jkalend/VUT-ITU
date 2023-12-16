import prisma from '@/app/db'
import { NextRequest, NextResponse } from 'next/server'
import fsPromises from 'fs/promises'
import fs from 'fs'
import CryptoJS from 'crypto-js'

const saveFile = async (filename, content) => {
    await fsPromises.writeFile(`./public/images/${filename}`, content)
}

const readFromFile = async (filename) => {
    const base64 = await fsPromises.readFile(`./public/images/${filename}`)
    return base64
}
const deleteFile = (filename) => {
    fs.unlink(filename, (err) => {
        if (err) {
            console.error(err)
            return
        } else {
            console.log('Success')
        }
    })
}

export const POST = async (
    request: NextRequest,
    { params }: { params: { userid: string } }
) => {
    try {
        const arr = CryptoJS.enc.Hex.parse(params.userid)
        const email = CryptoJS.enc.Utf8.stringify(arr)

        let { nickname, description, species, image } = await request.json()
        const image_name = `plant-${email}${Date.now()}.txt`

        const res = await prisma.species.findUnique({
            where: {
                speciesId: species,
            },
            select: {
                speciesImage: true,
                wateringAmount: true,
                wateringPeriod: true,
            },
        })

        // if (image == '') {
        //     image = res?.speciesImage
        // }

        const post = await prisma.plant.create({
            data: {
                email: email,
                nickname: nickname,
                description: description,
                speciesId: species,
                customImage: image ? image_name : res?.speciesImage,
                speciesImage: !image,
            },
        })
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
