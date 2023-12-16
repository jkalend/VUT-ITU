import { PlantData } from "@/app/PlantData";
import Image from "next/image";

export default function DItem( {plant, isClicked, setClicked, setName, setWhichPlant} : {plant: PlantData, isClicked: boolean, setClicked: any, setName: any, setWhichPlant: any}) {

    let style = (plant.days >= 0) ? 'bg-green-200 hover:bg-green-300':'bg-red-200 hover:bg-red-300'
  return (
    <div className="w-[363px] h-[322px] relative">
        <div className="w-[363px] h-[322px] left-0 top-0 absolute bg-orange-200 rounded-lg"/>
        <button onClick={() => {
            // setClicked(!isClicked);
            // setName(plant.name);
        }
        }>
            <Image className="w-[345.29px] h-[215px] left-[8.85px] top-[9px] absolute rounded-lg" alt={"plant photo"} src={plant.customImage} width={345.29} height={215}>
            </Image>
        </button>
        <div className="w-[164.90px] left-[99.60px] top-[287px] absolute text-stone-400 text-center text-sm font-semibold]">
            {(plant.days >= 0) ? (plant.days == 1) ? `in ${plant.days} days`: `in ${plant.days} days`: (plant.days == -1) ?`${-plant.days} day overdue`:`${-plant.days} days overdue`}
        </div>

        <div className="w-[318px] h-[34px] px-[21px] py-[5px] left-[25px] top-[181px] absolute bg-white bg-opacity-70 rounded-lg shadow justify-center items-center gap-2.5 inline-flex">
            <div className="text-black text-xl font-semibold">{plant.nickname.toString()}</div>
        </div>

        <button className={"w-[326px] h-[47px] px-[25px] py-[9px] left-[17px] top-[232px] absolute border border-black justify-center items-center gap-2.5 inline-flex text-white font-bold rounded-lg " + style}
                onClick={() => {
                    //setWhichPlant(plant);
        }}>
            <div className="text-slate-700 text-2xl font-semibold">
                    Tap to Water
            </div>
        </button>
    </div>
  )
}
