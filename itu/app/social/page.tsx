// @ts-nocheck
/**
 * author: Tereza Kubincova (xkubin27)
 */

"use client"
import React from 'react'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import prisma from '@/app/db'
import Post from '@components/Post'
import CreatePost from "@components/CreatePost";
import { CldImage } from 'next-cloudinary';


const Social = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState ([]);
  const [create, setCreate] = useState (true);
  const [newPostFlag, setNewPostFlag] = useState (false);
  useEffect(() => {

    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/social/`,{
                method: "GET"}
                );
        const data = await response.json();
        console.log(data)
        setPosts(data.sort((a,b) => {return (a.dateCreated < b.dateCreated)? 1: -1}));
      }
      catch (err) {
        console.log("Error" + err)
      }
    };

    fetchPosts();
    
    
  }, [newPostFlag]);

  return (
    <>
    <CreatePost isClicked={create} setClicked={setCreate} setNewPostFlag={setNewPostFlag}/>
    <div className={"main-div"}>
      
    <div className={"flex flex-col relative h-full py-15 px-15 gap-10"}>
            <div className={"mx-16 gap-4"}>
                <div className='flex flex-row gap-4 '>
                  <h1 className={"text-orange-200 text-3xl font-semibold"}>
                    Posts by our community
                  </h1>
                  {(session) ? 
                  <>
                    <button onClick={() => setCreate(false)} className="text-orange-500 bg-orange-200 hover:bg-orange-300 outline-1 outline-amber-600 hover:ring-primary-300 font-medium rounded-lg text-sm p-2 text-center">
                      Create Post
                    </button>
                  </>:<></>}
                  
                </div>
                
                <p className={"text-orange-200 font-semibold"}>
                  Join us by also sharing pictures of your beloved plants :D
                </p>
            </div>
            <div className={"flex flex-wrap flex-row gap-5 p-5 overflow-auto no-scrollbar flex-initial justify-center"}>
                {posts.map ((h) =>
                    (<Post key={h.postId} post={h} setPosts={setPosts}/>)
                )}
            </div>
        </div>
        
      </div>
    </>


  )
}

export default Social
