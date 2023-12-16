"use client";
import {useState, useEffect} from "react";
import { useSession } from "next-auth/react";

export default function addChatter({isClicked, setClicked, group} : {isClicked: boolean, setClicked: any, group: any}) {
    const { data: session } = useSession();
    const [email, setEmail] = useState("");

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault ();
        const res = await fetch(`/api/chat/${session?.user?.email}/${group.groupId}/users`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "email": email,
            }),
        });
        setClicked(!isClicked);
        setEmail("");
        if (!res.ok) {
            console.log ("Error")
        }
    }
    
    const handleEmail = (event: any) => {
        setEmail(event.target.value);
    }
    
    return (
        <div className={`${isClicked ? "collapse backdrop-blur-0" : "backdrop-blur-[5px]"} flex fixed z-30 items-center justify-center w-screen h-screen left-0 transition-all duration-200`}>
            <button className={`w-screen h-screen`} onClick={() => setClicked(!isClicked)}/>
            <div className={`${isClicked ? "hidden" : ""} p-10 top-32 flex fixed hover:cursor-auto bg-[#736349] rounded-2xl justify-center items-start flex-col`}>
                <div className="text-4xl text-bold">
                    <div>
                        Transfer ownership
                    </div>
                </div>
                <form onSubmit={onSubmit} className='mt-5 w-full max-w-2xl flex flex-col gap-7 glassmorphism'>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={email}
                        onChange={handleEmail}
                        placeholder='Enter user email'
                        required
                        className='text-black block p-2.5 w-full rounded-lg'
                    />
                    <div className="flex flex-row justify-center items-center">
                        <button type='submit' className='text-gray-700 mr-5 bg-green-500 hover:bg-green-600 outline-1 outline-red-500 hover:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
                            >
                            Transfer
                        </button>
                        <button type='button' className='text-gray-700 ml-5 bg-amber-400 hover:bg-amber-500 outline-1 outline-red-500 hover:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
                            onClick={() => setClicked(!isClicked)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}