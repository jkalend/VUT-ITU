// POST - create new post
import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server"
import fsPromises from 'fs/promises';

// PUT set like count
export const PUT = async (request: NextRequest) => {
    try {
        const { postId, desc } = await request.json();
        const post = await prisma.post.update({
            where: {
                postId: postId
            },
            data: {
                description: desc
            }
        })
        
        return new Response(JSON.stringify(post), { status: 200 })
    } catch (error) {
        console.log(error)
        return new Response("Failed to create post"+error, { status: 500 })
    }
} 

// PUT set like count
export const POST = async (request: NextRequest) => {
    try {
        const { email, postId, text } = await request.json();
        const comment = await prisma.comment.create({
            data: {
                text: text,
                email: email,
                postId: postId
            }
        })
        
        return new Response(JSON.stringify(comment), { status: 200 })
    } catch (error) {
        console.log(error)
        return new Response("Failed to add comment "+error, { status: 500 })
    }
} 

// PUT set like count
export const DELETE = async (request: NextRequest) => {
    try {
        const { commentId } = await request.json();
        const comment = await prisma.comment.delete({
            where: {
                commentId:commentId
            }
        })
        
        return new Response(JSON.stringify(comment), { status: 200 })
    } catch (error) {
        console.log(error)
        return new Response("Failed to add comment "+error, { status: 500 })
    }
} 