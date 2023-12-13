'use client';
import React from 'react'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'


const groupChat = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession();

    const [group, setGroup] = useState (null);
    const [chatters, setChatters] = useState ([]);
    const [addClicked, setAddClicked] = useState (false);
    const [removeClicked, setRemoveClicked] = useState (false);

    const fetchGroup = async () => {
        try {
            const response = await fetch(`/api/chat/${session?.user?.email}/${params.groupId}`,{
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                });
            const data = await response.json();
            console.log(data)
            setGroup(data);
        }
        catch (err) {
            console.log("Error" + err)
        }
    };

    useEffect(() => {
        if (status === "authenticated"){
            fetchGroup();
        }
    }, [status]);

    const fetchChatters = async () => {
        try {
            const response = await fetch(`/api/chat/${session?.user?.email}/${params.groupId}/users`,{
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                });
            const data = await response.json();
            console.log(data)
            setChatters(data);
        }
        catch (err) {
            console.log("Error" + err)
        }
    };

    useEffect(() => {
        fetchChatters();
    }, [addClicked, removeClicked]);

    const deleteGroup = async () => {
        try {
            const response = await fetch(`/api/chat/${session?.user?.email}/${params.groupId}`,{
                    method: "DELETE",
                    headers: {"Content-Type": "application/json"},
                });
            const data = await response.json();
            console.log(data)
        }
        catch (err) {
            console.log("Error" + err)
        }
        router.push("/chat");
    }

    return (
        <div className={"main-div"}>
            <div className={"flex flex-col relative h-full py-15 px-15 gap-10"}>
                <div className={"mx-16 flex flex-row m-10"}>
                    <h1 className={"text-orange-200 max-w-md text-3xl font-semibold break-all"}>
                        {group?.name}
                    </h1>
                    <button className={"ml-10 bg-green-200 text-gray-600 rounded-md px-5 py-2 font-semibold hover:bg-green-300 hover:cursor-pointer"}
                        >
                        Add User
                    </button>
                    <button className={"ml-10 bg-orange-200 text-gray-600 rounded-md px-5 py-2 font-semibold hover:bg-orange-300 hover:cursor-pointer"}
                        >
                        Remove User
                    </button>
                    <button className={"ml-10 bg-red-800 text-black rounded-md px-5 py-2 font-semibold hover:bg-red-900 hover:cursor-pointer"}
                        onClick={deleteGroup}>
                        Delete Group
                    </button>
                </div>
            </div>
        </div>      
    )
}

export default groupChat
