'use client';
import React from 'react'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'
import AddChatter from '@components/AddChatter'
import RemoveChatter from '@components/RemoveChatter'
import ConfirmDelete from '@components/ConfirmDelete'
import Chatter from '@/components/Chatter';
import TransferOwner from '@/components/TransferOwner';


const groupChat = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession();

    const [group, setGroup] = useState (null);
    const [chatters, setChatters] = useState ([]);
    const [addClicked, setAddClicked] = useState (true);
    const [removeClicked, setRemoveClicked] = useState (true);
    const [deleteClicked, setDeleteClicked] = useState (true);
    const [chatter, setChatter] = useState (null);
    const [transfer, setTransfer] = useState (true);

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
    }, [addClicked]);

    const toggleAdd = () => {
        setAddClicked(!addClicked)
    }

    const toggleDelete = () => {
        setDeleteClicked(!deleteClicked)
    }

    return (
        <div className={"main-div w-screen h-screen flex flex-row"}>          
            <div className="flex flex-row flex-wrap h-screen w-full m-5">
                <div className={"flex flex-col min-w-[70%] min-h-max"}>
                    <div className={"flex flex-row pr-5 pl-5"}>
                        <h1 className={"flex-grow m-5 items-center text-orange-200 max-w-md text-3xl font-semibold break-all"}>
                            {group?.name}
                        </h1>
                        <button className={"m-5 items-center bg-green-300 text-gray-600 rounded-md px-5 py-2 font-semibold hover:bg-green-400 hover:cursor-pointer"}
                            onClick={toggleAdd}>
                            Add User
                        </button>
                        <button className={"m-5 items-center bg-red-800 text-black rounded-md px-5 py-2 font-semibold hover:bg-red-900 hover:cursor-pointer"}
                            onClick={toggleDelete}>
                            Delete Group
                        </button>
                    </div>
                    <div className={"flex flex-col w-full h-full pl-10 pr-10"}>
                        <div className={"flex flex-col w-full h-full border border-black rounded-lg"}>
                        
                        </div>
                    </div> 
                </div>
                <div className="flex flex-col h-full flex-grow">
                    <div className={"flex flex-row justify-center items-center m-6"}>
                        <h1 className="font-semibold text-2xl justify-center items-center">List of members:</h1>
                    </div>
                    <div className="w-full h-full pl-5 pr-5">
                        <div className={"flex flex-col w-full"}>
                            {chatters.map ((c) =>
                                (<Chatter key={c.email} chatter={c} isClicked={removeClicked} setIsClicked={setRemoveClicked}
                                setChatter={setChatter} group={group} transfer={transfer} setTransfer={setTransfer}/>)
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <AddChatter isClicked={addClicked} setClicked={setAddClicked} group={group}/>
            <RemoveChatter isClicked={removeClicked} setClicked={setRemoveClicked} group={group} user={chatter}/>
            <ConfirmDelete isClicked={deleteClicked} setClicked={setDeleteClicked} group={group}/>
            <TransferOwner isClicked={transfer} setClicked={setTransfer} group={group}/>
        </div>      
    )
}

export default groupChat
