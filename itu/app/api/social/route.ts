// @ts-nocheck
/**
 * author: Tereza Kubincova (xkubin27)
 */

// POST - create new post
import prisma from '@/app/db'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
    try {
        const { email, image, desc } = await request.json()
        const image_name = `${email}${Date.now()}.txt`
        const post = await prisma.post.create({
            data: {
                email: email,
                image: Buffer.from(image, "utf8"),
                description: desc,
            },
        })

        return new Response(JSON.stringify(post), { status: 200 })
    } catch (error) {
        console.log(error)
        return new Response('Failed to create post ' + error, { status: 500 })
    }
}

export const DELETE = async (request: NextRequest) => {
    try {
        const { postId } = await request.json()
        console.log(postId)
        const post = await prisma.post.findUnique({
            where: {
                postId: postId,
            },
            select: {
                image: true,
            },
        })
        console.log(post)
        const post_deleted = await prisma.post.delete({
            where: {
                postId: postId,
            },
        })
        console.log('post delted', post_deleted)
        return new Response(JSON.stringify(post_deleted), { status: 200 })
    } catch (error) {
        console.log(error)
        return new Response('Failed to create post ' + error, { status: 500 })
    }
}

// GET - fetch latest posts
export const GET = async (request: NextRequest) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                likedBy: true,
                creator: true,
                comments: {
                    include: {
                        author: true,
                    },
                },
            },
        })
        for (let i = 0; i < posts.length; i++) {
            posts[i].image = posts[i].image.toString("utf8")
        }
        console.log(posts.length)
        return new Response(JSON.stringify(posts), { status: 200 })
    } catch (error) {
        return NextResponse.json('Failed to fetch posts' + error, {
            status: 500,
        })
    }
}

// PUT set like count
export const PUT = async (request: NextRequest) => {
    try {
        const { email, postId } = await request.json()
        const post = await prisma.post.findFirst({
            where: {
                postId: postId,
            },
            include: {
                likedBy: true,
            },
        })
        console.log(post)
        const alreadyLiked = post.likedBy.some((user) => user.email === email)
        if (alreadyLiked)
            return new Response(JSON.stringify(post.likedBy.length), {
                status: 200,
            })
        else {
            const add_like = await prisma.post.update({
                where: {
                    postId: postId,
                },
                data: {
                    likedBy: {
                        connect: {
                            email: email,
                        },
                    },
                },
            })
            const add_like2 = await prisma.user.update({
                where: {
                    email: email,
                },
                data: {
                    likes: {
                        connect: {
                            postId: postId,
                        },
                    },
                },
            })
            console.log(post.likedBy)
            return new Response(JSON.stringify(post.likedBy.length + 1), {
                status: 200,
            })
        }
    } catch (error) {
        console.log(error)
        return new Response('Failed to create post' + error, { status: 500 })
    }
}
