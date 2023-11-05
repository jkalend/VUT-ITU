//Author: Jaroslav Streit (xstrei06)

import React, { useState } from 'react';
import { setTheme} from "@/app/Settings";

function SlidingSwitch({isChecked, setIsChecked} : {isChecked: boolean, setIsChecked: any}) {

    const toggleSwitch = () => {
        setIsChecked(!isChecked);
        setTheme(!isChecked ? "dark" : "light");
    };

    return (
        <div className={`sliding-switch ${isChecked ? 'checked' : ''}`}>
            <input type="checkbox" checked={isChecked} onChange={toggleSwitch} />
            <div className="slider" onClick={toggleSwitch}></div>
        </div>
    );
}

export default SlidingSwitch;