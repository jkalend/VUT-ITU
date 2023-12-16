// @ts-nocheck
'use client'
import { useRouter, useParams, redirect } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import AddSpecies from '@components/AddSpecies'
import CryptoJS from 'crypto-js'

const PlantsPage = () => {
    const params = useParams()
    const router = useRouter()
    const { data: session, status } = useSession()
    const [plants, setPlants] = useState([])
    const [error, setError] = useState(false)
    const [isClicked, setClicked] = useState(true)

    const getSpecies = async () => {
        const res = await fetch(`/api/species`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })

        return await res.json()
    }

    useEffect(() => {
        if (status === 'authenticated') {
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
                        {error ? (
                            <div className={'text-red-500'}>
                                Error loading plants
                            </div>
                        ) : (
                            plants.map(
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
                                                    className={
                                                        'font-bold text-xl'
                                                    }
                                                >
                                                    {plant.name}
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
