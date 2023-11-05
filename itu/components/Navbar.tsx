import Link from "next/link";
import Image from 'next/image'

export default function Navbar( {isSidebarOpen, setSidebarOpen} : {isSidebarOpen: boolean, setSidebarOpen: any}) {
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
                <button id="profile"
                        className="text-center flex items-center gap-3"
                        onClick={() => {setSidebarOpen(!isSidebarOpen)}}>
                    <span className={"text-white text-2xl font-semibold font-['Inter']"}>FRANTA</span>
                    <Image className={""} src={"/planting.png"} alt={"Profile"} width={40} height={40}/>
                </button>
            </div>
        </nav>
    );
}