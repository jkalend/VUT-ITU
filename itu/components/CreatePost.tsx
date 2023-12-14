"use client"
import Image from "next/image";
import {useState, useEffect} from "react";
import { useSession } from "next-auth/react";

export default function createPost({isClicked, setClicked,setNewPostFlag} : {isClicked: boolean, setClicked: any, setNewPostFlag: any}) {
    const { data: session } = useSession();
    const [description, setDescription] = useState("")
    const [image, setImage] = useState(null);
    const [createObjectURL, setCreateObjectURL] = useState(null);

    const uploadToClient = (event: React.FormEvent<HTMLFormElement>) => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0];

            setImage(i);
            setCreateObjectURL(URL.createObjectURL(i));
        }
    };
  

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        
        event.preventDefault ()
        const fileReader = new FileReader();
        const desc = description
        fileReader.readAsDataURL(image);

        setDescription("")
        setImage(null)
        setCreateObjectURL(null)
        setClicked(true)
        fileReader.onload = async () => {
            const base64 = fileReader.result
            const res = await fetch("/api/social", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({"email":session.user?.email, "desc":description, "image":base64?.toString()}),
            });
            if (!res.ok) {
                console.log ("Error")
            }
            else {
                const p = await res.json()
                setNewPostFlag((flag)=> !flag)
            }
        };
    }

    const handleDescription = (event: any) => {
        setDescription(event.target.value);
    }
   
    return (
        <div className={`${isClicked ? "collapse backdrop-blur-0" : "backdrop-blur-[5px]"} flex fixed z-30 items-center justify-center snap-center w-screen h-screen left-0 transition-all duration-200`}>
            <button className={`w-screen h-screen`} onClick={() => setClicked(!isClicked)}/>
            <div className={`${isClicked ? "hidden" : ""} m-10 p-10 flex fixed hover:cursor-auto bg-[#736349] rounded-2xl justify-center items-start flex-col max-h-[90%]  `}>
                <div className="text-4xl text-bold">
                    <div>
                        Create New Post
                    </div>
                </div>
                <div>{(createObjectURL == null) ? "":
                    <Image  src={createObjectURL} 
                            width={300}
                            height={300}
                            alt="Selected picture"/>}
                </div>
                <form onSubmit={onSubmit} className='mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism'>
                    <input type='file' name="myImage" id="file" onChange={uploadToClient} required>
                    </input>
                    <br></br>
                    <textarea
                        name="desc"
                        id="desc"
                        value={description}
                        onChange={handleDescription}
                        placeholder='Describe your post'
                        required
                        maxLength={50}
                        className='form_textarea text-black block p-2.5 w-full rounded-sm'
                    />
                    <br>
                    </br>
                    <button type='submit' className=' text-white bg-amber-300 hover:bg-amber-400 outline-1 outline-red-500 hover:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'>
                        Create Post
                    </button>
                </form>
            </div>
        </div>
    );
}