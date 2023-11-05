"use client"
import Dashboard from "@components/Dashboard";
import DetailsOverlay from "@components/DetailsOverlay";
import {useState, useEffect} from "react";
import { Plant, PlantData, getPlantData } from "./PlantData";


export default function Home() {
    const [name, setName] = useState("");
    const [isClicked, setClicked] = useState(true);
    const [plantData, setPlantData] = useState ([] as PlantData []);

    const getAppData = async () => {
      let appData = await getPlantData();
      setPlantData (appData);
    }

    useEffect(() => {
        getAppData();
    });

    return (
      <div className={"relative flex h-full max-w-full flex-1 flex-col overflow-hidden"}>
          <DetailsOverlay isClicked={isClicked} setClicked={setClicked} name={name}/>
          <main className={"relative h-full w-full flex-1 overflow-auto transition-width"}>
              <div className={"main-div"}>
                  <Dashboard isClicked={isClicked} setClicked={setClicked} setName={setName} data={plantData}></Dashboard>
                  <div className={"flex w-1/2 justify-between text-orange-200 text-lg font-semibold"}>
                    <div><a href="#">Home</a></div>
                    <div><a href="#">Contact</a></div>
                    <div><a href="#">Services</a></div>
                    <div><button onClick={() => setClicked(!isClicked)}>About</button></div>
                  </div>
              </div>
          </main>
      </div>
    )
}
