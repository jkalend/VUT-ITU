// @ts-nocheck
// Author: Jan Kalenda
import prisma from '@/app/db'
import { NextRequest, NextResponse } from 'next/server'
import { readFromFile } from '@/app/api/social/route'

var CryptoJS = require('crypto-js')

// get plant data for overview
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
            include: {
                species: {
                    select: {
                        name: true,
                        wateringPeriod: true,
                        wateringAmount: true,
                    },
                },
                waterings: {
                    orderBy: {
                        dateWatered: 'desc',
                    },
                    take: 1,
                    select: {
                        wateringId: true,
                        dateWatered: true,
                    },
                },
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
