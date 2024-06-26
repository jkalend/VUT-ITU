// @ts-nocheck
// Author : Jaroslav Streit (xstrei06)

import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server"


// GET - fetch group
export const GET = async (request: NextRequest, { params }) => {
    try {
        const group = await prisma.chatGroup.findUnique({
            where: {
                groupId: Number(params.groupId)
            }
        });
        if (!group) {
            return new NextResponse(JSON.stringify({ error: 'Group not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        return new NextResponse(JSON.stringify(group), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ error: 'Failed to fetch group', message: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
} 

// DELETE - delete group
export const DELETE = async (request: NextRequest, { params }) => {
    try {
        const deletedGroup = await prisma.chatGroup.delete({
            where:{
                groupId: Number(params.groupId)
            }
        });
        if (deletedGroup) {
            return new NextResponse(JSON.stringify(deletedGroup), {
                 status: 200, 
                 headers: { 
                    'Content-Type': 'application/json' 
                }
            });
        } else {
            return new NextResponse(JSON.stringify({ error: 'Group not found' }), {
                status: 404, 
                headers: { 
                    'Content-Type': 'application/json' 
                }
            });
        }
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ error: "Failed to delete group: " + (error as Error).message }), { 
            status: 500, 
            headers: { 
                'Content-Type': 'application/json' 
            }
        });
    }
} 

// PUT - update group name
export const PUT = async (request: NextRequest, { params }) => {
    try {
        const { name } = await request.json();
        const updatedGroup = await prisma.chatGroup.update({
            where: {
                groupId: Number(params.groupId)
            },
            data: {
                name: name
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

