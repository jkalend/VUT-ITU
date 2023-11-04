import Image from "next/image";
import DItem from "./DItem";

export default function Dashboard() {
    let data = [["aloe vera", "/aloe_vera.jpg", -2],
                ["monstera adansonii", "/monstera-adansonii.jpg", -1],
                ["chlorophytum comosum", "/spider_plant.jpg", 0],
                ["draecena trifasciata", "/snake_plant.png", 2],
                ["aloe vera", "/aloe_vera.jpg", -2]
            ].sort ((a) => a[2])


    return (
        <div className={"flex flex-col py-15 px-15 gap-10"}>
            <div className={""}>
                <h1 className={"text-orange-200 text-3xl font-semibold"}>
                    Overview
                </h1>
                <p className={"text-orange-200 font-semibold"}>
                    {data.filter((a) => a[2] < 0).length} plants in need of immediate watering
                </p>
            </div>
            <div className={"flex flex-wrap flex-row gap-5 p-5 flex-initial justify-center"}>
                {data.map ((h) =>
                    (<DItem name={h[0].toString()} image_path={h[1].toString()} days={h[2]}/>)
                )}
            </div>
        </div>
    );
}