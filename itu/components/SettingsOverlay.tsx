//Author: Jaroslav Streit (xstrei06)

'use client';
import Image from "next/image";
import React, {useEffect, useState} from "react";
import SlidingSwitch from "./Switch";
import {getSettings, setDays} from "@/app/Settings";

export default function SettingsOverlay({isClicked, setClicked} : {isClicked: boolean, setClicked: any}) {
    const [daysRemaining, setDaysRemaining] = React.useState(3);
    const [isChecked, setIsChecked] = useState(false);

    const sendForm = async() => {
        const settings = await getSettings();
    }
    const handleDaysRemaining = (event: any) => {
        setDaysRemaining(event.target.value);
        setDays(event.target.value);
    };

    useEffect(() => {
        sendForm();
    },);

    return (
        <div className={`${isClicked ? "collapse backdrop-blur-0" : "backdrop-blur-[5px]"} flex fixed z-30 items-center justify-center snap-center w-screen h-screen left-0 transition-all duration-200`}>
            <button className={`w-screen h-screen`} onClick={() => setClicked(!isClicked)}/>
            <div className={`${isClicked ? "hidden" : ""} m-16 p-12 flex fixed hover:cursor-auto bg-[#736349] rounded-2xl justify-center items-start flex-col`}>
                <div className={"flex gap-5 justify-center items-center"}>
                    <div className={""}>
                        <span className={"text-bold"}>{"Theme:\t"}</span>
                    </div>
                    <SlidingSwitch isChecked={isChecked} setIsChecked={setIsChecked}></SlidingSwitch>
                </div>
                <div className={"flex justify-center items-center mt-5 gap-4"}>
                    <label className={""}>Days remaining to display:</label>
                    <input id="days-remaining" className={"content-center w-8 bg-[#cccccc] text-black text-center rounded-xl"} onChange={handleDaysRemaining} placeholder="3" required/>
                </div>
            </div>
        </div>
    );
}