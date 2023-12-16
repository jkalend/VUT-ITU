import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server"

// GET - fetch messages
export const GET = async (request: NextRequest, { params }) => {
    try {
        const messages = await prisma.message.findMany({
            where: {
                groupId: Number(params.groupId)
            },
            take: Number(params.limit),
            orderBy: {
                dateCreated: 'desc'
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