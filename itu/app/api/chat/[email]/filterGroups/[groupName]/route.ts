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
        return new Response(JSON.stringify(groups), { status: 200 })
    } catch (error) {
        return new Response("Failed to fetch groups" + error, { status: 500 })
    }
}