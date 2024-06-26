// @ts-nocheck
// Author : Jaroslav Streit (xstrei06)

"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Chatter({ chatter, isClicked, setIsClicked, setChatter, group, transfer, setTransfer} 
    : {chatter: any, isClicked: boolean, setIsClicked: any, setChatter: any, group: any, transfer: boolean, setTransfer: any}) {

    const { data: session } = useSession();

    // toggle remove member form
    const toggleRemove = () => {
        setChatter(chatter);
        setIsClicked(!isClicked);
    }

    // toggle transfer ownership form
    const toggleTransfer = () => {
        setTransfer(!transfer);
    }

    if(group !== null){
        return (
            <div className="flex flex-row w-full h-12 border border-black bg-gray-500 rounded-xl items-center">
                {group.ownerEmail === chatter.email ? 
                (
                    <button className={`${group.ownerEmail !== session?.user?.email ? "pointer-events-none" : "" } flex h-11 aspect-square pl-2 items-center justify-center`}
                    onClick={group.ownerEmail === session?.user?.email ? toggleTransfer : undefined}
                    >
                        <Image
                            className={"flex-auto"}
                            src={"/crown.png"}
                            alt={"Remove member"}
                            width={10}
                            height={10}
                            unoptimized={true}
                        />
                    </button>
                )
                :
                (
                    <div className={"flex h-11 aspect-square pl-2 items-center justify-center"}/>
                )}
                <div className="flex flex-grow flex-col items-center justify-center">
                    <h1 className="text-black items-center justify-center font-semibold">@{chatter.username}</h1>
                    <p className="text-gray-300 text-xs items-center justify-center font-semibold">{chatter.email}</p>
                </div>
                {group.ownerEmail === session?.user?.email || chatter.email === session?.user?.email ?
                    (
                    <button onClick={group.ownerEmail === chatter.email ? toggleTransfer : toggleRemove} className="flex h-10 aspect-square items-center justify-center">
                        <Image
                            className={"flex-auto"}
                            src={"/remove-user.png"}
                            alt={"Remove member"}
                            width={10}
                            height={10}
                            unoptimized={true}
                        />
                    </button>
                    )
                    :
                    (
                    <div className={"flex h-11 aspect-square items-center justify-center"}/>
                    )}
            </div>
        );
    } else {
        return (
            <div className="flex flex-row w-full h-12 border border-black bg-gray-500 rounded-xl">
                <div className="flex w-[76%] items-center justify-center">
                    <h2 className="text-black items-center justify-center font-semibold">Loading...</h2>
                </div>
            </div>
        );
    }
}