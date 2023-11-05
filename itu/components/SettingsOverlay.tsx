import Image from "next/image";
export default function SettingsOverlay({isClicked, setClicked} : {isClicked: boolean, setClicked: any}) {
    return (
        <div className={`${isClicked ? "collapse backdrop-blur-0" : "backdrop-blur-[5px]"} flex fixed z-30 items-center justify-center snap-center w-screen h-screen left-0 transition-all duration-500`}>
            <button className={`w-screen h-screen`} onClick={() => {setClicked(!isClicked)}}/>
            <div className={`${isClicked ? "hidden" : ""} m-16 p-16 flex fixed hover:cursor-auto bg-amber-300`} >
                <Image className={"flex-auto"} src={"/planting.png"} alt={"Menu icon"} width={200} height={200}/>
            </div>
        </div>
    );
}