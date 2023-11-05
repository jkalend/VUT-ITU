"use client"
import Image from "next/image";
import DItem from "./DItem";
import { useState, useEffect } from "react";

export default function Dashboard({isClicked, setClicked, setName, data} : {isClicked: boolean, setClicked: any, setName: any, data: any}) {
    const [whichPlant, setWhichPlant] = useState (-1);
    useEffect (() => {
        if (whichPlant != -1) {
            data.splice (data.indexOf (whichPlant), 1);
            setWhichPlant (-1)
        }
    });

    return (
        <div className={"flex flex-col py-15 px-15 gap-10"}>
            <div className={"mx-16"}>
                <h1 className={"text-orange-200 text-3xl font-semibold"}>
                    Overview
                </h1>
                <p className={"text-orange-200 font-semibold"}>
                    {data.filter((a) => a.days < 0).length} plants in need of immediate watering
                </p>
            </div>
            <div className={"flex flex-wrap flex-row gap-5 p-5 flex-initial justify-center"}>
                {data.map ((h) =>
                    (<DItem key={h.id} plant={h} isClicked={isClicked} setClicked={setClicked} setName={setName} setWhichPlant={setWhichPlant}/>)
                )}
            </div>
        </div>
    );
}