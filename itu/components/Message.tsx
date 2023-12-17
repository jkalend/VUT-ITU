import { format, set } from 'date-fns';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';

export default function Message({ message, messageSent, setMessageSent } : {message: any, messageSent: boolean, setMessageSent: any}) {
    const { data: session } = useSession();
    const params = useParams();

    const date = format(new Date(message.dateCreated), 'dd/MM/yyyy HH:mm');
    const [edit, setEdit] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(false);
    const [msg, setMsg] = useState(message.text);
    
    const onEdit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault ();
        if(msg !== message.text) {
            const res = await fetch(`/api/chat/${session?.user?.email}/${params.groupId}/messages`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    "text": msg,
                    "messageId": message.messageId,
                }),
            });
            setMessageSent(!messageSent);
        }
        setEdit(!edit);
    }

    const handleKeyDown = async (event: any) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          await onEdit(event);
        }
    };

    const handleMessage = (event: any) => {
        setMsg(event.target.value);
    }

    useEffect(() => {
        if(deleteMessage) {
            const timer = setTimeout(() => {
                setDeleteMessage(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [deleteMessage]);

    const handleDelete = async () => {
        if(deleteMessage) {
            const res = await fetch(`/api/chat/${session?.user?.email}/${params.groupId}/messages`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    "messageId": message.messageId,
                }),
            });
            setMessageSent(!messageSent);
            setDeleteMessage(false);
        }
        else {
            setDeleteMessage(true);
        }
    }

    return (
        <div className="flex p-2 flex-col bg-gray-600 hover:bg-gray-700/50 ">
            <div className="flex flex-row break-words items-center relative">
                <h2 className="font-bold mr-3 text-amber-300 break-all flex-wrap">{message.author.username}</h2>
                <p className="text-xs mr-3 text-gray-400 break-all flex-wrap">{date}</p>
                <p className="text-xs mr-3 text-gray-400 break-all flex-wrap">{message.author.email}</p>
                {message.edited ? <p className="text-xs text-gray-400 break-all flex-wrap">edited</p> : ""}
                <div className="flex flex-row p-2 h-16 absolute right-0">
                    {message.author.email === session?.user?.email ?
                    (
                    <button className={`${edit ? "bg-green-500" : ""} flex m-2  aspect-square items-center justify-center`}
                            onClick={() => setEdit(!edit)}>
                        <Image
                            className={"flex-auto flex-grow"}
                            src={"/edit_icon.png"}
                            alt={"Remove member"}
                            width={10}
                            height={10}
                            unoptimized={true}
                        />
                    </button>
                    )
                    :
                    ("")
                    }
                    {message.author.email === session?.user?.email ?
                    (
                    <button className={`${deleteMessage ? "bg-red-500" : ""} flex m-2  aspect-square items-center justify-center`}
                            onClick={handleDelete}>
                        <Image
                            className={"flex-auto flex-grow"}
                            src={"/trashcan.png"}
                            alt={"Remove member"}
                            width={10}
                            height={10}
                            unoptimized={true}
                        />
                    </button>
                    )
                    :
                    ("")
                    }
                </div>
            </div>
            <div className="flex flex-row break-all p-1">
                {edit ? 
                (
                    <textarea
                        name="message"
                        id="message"
                        value={msg}
                        onChange={handleMessage}
                        onKeyDown={handleKeyDown}
                        required
                        maxLength={500}
                        className='p-1 w-full h-auto min-h-16 text-white border border-black bg-gray-500 resize-none overflow-y-auto max-h-[300px]'
                    >
                        {message.text}
                    </textarea>
                )
                :
                (
                    <p className="text-while break-all flex-wrap">{message.text}</p>
                )
                }
            </div>
        </div>
    );
}