'use client';
import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'
import AddChatter from '@components/AddChatter'
import RemoveChatter from '@components/RemoveChatter'
import ConfirmDelete from '@components/ConfirmDelete'
import Chatter from '@/components/Chatter';
import TransferOwner from '@/components/TransferOwner';
import Message from '@/components/Message';


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
    const [message, setMessage] = useState ("");
    const [messages, setMessages] = useState ([]);
    const [messageSent, setMessageSent] = useState (false);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (status === "unauthenticated"){
            router.push("/login");
        }
    }, [status]);

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

    const fetchMessages = async () => {
        try {
            const response = await fetch(`/api/chat/${session?.user?.email}/${params.groupId}/messages`,{
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                });
            const data = await response.json();
            console.log(data)
            setMessages(data);
        }
        catch (err) {
            console.log("Error" + err)
        }
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault ();
        const res = await fetch(`/api/chat/${session?.user?.email}/${params.groupId}/messages`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "text": message,
            }),
        });
        setMessage("");
        setMessageSent(!messageSent);
        if (!res.ok) {
            console.log(res.status)
        }
    }

    const handleKeyDown = async (event: any) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          await onSubmit(event);
        }
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
        inputRef.current?.focus();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        fetchChatters();
    }, [addClicked, removeClicked, transfer]);

    useEffect(() => {
        fetchMessages();
    }, [messageSent]);

    const toggleAdd = () => {
        setAddClicked(!addClicked)
    }

    const toggleDelete = () => {
        setDeleteClicked(!deleteClicked)
    }

    const handleMessage = (event: any) => {
        setMessage(event.target.value);
    }

    return (
        <div className={"main-div w-screen flex flex-row"}>          
            <div className="flex flex-row flex-wrap w-full m-5">
                <div className={"flex flex-col max-w-[70%]"}>
                    <div className={"flex flex-row pr-20 pl-10"}>
                        <h1 className={"flex-grow pl-10 m-5 items-center text-orange-200 max-w-md text-3xl font-semibold break-all"}>
                            {group?.name}
                        </h1>
                        {group?.ownerEmail === session?.user?.email ?
                        (
                            <>
                            <button className={"m-5 items-center bg-green-300 text-gray-700 rounded-md px-5 py-2 font-semibold hover:bg-green-400 hover:cursor-pointer"}
                                    onClick={toggleAdd}>
                                    Add User
                            </button><button className={"m-5 items-center bg-red-800 text-black rounded-md px-5 py-2 font-semibold hover:bg-red-900 hover:cursor-pointer"}
                                onClick={toggleDelete}>
                                    Delete Group
                            </button>
                            </>
                        )
                        :
                        ("")}
                    </div>
                    <div className={"flex flex-col w-full h-[70vmin] pl-20 pr-20"}>
                        <div className={"flex flex-col w-full h-full relative border bg-gray-600 border-black overflow-y-auto"}>
                            <div className="flex flex-col w-full ">
                                {messages.map ((m) =>
                                    (<Message key={m.messageId} message={m} messageSent={messageSent} setMessageSent={setMessageSent}/>)
                                )}
                                <div ref={messagesEndRef}/>                                  
                            </div>
                        </div>
                        <div className="flex flex-row w-full">
                            <form onSubmit={onSubmit} className='flex w-full max-w-full flex-row glassmorphism'>
                                <textarea
                                    name="message"
                                    id="message"
                                    value={message}
                                    onChange={handleMessage}
                                    onKeyDown={handleKeyDown}
                                    placeholder='Write a message...'
                                    required
                                    maxLength={500}
                                    className='p-2.5 w-full h-auto min-h-16 text-white border border-black bg-gray-500 resize-none overflow-y-auto max-h-[300px]'
                                />
                            </form>
                        </div>
                    </div> 
                </div>
                <div className="flex flex-col h-full flex-grow">
                    <div className={"flex flex-row justify-center items-center m-6"}>
                        <h1 className="font-semibold text-2xl justify-center items-center">List of members:</h1>
                    </div>
                    <div className="w-full h-[70vmin] pl-5 pr-5">
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
