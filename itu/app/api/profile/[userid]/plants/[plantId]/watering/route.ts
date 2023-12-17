// @ts-nocheck
// Author: Jan Kalenda
import prisma from '@/app/db'
import { NextRequest, NextResponse } from 'next/server'

// get plant data for overview
export const POST = async (
    request: NextRequest,
    { params }: { params: { userid: string; plantId: string } }
) => {
    try {
        const { amount } = await request.json()

        const _ = await prisma.watering.create({
            data: {
                plantId: Number(params.plantId),
                amount: 0,
                dateWatered: new Date(
                    Date.now() + amount * (1000 * 60 * 60 * 24)
                ),
            },
        })

        return NextResponse.json('Done', { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json(error, { status: 500 })
    }
}
