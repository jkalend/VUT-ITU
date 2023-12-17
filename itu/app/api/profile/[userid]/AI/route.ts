import { NextRequest, NextResponse } from 'next/server'
import CryptoJS from 'crypto-js'
import prisma from '@prisma'
import * as process from 'process'

export const GET = async (
    request: NextRequest,
    { params }: { params: { userid: string } }
) => {
    try {
        // console.log(params);
        const arr = CryptoJS.enc.Hex.parse(params.userid)
        const email = CryptoJS.enc.Utf8.stringify(arr)
        // console.log(email);

        const thread = await prisma.user.findUnique({
            where: {
                email: email,
            },
            select: {
                AiThread: true,
            },
        })

        let encrypted = CryptoJS.AES.encrypt(
            process.env.OPENAI_API_KEY,
            'ITUISSOOOSUPERDUPER'
        )

        const out = {
            ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
            iv: encrypted.iv.toString(),
            salt: encrypted.salt.toString(),
        }

        return NextResponse.json(
            { key: out, thread: thread?.AiThread },
            { status: 200 }
        )
    } catch (error) {
        console.log(error)
        return NextResponse.json(error, { status: 500 })
    }
}

export const POST = async (
    request: NextRequest,
    { params }: { params: { userid: string } }
) => {
    try {
        // console.log(params);
        const { thread } = await request.json()
        const arr = CryptoJS.enc.Hex.parse(params.userid)
        const email = CryptoJS.enc.Utf8.stringify(arr)
        // console.log(email);

        const user = await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                AiThread: thread,
            },
        })

        return NextResponse.json('Done', { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json(error, { status: 500 })
    }
}

export const DELETE = async (
    request: NextRequest,
    { params }: { params: { userid: string } }
) => {
    try {
        // console.log(params);
        const arr = CryptoJS.enc.Hex.parse(params.userid)
        const email = CryptoJS.enc.Utf8.stringify(arr)
        // console.log(email);

        const user = await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                AiThread: null,
            },
        })

        return NextResponse.json('Done', { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json(error, { status: 500 })
    }
}
