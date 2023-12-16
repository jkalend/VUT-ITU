import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server"
import fsPromises from 'fs/promises';
import fs from 'fs'

const saveFile = async (filename : any, content : any) => {
    await fsPromises.writeFile(`./public/images/${filename}`, content);
};

const readFromFile = async (filename : any) => {
    const base64 = await fsPromises.readFile(`./public/images/${filename}`);
    return base64
}
const deleteFile = (filename : any) => {
    fs.unlink(filename, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        else {
            console.log("Success")
        }
    })
}

// GET - first 5x4 users in system
export const GET = async (
    request: NextRequest,
) => {
    try {
        // console.log(email);
        const species = await prisma.species.findMany({
            select: {
                speciesId: true,
                name: true,
            }
        });
        return NextResponse.json(species, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json(error, {status: 500});
    }
};

export const POST = async (
    request: NextRequest,
) => {
    try {
        const {name, period, amount, image} = await request.json();
        const image_name = `${name}.txt`
        console.log(image_name)
        const species = await prisma.species.create({
            data: {
                name: name,
                wateringPeriod: period,
                wateringAmount: amount,
                speciesImage: image_name,
            },
        });
        saveFile (species.speciesImage, image)
        species.speciesImage = image
        return NextResponse.json(species, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json(error, {status: 500});
    }
};
