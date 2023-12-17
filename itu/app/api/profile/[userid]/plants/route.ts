// @ts-nocheck
// Author: Jan Kalenda
import { NextRequest, NextResponse } from 'next/server'
import CryptoJS from 'crypto-js'
import prisma from '@prisma'
import { readFromFile } from '@/app/api/social/route'

// get plant data for my plants page, more data than overview
export const GET = async (
    request: NextRequest,
    { params }: { params: { userid: string } }
) => {
    try {
        const arr = CryptoJS.enc.Hex.parse(params.userid)
        const email = CryptoJS.enc.Utf8.stringify(arr)
        const plants = await prisma.plant.findMany({
            where: {
                email: email,
            },
            select: {
                species: {
                    select: {
                        name: true,
                        wateringPeriod: true,
                        wateringAmount: true,
                    },
                },
                waterings: {
                    select: {
                        dateWatered: true,
                    },
                },
                plantId: true,
                nickname: true,
                description: true,
                customImage: true,
            },
        })

        for (let i = 0; i < plants.length; i++) {
            const file_name = plants[i].customImage
            const content = await readFromFile(file_name)
            plants[i].customImage = content.toString()
        }

        return NextResponse.json(plants, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json(error, { status: 500 })
    }
}
