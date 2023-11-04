import Link from "next/link";
import Image from 'next/image'

//https://icon-library.com/images/sandwich-menu-icon/sandwich-menu-icon-24.jpg
export default function Navbar( {isSidebarOpen, setSidebarOpen} : {isSidebarOpen: boolean, setSidebarOpen: any}) {
    return (
        <nav className={"fixed top-0 w-full mb-16 bg-gradient-to-bl from-gray-800 text-white border-neutral-900 z-10"}>
            <div className={"container mx-auto p-2.5"}>
                <div className={'flex flex-row justify-between'}>
                    <div className={'flex items-center justify-start'}>
                        <div className={"left-[121px] top-[14px] absolute"}>
                            <span className={"text-orange-200 text-5xl font-semibold"}>
                                PLANT WATERING SCHEDULE
                            </span>
                        </div>

                        <button id="toggleSidebar"
                                className="text-center w-full flex"
                                onClick={() => {setSidebarOpen(!isSidebarOpen)}}>
                            <Image className={"fill-current"} src={"/planting.png"} alt={"Menu icon"} width={40} height={40}/>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

// <div class="w-[1440px] h-[101px] relative">
//   <div class="w-[1440px] h-[101px] left-0 top-0 absolute bg-gray-900"></div>
//   <div class="left-[121px] top-[14px] absolute"><span style="text-orange-200 text-5xl font-semibold font-['Inter']">PLANT WATERING SCHEDULE</span><span style="text-cyan-300 text-5xl font-semibold font-['Inter']"> </span></div>
//   <div class="left-[1220px] top-[27px] absolute text-slate-500 text-2xl font-medium font-['Inter']">FRANTA</div>
//   <img class="w-[72px] h-[62px] left-[1348px] top-[10px] absolute rounded-full" src="https://via.placeholder.com/72x62" />
//   <img class="w-[62px] h-[71px] left-[26px] top-[6px] absolute" src="https://via.placeholder.com/62x71" />
// </div>