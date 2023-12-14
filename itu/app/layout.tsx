import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@components/Sidebar'
import Provider from "@components/Provider";
import ChatAi from "@components/ChatAi";

export const metadata: Metadata = {
  title: 'Water Me',
  description: 'A simple app to help you remember to water your plants',
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
      <body className={"bg-gradient-to-b from-[#292020] to-[#736349]"}>
        <Provider>
          <div
              className={"flex h-full w-full relative overflow-hidden"}
              style={mainStyle}
          >
            <Sidebar/>
            <div className={"flex h-full relative p-2 mt-16 overflow-y-auto overflow-x-hidden"}>
              {children}
              <ChatAi/>
            </div>
          </div>
        </Provider> 
      </body>
    </html>
  )
}
