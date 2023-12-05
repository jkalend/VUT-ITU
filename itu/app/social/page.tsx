"use client"
import React from 'react'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import prisma from '@/app/db'
import Post from '@components/Post'


const Social = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState ([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/social/`,{
                method: "GET"}
                );
        const data = await response.json();
        console.log(data)
        setPosts(data);
      }
      catch (err) {
        console.log("Error")
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className={"main-div"}>
    <div className={"flex flex-col relative h-full py-15 px-15 gap-10"}>
            <div className={"mx-16"}>
                <h1 className={"text-orange-200 text-3xl font-semibold"}>
                  Posts by our community
                </h1>
                <p className={"text-orange-200 font-semibold"}>
                  Join us by also sharing pictures of your beloved plants :D
                </p>
            </div>
            <div className={"flex flex-wrap flex-row gap-5 p-5 flex-initial justify-center"}>
                {posts.map ((h) =>
                    (<Post key={h.postId} post={h}/>)
                )}
            </div>
        </div>
      </div>

      
  )
}

export default Social