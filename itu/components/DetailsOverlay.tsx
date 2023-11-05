"use client"
import Image from "next/image";
import {getPlantDetail, PlantData} from "@/app/PlantData";
import {useState, useEffect} from "react";

export default function DetailsOverlay({isClicked, setClicked, name} : {isClicked: boolean, setClicked: any, name: string}) {

    const [data, setData] = useState({} as PlantData);
    const getData = async () => {
        // @ts-ignore
        let data = await getPlantDetail(name);

        // @ts-ignore
        setData(data);
    }

    useEffect(() => {
        getData().then(r => {});
    });

    return (
        <div className={`${isClicked ? "collapse backdrop-blur-0" : "backdrop-blur-[5px]"} flex fixed z-30 items-center justify-center snap-center w-screen h-screen left-0 transition-all duration-200`}>
            <button className={`w-screen h-screen`} onClick={() => setClicked(!isClicked)}/>
            <div className={`${isClicked ? "hidden" : ""} m-16 p-16 flex fixed hover:cursor-auto bg-[#736349] rounded-2xl justify-center items-start flex-col`}>
                <Image className={"flex-auto"} src={data?.image_path} alt={"Menu icon"} width={200} height={200}/>
                <span className={"text-bold"}>{"Name:\t" + data?.name}</span>
                <span className={"text-bold"}>{"Days left:\t" + data?.days}</span>
                <span className={"text-bold"}>{"Water every:\t" + data?.watering_frequency}</span>
                <span className={"text-bold"}>{"Water amount:\t" + data?.watering_amount}</span>

            </div>
        </div>
    );
}