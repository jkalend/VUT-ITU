import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Water Me',
  description: 'A simple app to help you remember to water your plants',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={"flex bg-gradient-to-b from-[#292020] to-[#736349]"}>

        <Sidebar>
          {children}
        </Sidebar>
      </body>
    </html>
  )
}
