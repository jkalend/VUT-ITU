"use client"
import Link from "next/link";
import Image from 'next/image'
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Navbar( {isSidebarOpen, setSidebarOpen} : {isSidebarOpen: boolean, setSidebarOpen: any}) {
    const { data: session } = useSession();
    const [providers, setProviders] = useState(null);

    useEffect(() => {
        (async () => {
        const res = await getProviders();
        setProviders(res);
        })();
    }, []);

    return (
        <nav className={"fixed top-0 w-full mb-16 bg-gradient-to-bl from-gray-800 backdrop-blur-xl text-white z-10 inline-flex justify-between"}>
            <div className={'items-start justify-between flex-nowrap ml-5 gap-4'}>
                <button id="toggleSidebar"
                        className="text-center flex-auto px-8"
                        onClick={() => {setSidebarOpen(!isSidebarOpen)}}>
                    <Image className={"flex-auto"} src={"/planting.png"} alt={"Menu icon"} width={40} height={40}/>
                </button>

                <Link className={"text-orange-200 text-4xl font-semibold blur-[1px]"} href={"/"}>
                    PLANT WATERING SCHEDULE
                </Link>
                
            </div>
            <div className={"flex end-0 mx-2 px-10 py-2 gap-2 items-center"}>
                {(session) ? 
                <>
                <button key='google' onClick={() => {signOut() }} className="text-white bg-orange-200 hover:bg-orange-300 outline-1 outline-amber-600 hover:ring-primary-300 font-medium rounded-lg text-sm p-2 text-center">
                    Sign out
                </button>
                </>
                :
                <>
                <button key='google' onClick={() => {signIn('google') }} className="text-white bg-orange-200 hover:bg-orange-300 outline-1 outline-amber-600 hover:ring-primary-300 font-medium rounded-lg text-sm p-2 text-center">
                    Sign in
                </button>
                </>}
                    <span className={"text-white text-2xl font-semibold font-['Inter']"}>{(session) ? session.user?.username: "Visitor"}</span>
                    <Image className={""} src={"/planting.png"} alt={"Profile"} width={40} height={40}/>
            </div>
        </nav>
    );
}