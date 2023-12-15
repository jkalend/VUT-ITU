"use client";
import {useState, useEffect} from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function confirmDelete({isClicked, setClicked, group} : {isClicked: boolean, setClicked: any, group: any}) {
    const { data: session } = useSession();
    const router = useRouter();
  

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault ();
        const res = await fetch(`/api/chat/${session?.user?.email}/${group.groupId}`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
        });
        setClicked(!isClicked);
        if (!res.ok) {
            console.log ("Error")
        }
        router.push("/chat");
    }
    
    return (
        <div className={`${isClicked ? "collapse backdrop-blur-0" : "backdrop-blur-[5px]"} flex fixed z-30 items-center justify-center w-screen h-screen left-0 transition-all duration-200`}>
            <button className={`w-screen h-screen`} onClick={() => setClicked(!isClicked)}/>
            <div className={`${isClicked ? "hidden" : ""} p-10 top-32 flex fixed hover:cursor-auto bg-[#736349] rounded-2xl justify-center items-start flex-col`}>
                <div className="">
                    <div className="text-4xl text-bold flex flex-auto justify-center items-center">
                        Are you sure?
                    </div>
                </div>
                <form onSubmit={onSubmit} className='mt-5 w-full max-w-2xl flex flex-row gap-7 glassmorphism'>
                    <button type='submit' className='text-black bg-red-800 hover:bg-red-900 outline-1 outline-red-500 hover:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'>
                        Delete Group
                    </button>
                    <button type="button" className='text-black bg-amber-400 hover:bg-amber-500 outline-1 outline-red-500 hover:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
                    onClick={() => setClicked(!isClicked)}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}