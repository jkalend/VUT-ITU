// @ts-nocheck
// Author : Jaroslav Streit (xstrei06)

"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function createGroup({isClicked, setClicked} : {isClicked: boolean, setClicked: any}) {
    const { data: session } = useSession();
    const [name, setName] = useState("");
  
    // create group
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault ();
        const res = await fetch(`/api/chat/${session?.user?.email}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "name": name, 
                "username": session?.user?.name
            }),
        });
        setClicked(!isClicked);
        setName("");
        if (!res.ok) {
            console.log ("Error")
        }
    }

    // create group on enter key press
    const handleKeyDown = async (event: any) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          await onSubmit(event);
        }
    };

    // handle group name input
    const handleName = (event: any) => {
        setName(event.target.value);
    }
    
    return (
        <div className={`${isClicked ? "collapse backdrop-blur-0" : "backdrop-blur-[5px]"} flex fixed z-30 items-center justify-center w-screen h-screen left-0 transition-all duration-200`}>
            <button className={`w-screen h-screen`} onClick={() => setClicked(!isClicked)}/>
            <div className={`${isClicked ? "hidden" : ""} p-10 top-32 flex fixed hover:cursor-auto bg-[#736349] rounded-2xl justify-center items-start flex-col`}>
                <div className="text-4xl text-bold">
                    <div>
                        Create Group
                    </div>
                </div>
                <form onSubmit={onSubmit} className='mt-5 w-full max-w-2xl flex flex-col gap-7 glassmorphism'>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        onChange={handleName}
                        onKeyDown={handleKeyDown}
                        placeholder='Enter Group Name'
                        required
                        maxLength={45}
                        className='text-black block p-2.5 w-full rounded-lg'
                    />
                    <button type='submit' className='text-gray-700 bg-amber-300 hover:bg-amber-400 outline-1 outline-red-500 hover:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'>
                        Create Group
                    </button>
                </form>
            </div>
        </div>
    );
}