"use client";
import { useState } from "react";
import Navbar from "@components/Navbar";
import Link from "next/link";

export default function Sidebar({children} : {children: any}) {

    const [isSidebarOpen, setSidebarOpen] = useState(false);

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

    //`bg-blue-700 w-64 min-h-screen text-white p-4 transition-transform transform translate-x-0 md:translate-x-full ${isSidebarOpen ? '' : 'hidden'}`
    return (
        <div className={'w-screen'}>
            <Navbar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen}/>
            <aside className={`${isSidebarOpen ? 'bg-gray-100' : 'h-0'}`}>
                <div id="sidebar" className={sidebarClasses} style={sidebarStyle} >
                    <ul className="mt-6">
                        <li className="mb-4"><Link href="#" className="text-lg hover:text-amber-500" style={textStyle}>Overview</Link></li>
                        <li className="mb-4"><Link href="/my-plants" className="text-lg hover:text-amber-500" style={textStyle}>My Plants</Link></li>
                        <li className="mb-4"><Link href="#" className="text-lg hover:text-amber-500" style={textStyle}>Add a plant</Link></li>
                        <li className="mb-4"><Link href="#" className="text-lg hover:text-amber-500" style={textStyle}>Settings</Link></li>
                    </ul>
                </div>
            </aside>
            <main
                className={`flex min-h-screen px-10 mx-5 flex-col items-center justify-between ${isSidebarOpen ? 'ml-64' : ''}`}
                style={mainStyle}
            >
                {children}
            </main>
        </div>
    );
}