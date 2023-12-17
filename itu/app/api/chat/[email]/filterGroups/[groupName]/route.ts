// @ts-nocheck
// Author : Jaroslav Streit (xstrei06)

import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server"


// GET - fetch user groups
export const GET = async (request: NextRequest, { params }) => {
    try {
        const groups = await prisma.chatGroup.findMany({
            where: {
                users: {
                    some: {
                        email: params.email
                    }
                },
                name: params.groupName
            }
        })
        return new NextResponse(JSON.stringify(groups), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Failed to fetch groups ' + error }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
            },
        });
    }
}