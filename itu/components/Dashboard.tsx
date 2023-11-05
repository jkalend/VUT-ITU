"use client"
import Image from "next/image";
import DItem from "./DItem";
import { useState, useEffect } from "react";
import { getSettings } from "@/app/Settings";
import { PlantData } from "@/app/PlantData";

export default function Dashboard({isClicked, setClicked, setName, data} : {isClicked: boolean, setClicked: any, setName: any, data: any}) {
    const [whichPlant, setWhichPlant] = useState (-1);
    useEffect (() => {
        if (whichPlant != -1) {
            data.splice (data.indexOf (whichPlant), 1);
            setWhichPlant (-1)
        }
    });

    const [stg, setStg] = useState ({} as any);
    useEffect(() => {
        const filteredData = data.filter((h: PlantData) => h.days <= stg.days_remaining);
        setFilteredData(filteredData);
    }, [stg]);
    const [filteredData, setFilteredData] = useState ([] as PlantData []);

    const [a, b] = useState (false);
    useEffect(() => {
        const timeout = setTimeout(() => {
            const getStg = async () => {
                let data = await getSettings();
                if(data.days_remaining !== stg.days_remaining || data.theme !== stg.theme) {
                    setStg(data);
                    console.log(data);
                }
                b(!a);
            }
            getStg().then(r => {});
        }, 1000);
        return () => {
            clearTimeout(timeout);
        };
    }, [a]);

    return (
        <div className={"flex flex-col py-15 px-15 gap-10"}>
            <div className={"mx-16"}>
                <h1 className={"text-orange-200 text-3xl font-semibold"}>
                    Overview
                </h1>
                <p className={"text-orange-200 font-semibold"}>
                    {filteredData.filter((a: PlantData) => a.days < 0).length} plants in need of immediate watering
                </p>
            </div>
            <div className={"flex flex-wrap flex-row gap-5 p-5 flex-initial justify-center"}>
                {filteredData.map ((h: PlantData) =>
                    (<DItem key={h.id} plant={h} isClicked={isClicked} setClicked={setClicked} setName={setName} setWhichPlant={setWhichPlant}/>)
                )}
            </div>
        </div>
    );
}