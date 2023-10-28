import Image from "next/image";

export default function Dashboard() {
    return (
        <div className={"flex-col min-w-full py-5 px-5 bg-gray-600 border-gray-500 border w-full"}>
            <h2 className={"min-w-full font-bold font-sans text-2xl"}>
                Dashboard
            </h2>
            <div className={"flex h-80"}>
                <div className={"flex flex-col w-1/2"}>
                    Day 1
                    <Image className={"fill-current"} src={"/plant-icon.svg"} alt={"Menu icon"} width={300} height={300}/>
                </div>
                <div className={"flex flex-col w-1/2"}>
                    Day 2
                    <Image className={"fill-current"} src={"/plant-icon.svg"} alt={"Menu icon"} width={300} height={300}/>
                </div>
                <div className={"flex flex-col w-1/2"}>
                    Day 3
                    <Image className={"fill-current"} src={"/plant-icon.svg"} alt={"Menu icon"} width={300} height={300}/>
                </div>
            </div>


        </div>
    );
}