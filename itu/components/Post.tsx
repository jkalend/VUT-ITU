import { PlantData } from "@/app/PlantData";
import Image from "next/image";
import prisma from '@/app/db'
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { button } from "@nextui-org/react";

export default function Post( {post, setPosts} ) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false)
  const [newDescr, setNewDescr] = useState (post.description)
  const [likes, setLikes] = useState (post.likedBy.length);
  const [clicked, setClicked] = useState(true)
  const [comment, setComment] = useState("")
  const [allComments, setAllComments] = useState([])

  useEffect(() => {
    setAllComments(post.comments)
    console.log(allComments)
  }, []);

  const deleteComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault ()
    const commId = Number(event.currentTarget.id)
    const res = await fetch("/api/social/edit", {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({"commentId":commId}),
    });
    if (!res.ok) {
        console.log ("Error")
    }
    setAllComments((allcomms) => {return allcomms.filter((a) => (a.commentId != commId))})
  }

  const handleComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault ()

    if (comment.length <= 0) return
    const res = await fetch("/api/social/edit", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"email":session.user?.email, "postId":post.postId, "text":comment}),
    });
    if (!res.ok) {
        console.log ("Error")
    }
    const resp = await res.json()
    allComments.push({"author": {"username":session?.user?.name.replace(" ", "").toLowerCase()}, "text":comment})
    setComment("")
  }

  const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault ()
    const res = await fetch("/api/social/edit", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"postId":post.postId, "desc":newDescr}),
    });
    if (!res.ok) {
        console.log ("Error")
    }
    setIsEditing(false)
  }
  const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault ()
    console.log(post.postId)
    const res = await fetch("/api/social/", {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"postId":post.postId}),
    });
    if (!res.ok) {
        console.log ("Error"+res.body)
    }
    setPosts ((posts) =>  {return posts.filter((p) => p.postId != post.postId)})
  }

  const handleDescription = (event: any) => {
        setNewDescr(event.target.value);
    }
   

  const handleLike = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      const res = await fetch("/api/social", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"email":session.user?.email, "postId":post.postId}),
      });
      if (!res.ok) {
          console.log ("Error")
      }
      const like_count = await res.json()
      setLikes (like_count)
    }
    catch (err) {
      console.log ("Could not add like"+err)
    }
    
  }
  return (
    <>
        <div className="w-[400px] h-[360px] flex flex-col justify-center items-center bg-orange-200 rounded-lg gap-4 p-4">
            <div className="w-full h-full text-slate-700 font-bold">
                @{post.creator.username} posted:
            </div>
            <Image
                onClick={() => setClicked(false)}
                className="w-[345.29px] h-[215px] rounded-lg hover:scale-105 transition duration-200 cursor-pointer object-cover"
                alt={'Post Image'}
                src={post.image}
                width={345.29}
                height={215}
            ></Image>
            <div className="w-full h-full">
                <div className="flex flex-row w-full justify-center">
                    <div className="flex flex-col w-full justify-center items-center">
                        {!isEditing ? (
                            <>
                                <div className="w-[164.90px]  text-slate-600 text-left text-sm font-semi}">
                                    {newDescr}
                                </div>
                            </>
                        ) : (
                            <>
                                <textarea
                                    name="desc"
                                    id="desc"
                                    value={newDescr}
                                    onChange={handleDescription}
                                    placeholder={post.description}
                                    required
                                    maxLength={250}
                                    className="form_textarea text-black block p-2.5 w-full rounded-sm"
                                />
                            </>
                        )}
                    </div>
                    <div className="flex flex-row w-full justify-end items-center gap-1">
                        <button
                            onClick={handleLike}
                            className="h-full text-white bg-red-300 hover:bg-red-400 outline-1 outline-red-500 hover:ring-primary-300 font-medium rounded-lg text-sm p-2 text-center"
                        >
                            {likes} ❤️
                        </button>
                        {session && session.user.email == post.email ? (
                            <div className="flex flex-col justify-end gap-1">
                                {isEditing == true ? (
                                    <>
                                        <button
                                            onClick={handleEdit}
                                            className=" text-white bg-green-200 hover:bg-green-300 outline-1 outline-green-600 hover:ring-primary-300 font-medium rounded-lg text-sm p-2 text-center"
                                        >
                                            Save
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() =>
                                                setIsEditing(true)
                                            }
                                            className=" text-green-700 bg-green-200 hover:bg-green-300 outline-1 outline-green-600 hover:ring-primary-300 font-medium rounded-lg text-sm p-2 text-center"
                                        >
                                            Edit
                                        </button>
                                    </>
                                )}

                                <button
                                    onClick={handleDelete}
                                    className=" text-green-700 bg-green-200 hover:bg-green-300 outline-1 outline-green-600 hover:ring-primary-300 font-medium rounded-lg text-sm p-2 text-center"
                                >
                                    Delete
                                </button>
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </div>
        </div>
        <div
            className={`${
                clicked ? 'collapse backdrop-blur-0' : 'backdrop-blur-[5px]'
            } flex fixed z-30 items-center justify-center snap-center top-0 left-0 w-full h-full transition-all duration-200`}
        >
            <button
                className={`w-full h-full`}
                onClick={() => setClicked(true)}
            />
            <div
                className={`${
                    clicked ? 'hidden' : ''
                } m-5 p-5 gap-5 flex fixed hover:cursor-auto bg-[#736349] rounded-2xl justify-center items-center flex-col max-w-full max-h-[75%]`}
            >
                <Image
                    className="rounded-lg"
                    alt={'Post Image'}
                    src={post.image}
                    width={345.29}
                    height={215}
                ></Image>
                {session ? (
                    <>
                        <div className="flex flex-row gap-5">
                            <textarea
                                name="comment"
                                id="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder={'Say something nice!'}
                                required
                                maxLength={50}
                                className="form_textarea text-orange-500 block bg-orange-200 p-2.5 w-full rounded-lg"
                            ></textarea>
                            <button
                                onClick={handleComment}
                                className="text-orange-500 bg-orange-200 hover:bg-orange-300 outline-1 outline-amber-600 hover:ring-primary-300 font-medium rounded-lg text-sm p-2 text-center"
                            >
                                Add Comment
                            </button>
                        </div>
                    </>
                ) : (
                    <></>
                )}
                <div className="flex flex-col w-full h-[55%] overflow-auto no-scrollbar rounded-b gap-2">
                  {allComments.map((comment) => (
                      <div className="flex flex-col w-full  justify-start bg-amber-200 rounded-lg text-amber-900">
                        <div className="flex flex-row justify-between"> 
                         
                          <div className="font-semibold p-2">
                              @{comment.author.username} said:
                          </div>
                          {(session && session.user?.email == comment.author.email) ? 
                         <>
                          <button onClick={deleteComment} id={comment.commentId} className="h-full text-amber-900 bg-red-300 hover:bg-red-400 outline-1 outline-red-500 hover:ring-primary-300 font-medium rounded-lg text-sm p-2 text-center">
                            Delete Comment
                          </button>
                         </>:<></>}
                        </div>
                          
                        <div className="p-2 text-amber-700">
                            {comment.text}
                        </div>
                      </div>
                  ))}
                </div>

            </div>
        </div>
    </>
)
}
