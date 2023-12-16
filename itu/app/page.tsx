'use client'
import Dashboard from '@components/Dashboard'
import DetailsOverlay from '@components/DetailsOverlay'
import { useState, useEffect } from 'react'
import { Plant, PlantData, getPlantData } from './PlantData'
import { useSession } from 'next-auth/react'
// @ts-ignore
var CryptoJS = require('crypto-js')

export default function Home() {
    const { data: session, status } = useSession()
    const [name, setName] = useState('')
    const [isClicked, setClicked] = useState(true)
    const [plantData, setPlantData] = useState([] as PlantData[])

    // const getAppData = async () => {
    //     let appData = await getPlantData();
    //     setPlantData(appData);
    // };

    const test = async () => {
        const a = CryptoJS.enc.Hex.stringify(
            CryptoJS.enc.Utf8.parse(session?.user?.email as string)
        )

        const res = await fetch(`/api/profile/${a}/overview`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })

        return await res.json()
    }

    useEffect(() => {
        if (status === 'authenticated') {
            test().then((r) => {
                const plants: PlantData[] = []
                r.map((plant: any) => {
                    plants.push({
                        nickname: plant.nickname,
                        name: plant.species.name,
                        plantId: plant.plantId,
                        description: plant.description,
                        customImage: plant.customImage,
                        days: Number(
                            (
                                (Date.parse(plant.waterings[0].dateWatered) -
                                    Date.now()) /
                                (1000 * 60 * 60 * 24)
                            ).toFixed(0)
                        ),
                        watering_frequency: plant.species.wateringPeriod,
                        watering_amount: plant.species.wateringAmount,
                    })
                })
                console.log(plants)
                setPlantData(plants)
            })
        }
    }, [status])

    useEffect(() => {})

    if (status === 'loading') return <div>Loading...</div>

    return (
        <div
            className={
                'relative flex h-full max-w-full flex-1 flex-col overflow-hidden'
            }
        >
            {/*<DetailsOverlay*/}
            {/*    isClicked={isClicked}*/}
            {/*    setClicked={setClicked}*/}
            {/*    name={name}*/}
            {/*/>*/}
            <main
                className={
                    'relative h-full w-full flex-1 overflow-auto transition-width'
                }
            >
                <div className={'main-div'}>
                    <Dashboard
                        isClicked={isClicked}
                        setClicked={setClicked}
                        setName={setName}
                        data={plantData}
                    ></Dashboard>
                    {/*<div*/}
                    {/*    className={*/}
                    {/*        "flex w-1/2 justify-between text-orange-200 text-lg font-semibold"*/}
                    {/*    }*/}
                    {/*>*/}
                    {/*    <div>*/}
                    {/*        <a href="#">Home</a>*/}
                    {/*    </div>*/}
                    {/*    <div>*/}
                    {/*        <a href="#">Contact</a>*/}
                    {/*    </div>*/}
                    {/*    <div>*/}
                    {/*        <a href="#">Services</a>*/}
                    {/*    </div>*/}
                    {/*    <div>*/}
                    {/*        <button onClick={() => setClicked(!isClicked)}>About</button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </main>
        </div>
    )
}
