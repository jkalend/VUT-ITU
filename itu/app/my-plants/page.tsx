// @ts-nocheck
"use client";
import {useRouter, useParams, redirect} from "next/navigation";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import Link from "next/link";
import AddSpecies from "@components/AddSpecies";
import AddPlant from "@components/AddPlant";
import CryptoJS from "crypto-js";


const PlantsPage = () => {
    const params = useParams();
    const router = useRouter();
    const {data: session, status} = useSession();
    const [plants, setPlants] = useState([]);
    const [error, setError] = useState(false);
    const [isClicked, setClicked] = useState(true);

    const getPlants = async () => {
        const a = CryptoJS.enc.Hex.stringify(
            CryptoJS.enc.Utf8.parse(session?.user?.email as string),
        );

        const res = await fetch(`/api/profile/${a}/plants`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });

        return await res.json();
    }


    useEffect(() => {
        if (status === "authenticated") {
            getPlants().then((r) => {
                setPlants(r)
                console.log((Date.parse(r[0].waterings[0].dateWatered) - Date.now()) / (1000 * 60 * 60 * 24));
            });
        } else if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status]);

    if (status === "loading")
        return (
            <div className={"flex h-screen w-screen justify-center items-center"}>
                Loading...
            </div>
        );

    return (
        <div
            className={
                "relative flex max-w-full flex-1 flex-col overflow-hidden"
            }
        >
            <AddPlant isClicked={isClicked} setClicked={setClicked}/>
            <main
                className={
                    "relative w-full flex-1 overflow-auto transition-width"
                }
            >
                <div className={"main-div"}>
                    <div className={"flex w-full flex-row p-5 justify-between"}>
                        <h1 className={"font-bold text-2xl"}>
                            Plants
                        </h1>
                        <button onClick={() => setClicked(!isClicked)}
                                className={"p-4 text-xl rounded-2xl bg-green-950"}>
                            Add Plant
                        </button>
                    </div>
                    <div className={"flex flex-col rounded-2xl bg-gray-900 p-2 gap-2 w-full"}>
                        {error ? <div className={"text-red-500"}>Error loading plants</div> :
                            plants.map((plant: any) => (
                                <button key={plant.plantId}
                                      onClick={() => {}}
                                      className={"flex flex-row justify-between p-5 rounded-2xl bg-gray-700 py-3"}>
                                    <div className={"flex flex-col gap-1"}>
                                        <div className={"flex flex-row gap-5 justify-start items-center"}>
                                            <div className={"font-bold text-xl"}>
                                                {plant.nickname}
                                            </div>
                                            <div className={"font-bold text-gray-500  max-w-[40vmin]"}>
                                                {plant.species.name}
                                            </div>
                                        </div>
                                        <h2 className={"text-gray-500"}>
                                            {plant.description}
                                        </h2>
                                    </div>
                                    <div className={`flex flex-row min-w-fit max-w-full gap-2 rounded-lg shadow border md:mt-0 sm:max-w-md bg-gray-700 border-gray-800 p-2 overflow-x-auto overflow-y-hidden`}>
                                        <div className={"flex flex-row gap-2 justify-start items-center"}>
                                            <div className={"font-bold text-xl flex flex-row flex-nowrap gap-1"}>
                                                {((Date.parse(plant.waterings[0].dateWatered) - Date.now()) / (1000 * 60 * 60 * 24)).toFixed(0)}
                                                <h1 className={"text-gray-500"}>
                                                    days left out of
                                                </h1>
                                            </div>
                                            <div className={"font-bold text-gray-500 text-xl max-w-[40vmin]"}>
                                                {plant.species.wateringPeriod}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ), [])}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PlantsPage;
