'use client'
import DItem from './DItem'
import { useState, useEffect } from 'react'
import { PlantData } from '@/app/PlantData'
import CryptoJS from 'crypto-js'
import { useSession } from 'next-auth/react'

export default function Dashboard({
    isClicked,
    setClicked,
    setName,
    data,
}: {
    isClicked: boolean
    setClicked: any
    setName: any
    data: any
}) {
    const { data: session, status } = useSession()
    const [filteredData, setFilteredData] = useState([] as PlantData[])
    const [whichPlant, setWhichPlant] = useState(-1)
    useEffect(() => {
        const watering = async () => {
            if (whichPlant != -1) {
                const a = CryptoJS.enc.Hex.stringify(
                    CryptoJS.enc.Utf8.parse(session?.user?.email as string)
                )

                console.log(whichPlant)

                const res = await fetch(
                    `/api/profile/${a}/plants/${whichPlant.plantId}/watering`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            amount: whichPlant.watering_frequency,
                        }),
                    }
                )

                if (res.status === 200) {
                    data[data.indexOf(whichPlant)].days = Number(
                        data[data.indexOf(whichPlant)].watering_frequency
                    )
                    filteredData.splice(filteredData.indexOf(whichPlant), 1)
                    setWhichPlant(-1)
                } else {
                    console.log('Error: watering failed')
                    setWhichPlant(-1)
                }
            }
        }

        if (whichPlant != -1) {
            watering().then((r) => {})
        }
    })

    const [stg, setStg] = useState(3)
    useEffect(() => {
        const filteredData = data.filter(
            (h: PlantData) => h.days <= Number(stg)
        )
        setFilteredData(filteredData)
    }, [stg])

    const [refresh, setRefresh] = useState(false)
    useEffect(() => {
        if (status === 'authenticated') {
            const timeout = setTimeout(() => {
                const getSettings = async () => {
                    const a = CryptoJS.enc.Hex.stringify(
                        CryptoJS.enc.Utf8.parse(session?.user?.email as string)
                    )
                    const res = await fetch(`/api/profile/${a}/settings`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    })
                    return await res.json()
                }
                const getStg = async () => {
                    let data = await getSettings()
                    if (data.days_remaining !== stg) {
                        setStg(data)
                        //console.log(data);
                    }
                    setRefresh(!refresh)
                }
                getStg().then((r) => {})
            }, 1000)
            return () => {
                clearTimeout(timeout)
            }
        }
    }, [refresh, status])

    return (
        <div className={'flex flex-col py-15 px-15 gap-10'}>
            <div className={'mx-16'}>
                <h1 className={'text-orange-200 text-3xl font-semibold'}>
                    Overview
                </h1>
                <p className={'text-orange-200 font-semibold'}>
                    {filteredData.filter((a: PlantData) => a.days < 0).length}{' '}
                    plants in need of immediate watering
                </p>
            </div>
            <div
                className={
                    'flex flex-wrap flex-row gap-5 p-5 flex-initial justify-center'
                }
            >
                {filteredData.length > 0 ? (
                    filteredData.map((h: PlantData) => (
                        <DItem
                            key={h.plantId}
                            plant={h}
                            isClicked={isClicked}
                            setClicked={setClicked}
                            setName={setName}
                            setWhichPlant={setWhichPlant}
                        />
                    ))
                ) : (
                    <div className={'text-green-800 text-3xl font-semibold'}>
                        Good job! All plants are happy
                    </div>
                )}
            </div>
        </div>
    )
}
