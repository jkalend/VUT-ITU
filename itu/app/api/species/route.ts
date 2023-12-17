// @ts-nocheck
// Author: Jan Kalenda
import prisma from '@/app/db'
import { NextRequest, NextResponse } from 'next/server'
//import { saveFile } from '@/app/api/social/route'

// get species data
export const GET = async (request: NextRequest) => {
    try {
        const species = await prisma.species.findMany({
            select: {
                speciesId: true,
                name: true,
            },
        })
        
        return NextResponse.json(species, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json(error, { status: 500 })
    }
}

// add new species
export const POST = async (request: NextRequest) => {
    try {
        return NextResponse.json('not added', { status: 403 })

        const { name, period, amount, image } = await request.json()
       // const image_name = `${name}.txt`
        const species = await prisma.species.create({
            data: {
                name: name,
                wateringPeriod: period,
                wateringAmount: amount,
                speciesImage: Buffer.from(image, "utf8"),
            },
        })
        
        return NextResponse.json(species, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json(error, { status: 500 })
    }
}
