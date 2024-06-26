// @ts-nocheck
// Author: Jan Kalenda
import prisma from '@/app/db'
import { NextRequest, NextResponse } from 'next/server'

var CryptoJS = require('crypto-js')

// get settings
export const GET = async (
    request: NextRequest,
    { params }: { params: { userid: string } }
) => {
    try {
        const arr = CryptoJS.enc.Hex.parse(params.userid)
        const email = CryptoJS.enc.Utf8.stringify(arr)
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
            select: {
                stgDays: true,
            },
        })

        return NextResponse.json(user?.stgDays, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json(error, { status: 500 })
    }
}

// update settings
export const PUT = async (
    request: NextRequest,
    { params }: { params: { userid: string } }
) => {
    try {
        const { stgDays } = await request.json()
        const arr = CryptoJS.enc.Hex.parse(params.userid)
        const email = CryptoJS.enc.Utf8.stringify(arr)
        const user = await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                stgDays: stgDays,
            },
        })

        return NextResponse.json('Done', { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json(error, { status: 500 })
    }
}
