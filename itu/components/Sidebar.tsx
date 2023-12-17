'use client'
import { useState } from 'react'
import Navbar from '@components/Navbar'
import Link from 'next/link'
import SettingsOverlay from '@components/SettingsOverlay'
import { useSession } from 'next-auth/react'

export default function Sidebar() {
    const { data: session } = useSession()
    const [isSidebarOpen, setSidebarOpen] = useState(true)
    const [isClicked, setClicked] = useState(true)
    const sidebarStyle = {
        width: isSidebarOpen ? '16rem' : '0px', // You can adjust the width value as needed
        transition: 'width 0.3s, transform 0.3s', // Adjust the transition duration as needed
        overflow: 'hidden', // Hide any overflowing content when the sidebar is closed
    }

    const textStyle = {
        transition:
            'color 0.3s ease, font-size 0.3s ease, line-height 0.3s ease', // Adjust the transition duration as needed
    }

    return (
        <div className={''}>
            <Navbar
                isSidebarOpen={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />
            <div
                className={
                    'flex-shrink-0 h-full w-64 relative overflow-hidden flex min-h-0 flex-col '
                }
                style={sidebarStyle}
            >
                <div
                    className={`flex h-full min-h-0 flex-col transition-opacity ${
                        isSidebarOpen ? 'opacity-100' : 'opacity-50'
                    }`}
                >
                    <div
                        id="sidebar"
                        className={
                            'scrollbar-trigger relative h-full w-full flex-1 items-start border-white/20'
                        }
                    >
                        <nav
                            className={`flex h-full w-full flex-col p-4 bg-gradient-to-r from-gray-800 from-10% transition-transform  ${
                                isSidebarOpen ? '' : 'hidden'
                            }`}
                            style={sidebarStyle}
                        >
                            <ul className="mt-16 fixed gap-2">
                                <li className="mb-4">
                                    <Link
                                        href="/"
                                        className="text-lg hover:text-amber-500 hover:text-2xl leading-8"
                                        style={textStyle}
                                    >
                                        Overview
                                    </Link>
                                </li>
                                {session ? (
                                    <li className="mb-4">
                                        <Link
                                            href="/my-plants"
                                            className="text-lg hover:text-amber-500 hover:text-2xl leading-8"
                                            style={textStyle}
                                        >
                                            My Plants
                                        </Link>
                                    </li>
                                ) : (
                                    ''
                                )}
                                {/*{session ? (*/}
                                {/*    <li className="mb-4">*/}
                                {/*        <Link*/}
                                {/*            href="/species"*/}
                                {/*            className="text-lg hover:text-amber-500 hover:text-2xl"*/}
                                {/*            style={textStyle}*/}
                                {/*        >*/}
                                {/*            Add a Species*/}
                                {/*        </Link>*/}
                                {/*    </li>*/}
                                {/*) : (*/}
                                {/*    ''*/}
                                {/*)}*/}
                                <li className="mb-4">
                                    <button
                                        className="text-lg hover:text-amber-500 hover:text-2xl leading-8"
                                        style={textStyle}
                                        onClick={() => setClicked(!isClicked)}
                                    >
                                        Settings
                                    </button>
                                </li>
                                <li className="mb-4">
                                    <Link
                                        href="/social"
                                        className="text-lg hover:text-amber-500 hover:text-2xl leading-8"
                                        style={textStyle}
                                    >
                                        Community
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link
                                        href="/chat"
                                        className="text-lg hover:text-amber-500 hover:text-2xl leading-8"
                                        style={textStyle}
                                    >
                                        Chat
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <SettingsOverlay
                        isClicked={isClicked}
                        setClicked={setClicked}
                    />
                </div>
            </div>
        </div>
    )
}
