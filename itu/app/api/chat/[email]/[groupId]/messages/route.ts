import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server"

// POST - send message
export const POST = async (request: NextRequest, { params }) => {
    try { 
        const { text } = await request.json();
        const message = await prisma.message.create({
            data: {
                groupId: Number(params.groupId),
                text: text,
                email: params.email,
            },               
        });
        
        return new NextResponse(JSON.stringify(message), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.log(error);
        return new NextResponse(JSON.stringify({ error: "Failed to send message: " + (error as Error).message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
} 

// GET - fetch messages
export const GET = async (request: NextRequest, { params }) => {
    try {
        const messages = await prisma.message.findMany({
            where: {
                groupId: Number(params.groupId)
            },
            take: 100,
            orderBy: {
                dateCreated: 'asc'
            },
            include: {
                author: {
                    select: {
                        username: true,
                        email: true,
                    }
                }
            }
        });

        return new NextResponse(JSON.stringify(messages), { status: 200 })
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ error: "Failed to fetch group members", message: error.message }), { status: 500 });

    }
} 


// DELETE - remove message
export const DELETE = async (request: NextRequest, { params }) => {
    try {
        const { messageId } = await request.json();
        const message = await prisma.message.delete({
            where: {
                messageId: Number(messageId)
            },
        });

        return new NextResponse(JSON.stringify(message), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ error: "Failed to remove member: " + (error as Error).message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
} 
