// @ts-nocheck
// Author: Jan Kalenda
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@components/Sidebar'
import Provider from '@components/Provider'
import ChatAi from '@components/ChatAi'

export const metadata: Metadata = {
    title: 'Waterwise',
    description: '',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const mainStyle = {
        transition: 'margin-left 0.2s', // Adjust the transition duration as needed
    }

    return (
        <html lang="en">
            <body className={'h-full w-full absolute overflow-hidden'}>
                <Provider>
                    <div
                        className={
                            'flex h-full w-full relative overflow-hidden bg-gradient-to-b from-[#292020] to-[#736349]'
                        }
                        style={mainStyle}
                    >
                        <Sidebar />
                        <div
                            className={
                                'flex relative p-2 mt-16 overflow-y-auto overflow-x-hidden w-full'
                            }
                        >
                            {children}
                            <ChatAi />
                        </div>
                    </div>
                </Provider>
            </body>
        </html>
    )
}
