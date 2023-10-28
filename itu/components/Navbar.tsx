import Link from "next/link";
import Image from 'next/image'

//https://icon-library.com/images/sandwich-menu-icon/sandwich-menu-icon-24.jpg
export default function Navbar( {isSidebarOpen, setSidebarOpen} : {isSidebarOpen: boolean, setSidebarOpen: any}) {
    return (
        <nav className={"fixed top-0 w-full mb-16 bg-gradient-to-bl from-gray-800 text-white border-neutral-900 z-10"}>
            <div className={"container mx-auto p-2.5"}>
                <div className={'flex flex-row justify-between'}>
                    <div className={'flex items-center justify-start'}>
                        <button id="toggleSidebar"
                                className="text-center w-full flex"
                                onClick={() => {setSidebarOpen(!isSidebarOpen)}}>
                            <Image className={"fill-current"} src={"/plant-icon.svg"} alt={"Menu icon"} width={40} height={40}/>
                        </button>
                    </div>
                    <div className={'flex flex-row justify-between space-x-5'}>
                        <Link
                            href={'/login'}
                            className={'navbar_button'}
                        >
                            Sign In
                        </Link>
                        <Link
                            href={'/register'}
                            className={'navbar_button'}
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}