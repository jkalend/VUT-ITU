// @ts-nocheck
// Author: Jan Kalenda
'use client'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import AddSpecies from '@components/AddSpecies'

const PlantsPage = () => {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [plants, setPlants] = useState([])
    const [isClicked, setClicked] = useState(true)

    useEffect(() => {
        if (status === 'authenticated') {
            // get species from database
            const getSpecies = async () => {
                const res = await fetch(`/api/species`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                })

                return await res.json()
            }

            getSpecies().then((r) => {
                setPlants(r)
            })
        } else if (status === 'unauthenticated') {
            router.push('/')
        }
    }, [status])

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
            <AddSpecies isClicked={isClicked} setClicked={setClicked} />
            <main
                className={
                    'relative w-full flex-1 overflow-auto transition-width'
                }
            >
                <div className={'main-div'}>
                    <div className={'flex w-full flex-row p-5 justify-between'}>
                        <h1 className={'font-bold text-2xl'}>Species</h1>
                        <button
                            onClick={() => setClicked(!isClicked)}
                            className={'p-4 text-xl rounded-2xl bg-green-950'}
                        >
                            Add Species
                        </button>
                    </div>
                    <div
                        className={
                            'flex flex-col rounded-2xl bg-gray-900 p-2 gap-2 w-full'
                        }
                    >
                        {plants.map(
                            (plant: any) => (
                                <button
                                    key={plant.plantId}
                                    onClick={() => {}}
                                    className={
                                        'flex flex-row justify-between p-5 rounded-2xl bg-gray-700 py-3'
                                    }
                                >
                                    <div className={'flex flex-col gap-1'}>
                                        <div
                                            className={
                                                'flex flex-row gap-5 justify-start items-center'
                                            }
                                        >
                                            <div
                                                className={'font-bold text-xl'}
                                            >
                                                {plant.name}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ),
                            []
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default PlantsPage
