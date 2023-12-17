// @ts-nocheck
// Author : Jaroslav Streit (xstrei06)

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
import Image from 'next/image';


const GroupChat = () => {
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
    const [edit, setEdit] = useState (false);
    const [groupName, setGroupName] = useState ("");
    const [totalMessages, setTotalMessages] = useState(100);
    const [scrollDown, setScrollDown] = useState(false);

    const messagesEndRef = useRef(null); // reference to the last message
    
    // redirect to overview if user is unauthenticated
    useEffect(() => {
        if (status === "unauthenticated"){
            router.push("/");
        }
    }, [status]);


    // fetch group data
    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const response = await fetch(`/api/chat/${session?.user?.email}/${params.groupId}`,{
                        method: "GET",
                        headers: {"Content-Type": "application/json"},
                    });
                const data = await response.json();
                console.log(data)
                setGroup(data);
                setGroupName(data?.name);
            }
            catch (err) {
                console.log("Error" + err)
            }
        };

        if (status === "authenticated"){
            fetchGroup();
        }
    }, [status, edit]);

    // fetch all users in group
    const fetchChatters = async () => {
        try {
            const response = await fetch(`/api/chat/${session?.user?.email}/${params.groupId}/users`,{
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
            });
            if(!response.ok) {
                console.log(response.status)
            }else{
                const data = await response.json();
                console.log(data);
                setChatters(data);
            }
        }
        catch (err) {
            console.log("Error" + err);
        }
    };

    // send message on enter key press
    const handleKeyDownMessage = async (event: any) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          await onSubmit(event);
        }
    };

    // edit group name on enter key press
    const handleKeyDownGroup = async (event: any) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          await onEdit(event);
        }
    };

    // set scroll to bottom on first render
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, []);
    
    // function to scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }

    // scroll to bottom on first render
    useEffect(() => {
        scrollToBottom();
    }, []);

    function timeout(delay: number) {
        return new Promise( res => setTimeout(res, delay) );
    }

    // scroll to bottom after one second delay when new message is sent
    useEffect(() => {
        async function scroll() {
            await timeout(1000);
            scrollToBottom();
        }
        scroll();
    }, [scrollDown, status, params.groupId, session]);


    let scrollContainer: HTMLElement | null = null;
    // handle scroll to top to load more messages
    useEffect(() => {
        if (typeof document !== 'undefined') {
            scrollContainer = document.getElementById('scroll');
        }
        const handleScroll = () => {
            const scrolledToTop = scrollContainer?.scrollTop === 0;
            if (scrolledToTop) {
                const additionalMessages = 50;
                setTotalMessages(prevTotal => prevTotal + additionalMessages);
            }
        };
    
        scrollContainer?.addEventListener('scroll', handleScroll);
        return () => {
            scrollContainer?.removeEventListener('scroll', handleScroll);
        };
    }, [scrollContainer]);

    // fetch all users in group on add/remove user
    useEffect(() => {
        fetchChatters();
    }, [addClicked, removeClicked, transfer, status, session, params.groupId]);

    // fetch all messages in group every 3 seconds or when new message is sent by current user
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`/api/chat/${session?.user?.email}/${params.groupId}/messages/${totalMessages}`,{
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                });                    
                if (!response.ok) {
                    console.log(response.status)
                }else{
                    const data = await response.json();
                    console.log(data);
                    if(data.reverse() !== messages){
                        setMessages(data);
                    }
                }
            }
            catch (err) {
                console.log(err)
            }
        }

        fetchMessages();

        const interval = setInterval(() => {
            fetchMessages();
        }, 3000);

        return () => {
            clearInterval(interval);
          };
    }, [messageSent, session, params.groupId, totalMessages]);

    // save new message to database
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
        setScrollDown(!scrollDown);
        if (!res.ok) {
            console.log(res.status)
        }
    }

    // toggle add user form
    const toggleAdd = () => {
        setAddClicked(!addClicked)
    }

    // toggle remove user form
    const toggleDelete = () => {
        setDeleteClicked(!deleteClicked)
    }

    // handle message input
    const handleMessage = (event: any) => {
        setMessage(event.target.value);
    }

    // handle group name input
    const handleGroupName = (event: any) => {
        setGroupName(event.target.value);
    }

    // save new group name to database
    const onEdit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault ();
        if(groupName !== group?.name) {
            const res = await fetch(`/api/chat/${session?.user?.email}/${params.groupId}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    "name": groupName,
                }),
            });
        }
        setEdit(!edit);
    }

    return (
        <div className={"main-div w-screen flex flex-row"}>          
            <div className="flex flex-row flex-wrap w-full m-5">
                <div className={"flex flex-col w-[70%]"}>
                    <div className={"flex flex-row pr-20 pl-10"}>
                        {edit ?
                        (
                            <div className="flex-grow pl-10 m-5 mr-1 items-center w-full max-w-md break-words h-auto">
                                <form onSubmit={onEdit} className='flex max-w-md flex-row glassmorphism'>
                                    <textarea
                                        name="groupName"
                                        id="groupName"
                                        value={groupName}
                                        onChange={handleGroupName}
                                        onKeyDown={handleKeyDownGroup}
                                        required
                                        maxLength={45}
                                        className='p-2 flex-grow h-auto text-black border border-black bg-gray-200 resize-none overflow-y-auto max-h-[300px]'
                                    />
                                </form>
                            </div>
                        )
                        :
                        (
                            <h1 className={"flex-grow pl-10 m-5 mr-1 items-center text-orange-200 max-w-md w-full text-3xl font-semibold break-all "}>
                                {group?.name}
                            </h1>
                        )}
                        {group?.ownerEmail === session?.user?.email && group !== null ?
                        (
                            <div className="flex flex-row flex-grow items-end">
                                <button className={`${edit ? "bg-green-500" : ""} flex mb-6 min-w-24 flex-shrink-0 aspect-square items-center justify-center`}
                                    onClick={() => setEdit(!edit)}>
                                    <div className="flex-auto flex-grow min-w-16 min-h-16 flex-shrink-0">
                                        <Image
                                            src={"/edit_icon.png"}
                                            alt={"Edit Icon"}
                                            width={32}
                                            height={32}
                                            unoptimized={true}
                                        />
                                    </div>
                                </button>
                                <button className={"flex justify-center m-5 mr-0 p-3 items-center max-h-12 bg-green-400 text-gray-800 rounded-md font-semibold hover:bg-green-500 hover:cursor-pointer"}
                                        onClick={toggleAdd}>
                                        Add User
                                </button><button className={"flex justify-center m-5 mr-0 p-3 items-center max-h-12 bg-red-800 text-black rounded-md font-semibold hover:bg-red-900 hover:cursor-pointer"}
                                    onClick={toggleDelete}>
                                        Delete Group
                                </button>
                            </div>
                        )
                        :
                        ("")}
                    </div>
                    <div className={"flex flex-col w-full h-[70vmin] pl-20 pr-20"}>
                        <div className={"flex flex-col w-full h-full relative border bg-gray-600 border-black overflow-y-auto"} id="scroll">
                            <div className="flex flex-col w-full" >
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
                                    onKeyDown={handleKeyDownMessage}
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

export default GroupChat
