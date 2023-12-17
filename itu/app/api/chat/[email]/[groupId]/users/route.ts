// @ts-nocheck
// Author : Jaroslav Streit (xstrei06)

import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server"


// POST - add member
export const POST = async (request: NextRequest, { params }) => {
    try {
        const { email } = await request.json();
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            return new NextResponse(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const group = await prisma.chatGroup.update({
            where: {
                groupId: Number(params.groupId)
            },
            data: {
                users: {
                    connect: {
                        email: email
                    }
                }
            }
        });

        return new NextResponse(JSON.stringify(group), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ error: "Failed to add member: " + (error as Error).message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
} 

// GET - fetch members
export const GET = async (request: NextRequest, { params }) => {
    try {
        const members = await prisma.chatGroup.findUnique({
            where: {
                groupId: Number(params.groupId)
            },
            select: {
                users: true
            }
        });

        return new NextResponse(JSON.stringify(members?.users), { 
            status: 200,
            headers: { 
                'Content-Type': 'application/json' 
            }
        })
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ error: "Failed to fetch group members", message: error.message }), {
            status: 500,
            headers: { 
                'Content-Type': 'application/json' 
            }
        });
    }
} 


// DELETE - remove member
export const DELETE = async (request: NextRequest, { params }) => {
    try {
        const { email } = await request.json();
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            return new NextResponse(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: { 
                    'Content-Type': 'application/json' 
                }
            });
        }

        const group = await prisma.chatGroup.update({
            where: {
                groupId: Number(params.groupId)
            },
            data: {
                users: {
                    disconnect: {
                        email: email
                    }
                }
            }
        });

        return new NextResponse(JSON.stringify(group), { 
            status: 200,
            headers: { 
                'Content-Type': 'application/json' 
            }
        });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ error: "Failed to remove member: " + (error as Error).message }), {
            status: 500, 
            headers: { 
                'Content-Type': 'application/json' 
            }
        });
    }
} 

// PUT - update group owner
export const PUT = async (request: NextRequest, { params }) => {
    try {
        const { email } = await request.json();
        const updatedGroup = await prisma.chatGroup.update({
            where: {
                groupId: Number(params.groupId)
            },
            data: {
                ownerEmail: email
            }
        });
        return new NextResponse(JSON.stringify(updatedGroup), { 
            status: 200, 
            headers: { 
                'Content-Type': 'application/json' 
            }
        });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ error: "Failed to update group: " + (error as Error).message }), { 
            status: 500, 
            headers: { 
                'Content-Type': 'application/json' 
            }
        });
    }
}
