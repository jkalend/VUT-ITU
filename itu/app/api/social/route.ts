// @ts-nocheck
/**
 * author: Tereza Kubincova (xkubin27)
 */

// POST - create new post
import prisma from '@/app/db'
import { NextRequest, NextResponse } from 'next/server'
import fsPromises from 'fs/promises'
import fs from 'fs'

export const saveFile = async (filename: any, content: any) => {
    await fsPromises.writeFile(`./public/images/${filename}`, content)
}

export const readFromFile = async (filename: any) => {
    const env = process.env.NODE_ENV
    if (env == 'development') {
        const base64 = await fsPromises.readFile(`public/images/${filename}`)
        return base64
    } else if (env == 'production') {
        //const base64 = await fsPromises.readFile(`/images/${filename}`)
        console.log('reading from file')
        const abc = await fsPromises.writeFile(`images.txt`, 'Hello World')
        console.log('abc')
        const d = await fsPromises.realpath('images.txt')
        console.log(d)
        const base64 = await fsPromises.readFile(`test.txt`)
        return base64
    }
}
export const deleteFile = async (filename: any) => {
    await fs.unlink(filename, (err) => {
        if (err) {
            console.error(err)
            return
        } else {
            console.log('Success')
        }
    })
}

export const POST = async (request: NextRequest) => {
    try {
        const { email, image, desc } = await request.json()
        const image_name = `${email}${Date.now()}.txt`
        const post = await prisma.post.create({
            data: {
                email: email,
                image: image_name,
                description: desc,
            },
        })
        saveFile(post.image, image)
        post.image = image
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
        const env = process.env.NODE_ENV
        if (env == 'development') {
            deleteFile(`public/images/${post.image}`)
        } else if (env == 'production') {
            deleteFile(`/images/${post.image}`)
        }

        //deleteFile(`public/images/${post.image}`)
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
            const file_name = posts[i].image
            const content = await readFromFile(file_name)
            posts[i].image = content.toString()
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
