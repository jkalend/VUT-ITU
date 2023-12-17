// @ts-nocheck
// Author : Jaroslav Streit (xstrei06)

"use client";
import React from 'react'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Group from '@components/Group'
import CreateGroup from '@components/CreateGroup'


const Groups = () => {
    const { data: session, status } = useSession();
    const [groups, setGroups] = useState ([]);
    const [isClicked, setClicked] = useState(true);
    const [group, setGroup] = useState("");

    // fetch all groups of the user or filter them by name if group is not empty
    const fetchGroups = async () => {
        try {
            if(group === "") {
                const res = await fetch(`/api/chat/${session?.user?.email}`,{
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                });
                const data = await res.json();
                console.log(data)
                if(res.status === 200){
                    setGroups(data);
                }
            }else{
                const res = await fetch(`/api/chat/${session?.user?.email}/filterGroups/${group}`,{
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                });
                const data = await res.json();
                console.log(data)
                if(res.status === 200){
                    setGroups(data);
                }else{
                    setGroups([]);
                }
            }
        }
        catch (err) {
            console.log("Error" + err)
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    // toggle create group form
    const toggleCreateGroup = () => {
        setClicked(!isClicked)
    }

    useEffect(() => {
        // fetch groups every 10 seconds
        const interval = setInterval(() => {
            if(group === ""){
                fetchGroups();
            }
        }, 10000);

        fetchGroups();

        return () => clearInterval(interval);
    }, [isClicked, status, session]);

    // handle group name input
    const handleGroupName = (event: any) => {
        setGroup(event.target.value);
    }

    // handle enter key press to submit search
    const handleKeyDown = async (event: any) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          fetchGroups();
        }
    };

  return (
    <div className={"main-div"}>
        <div className={"flex flex-col relative h-full py-15 px-15 gap-10"}>
            <div className={"mx-16 flex flex-row m-10 items-center"}>
                <h1 className={"text-orange-200 text-3xl font-semibold"}>
                  My Chat Groups
                </h1>
                <button className={"ml-10 bg-orange-300 text-gray-800 rounded-md px-5 py-2 font-semibold hover:bg-orange-400 hover:cursor-pointer"}
                    onClick={toggleCreateGroup}>
                    Create New Group
                </button>
                <h3 className={"ml-10 text-gray-300 font-semibold"}>
                    Search for a group:
                </h3>
                <input 
                    className={"ml-2 rounded-md px-5 py-2 font-semibold bg-gray-200 text-gray-600 hover:bg-gray-300 hover:cursor-pointer"}
                    placeholder={"Enter group name"}
                    onChange={handleGroupName}
                    onKeyDown={handleKeyDown}
                />
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