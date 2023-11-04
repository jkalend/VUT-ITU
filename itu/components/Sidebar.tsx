"use client";
import { useState } from "react";
import Navbar from "@components/Navbar";
import Link from "next/link";
import Image from "next/image";
import {Simulate} from "react-dom/test-utils";

export default function Sidebar({children} : {children: any}) {

    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isClicked, setClicked] = useState(false);

    const sidebarClasses = isSidebarOpen
        ? 'bg-gradient-to-r from-gray-800 from-10% w-64 min-h-screen text-white p-4 transform translate-x-0 transition-transform z-0 py-20 fixed'
        : 'w-64 min-h-screen text-white p-4 transform -translate-x-64 transition-transform z-0 py-20';

    const sidebarStyle = {
        width: isSidebarOpen ? '16rem' : '0', // You can adjust the width value as needed
        transition: 'width 0.2s, transform 0.2s', // Adjust the transition duration as needed
        overflow: 'hidden', // Hide any overflowing content when the sidebar is closed
    };

    const mainStyle = {
        transition: 'margin-left 0.2s', // Adjust the transition duration as needed
    }

    const textStyle = {
        transition: 'color 0.3s ease', // Adjust the transition duration as needed
    }

    const oStyle = {
        pointerEvents: 'none',
    }

    //`bg-blue-700 w-64 min-h-screen text-white p-4 transition-transform transform translate-x-0 md:translate-x-full ${isSidebarOpen ? '' : 'hidden'}`
    return (
        <div className={'w-screen'}>
            <Navbar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen}/>
            <aside className={`${isSidebarOpen ? 'bg-gray-100' : 'h-0'}`}>
                <div id="sidebar" className={sidebarClasses} style={sidebarStyle} >
                    <ul className="mt-6">
                        <li className="mb-4"><Link href="/" className="text-lg hover:text-amber-500" style={textStyle}>Overview</Link></li>
                        <li className="mb-4"><Link href="/my-plants" className="text-lg hover:text-amber-500" style={textStyle}>My Plants</Link></li>
                        <li className="mb-4"><Link href="#" className="text-lg hover:text-amber-500" style={textStyle}>Add a plant</Link></li>
                        <li className="mb-4"><button className="text-lg hover:text-amber-500" style={textStyle} onClick={() => setClicked(!isClicked)}>Settings</button></li>
                    </ul>
                </div>
            </aside>
            <div className={`flex w-screen h-screen fixed backdrop-blur z-10 ${isClicked ? "hidden" : ""} items-center justify-center`}>
                <button className={`w-screen h-screen fixed backdrop-blur z-20 ${isClicked ? "hidden" : ""} items-center justify-center`} onClick={() => setClicked(!isClicked)}>
                </button>
                <div className={`m-16 p-16 flex fixed backdrop-blur z-20 ${isClicked ? "hidden" : ""} hover:cursor-auto bg-amber-50`} >
                    <Image className={"flex-auto"} src={"/planting.png"} alt={"Menu icon"} width={200} height={200}/>
                </div>
            </div>
            <main
                className={`flex min-h-screen px-10 mx-5 flex-col items-center justify-between ${isSidebarOpen ? '' : ''}`}
                style={mainStyle}
            >
                {children}
            </main>
        </div>
    );
}