"use client";
import React from 'react'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import prisma from '@/app/db'
import Group from '@components/Group'
import CreateGroup from '@components/CreateGroup'


const Groups = () => {
  const { data: session, status } = useSession();
  const [groups, setGroups] = useState ([]);
  const [isClicked, setClicked] = useState(true);

    const fetchGroups = async () => {
        try {
            const response = await fetch(`/api/chat/${session?.user?.email}`,{
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                });
            const data = await response.json();
            console.log(data)
            setGroups(data);
        }
        catch (err) {
            console.log("Error" + err)
        }
    };

    useEffect(() => {
        fetchGroups();
    }, [isClicked, status]);

    const toggleCreateGroup = () => {
        setClicked(!isClicked)
    }

  return (
    <div className={"main-div"}>
        <div className={"flex flex-col relative h-full py-15 px-15 gap-10"}>
            <div className={"mx-16 flex flex-row m-10"}>
                <h1 className={"text-orange-200 text-3xl font-semibold"}>
                  My Chat Groups
                </h1>
                <button className={"ml-10 bg-orange-200 text-gray-600 rounded-md px-5 py-2 font-semibold hover:bg-orange-300 hover:cursor-pointer"}
                    onClick={toggleCreateGroup}>
                    Create New Group
                </button>
            </div>
            <div className={"flex flex-wrap flex-row gap-5 p-5 flex-initial justify-center"}>
                {groups.map ((g) =>
                    (<Group key={g.groupId} group={g}/>)
                )}
            </div>
            <CreateGroup isClicked={isClicked} setClicked={setClicked}/>
        </div>
    </div>      
  )
}

export default Groups