// @ts-nocheck
// Author : Jaroslav Streit (xstrei06)

import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server"


// POST - create new group
export const POST = async (request: NextRequest, { params }) => {
    try {
        const { name, username } = await request.json();
        const group = await prisma.chatGroup.create({
            data: {
                name: name,
                ownerEmail: params.email,
                creator: username,
                users: {
                    connect: {
                        email: params.email
                    }
                }
            }
        })
        return new NextResponse(JSON.stringify(group), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Failed to group ' + error }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
            },
        });
    }
} 

// GET - fetch user groups
export const GET = async (request: NextRequest, { params }) => {
    try {
        const groups = await prisma.chatGroup.findMany({
            where: {
                users: {
                    some: {
                        email: params.email
                    }
                }
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
