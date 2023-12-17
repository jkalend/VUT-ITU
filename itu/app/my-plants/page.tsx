// @ts-nocheck
'use client'
import { useRouter, useParams, redirect } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import AddPlant from '@components/AddPlant'
import CryptoJS from 'crypto-js'
import Image from 'next/image'
import DetailsOverlay from '@components/DetailsOverlay'
import { PlantData } from '@/app/PlantData'

const PlantsPage = () => {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [plants, setPlants] = useState([] as PlantData[])
    const [error, setError] = useState(false)
    const [isClicked, setClicked] = useState(true)
    const [detailClicked, setDetailClicked] = useState(true)
    const [clickedPlant, setClickedPlant] = useState({} as PlantData)
    const [change, setChange] = useState(true)
    const [search, setSearch] = useState('')

    const getPlants = async () => {
        const a = CryptoJS.enc.Hex.stringify(
            CryptoJS.enc.Utf8.parse(session?.user?.email as string)
        )

        const res = await fetch(`/api/profile/${a}/plants`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })

        return await res.json()
    }

    useEffect(() => {
        if (status === 'authenticated' && change) {
            getPlants().then((r) => {
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
                const filteredPlants = plants.filter((plant: PlantData) => {
                    return plant.nickname
                        .toLowerCase()
                        .includes(search.toLowerCase())
                })

                setPlants(filteredPlants)
                setChange(false)
            })
        } else if (status === 'unauthenticated') {
            router.push('/')
        }
    }, [status, change])

    const handleSearch = (event: any) => {
        const timer = setTimeout(() => {
            setChange(true)
            setSearch(event.target.value)

            return () => clearTimeout(timer)
        }, 200)
    }

    if (status === 'loading')
        return (
            <div
                className={'flex h-screen w-screen justify-center items-center'}
            >
                Loading...
            </div>
        )

    return (
        <div
            className={
                'relative flex max-w-full flex-1 flex-col overflow-hidden'
            }
        >
            <AddPlant
                isClicked={isClicked}
                setClicked={setClicked}
                setChange={setChange}
            />
            <DetailsOverlay
                isClicked={detailClicked}
                setClicked={setDetailClicked}
                plant={clickedPlant}
                setChange={setChange}
            />
            <main
                className={
                    'relative w-full flex-1 overflow-auto transition-width'
                }
            >
                <div className={'main-div'}>
                    <div
                        className={
                            'flex w-full flex-row p-5 justify-between items-center'
                        }
                    >
                        <h1 className={'font-bold text-2xl'}>Plants</h1>
                        <input
                            className={
                                'w-20 rounded-xl min-h-[40px] text-center p-1 text-black'
                            }
                            onChange={handleSearch}
                            placeholder={'search'}
                        />
                        <button
                            onClick={() => setClicked(!isClicked)}
                            className={'p-4 text-xl rounded-2xl bg-green-950'}
                        >
                            Add Plant
                        </button>
                    </div>
                    <div
                        className={
                            'flex flex-col rounded-2xl bg-transparent p-2 gap-2 w-full'
                        }
                    >
                        {error ? (
                            <div className={'text-red-500'}>
                                Error loading plants
                            </div>
                        ) : (
                            plants &&
                            plants.map(
                                (plant: PlantData) => (
                                    <button
                                        key={plant.plantId}
                                        onClick={() => {
                                            setDetailClicked(!detailClicked)
                                            setClickedPlant(plant)
                                        }}
                                        className={`flex flex-row justify-between p-5 rounded-2xl py-3 bg-[#292020] items-center`}
                                    >
                                        <div className={'flex flex-col gap-1'}>
                                            <div
                                                className={
                                                    'flex flex-row gap-5 justify-start items-center'
                                                }
                                            >
                                                <Image
                                                    className="rounded-lg w-[214px] h-[120px]"
                                                    alt={'plant photo'}
                                                    src={plant.customImage}
                                                    width={120}
                                                    height={120}
                                                />
                                                <div
                                                    className={
                                                        'flex flex-col gap-1 justify-start items-start'
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            'font-bold text-xl'
                                                        }
                                                    >
                                                        {plant.nickname}
                                                    </div>
                                                    <div
                                                        className={
                                                            'font-bold text-gray-500  max-w-[40vmin]'
                                                        }
                                                    >
                                                        {plant.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={`flex flex-row min-w-fit max-w-full gap-2 rounded-lg shadow border bg-amber-900 border-gray-800 p-2 overflow-x-auto overflow-y-hidden`}
                                        >
                                            <div
                                                className={
                                                    'flex flex-row gap-2 justify-start items-center'
                                                }
                                            >
                                                <div
                                                    className={
                                                        'font-bold text-xl flex flex-row flex-nowrap gap-1'
                                                    }
                                                >
                                                    {plant.days > 0
                                                        ? plant.days
                                                        : plant.days * -1}
                                                    <h1
                                                        className={
                                                            'text-gray-500'
                                                        }
                                                    >
                                                        {plant.days > 0
                                                            ? 'days left out of'
                                                            : 'days overdue out of'}
                                                    </h1>
                                                </div>
                                                <div
                                                    className={
                                                        'font-bold text-gray-500 text-xl max-w-[40vmin]'
                                                    }
                                                >
                                                    {plant.watering_frequency}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ),
                                []
                            )
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default PlantsPage
