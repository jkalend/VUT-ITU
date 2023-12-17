// @ts-nocheck
'use client'
import Dashboard from '@components/Dashboard'
import { useState, useEffect } from 'react'
import { PlantData } from './PlantData'
import { useSession } from 'next-auth/react'
var CryptoJS = require('crypto-js')

export default function Home() {
    const { data: session, status } = useSession()
    const [name, setName] = useState('')
    const [isClicked, setClicked] = useState(true)
    const [plantData, setPlantData] = useState([] as PlantData[])

    // author: Jan Kalenda
    useEffect(() => {
        if (status === 'authenticated') {
            // get plant overview
            const getPlants = async () => {
                const a = CryptoJS.enc.Hex.stringify(
                    CryptoJS.enc.Utf8.parse(session?.user?.email as string)
                )

                const res = await fetch(`/api/profile/${a}/overview`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                })

                return await res.json()
            }

            getPlants().then((r) => {
                const plants: PlantData[] = []
                if (r.length === 0) {
                    setPlantData([])
                    return
                }
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
                setPlantData(plants)
            })
        }
    }, [status])

    if (status === 'loading') return <div>Loading...</div>

    if (status === 'authenticated')
        return (
            // <div
            //     className={
            //         'relative flex h-full max-w-full flex-1 flex-col overflow-hidden'
            //     }
            // >
            //     {/*<DetailsOverlay*/}
            //     {/*    isClicked={isClicked}*/}
            //     {/*    setClicked={setClicked}*/}
            //     {/*    name={name}*/}
            //     {/*/>*/}

            <div className={'main-div'}>
                <div className="flex flex-col relative h-full py-15 px-15 gap-10">
                    <Dashboard
                        isClicked={isClicked}
                        setClicked={setClicked}
                        setName={setName}
                        data={plantData}
                    ></Dashboard>
                </div>
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
            //   </div>
        )
}
