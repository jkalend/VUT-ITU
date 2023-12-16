import {NextRequest, NextResponse} from "next/server";
import CryptoJS from "crypto-js";
import prisma from "@prisma";

export const GET = async (
    request: NextRequest,
    {params}: { params: { userid: string } },
) => {
    try {
        // console.log(params);
        const arr = CryptoJS.enc.Hex.parse(params.userid);
        const email = CryptoJS.enc.Utf8.stringify(arr);
        // console.log(email);
        const plants = await prisma.plant.findMany({
            where: {
                email: email,
            },
            select: {
                species: {
                    select: {
                        name: true,
                        wateringPeriod: true,
                    }
                },
                waterings: {
                    select: {
                        dateWatered: true,
                    }
                },
                plantId: true,
                nickname: true,
                description: true,
            }
        });

        return NextResponse.json(plants, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json(error, {status: 500});
    }
};