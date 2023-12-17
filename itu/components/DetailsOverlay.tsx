// @ts-nocheck
// Author: Jan Kalenda
'use client'
import Image from 'next/image'
import { PlantData } from '@/app/PlantData'
import { useState, useEffect } from 'react'
import CryptoJS from 'crypto-js'
import { useSession } from 'next-auth/react'

export default function DetailsOverlay({
    isClicked,
    setClicked,
    plant,
    setChange,
}: {
    isClicked: boolean
    setClicked: any
    plant: PlantData
    setChange: any
}) {
    const { data: session, status } = useSession()
    const [species, setSpecies] = useState([])
    const [editClicked, setEditClicked] = useState(false)
    const [image, setImage] = useState(null)
    const [createObjectURL, setCreateObjectURL] = useState('')
    const [defaultSpec, setDefaultSpec] = useState(-1)
    const [values, setValues] = useState({
        nickname: plant.nickname,
        description: plant.description,
    })

    const uploadToClient = (event: React.FormEvent<HTMLFormElement>) => {
        // event.preventDefault()
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0]

            setImage(i)
            setCreateObjectURL(URL.createObjectURL(i))
        }
    }

    const getSpecies = async () => {
        const res = await fetch(`/api/species`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        if (!res.ok) {
            console.log('Error')
        }
        const data = await res.json()
        return data
    }

    const handleEdit = async (e: any) => {
        e.preventDefault()
        const a = CryptoJS.enc.Hex.stringify(
            CryptoJS.enc.Utf8.parse(session?.user?.email as string)
        )

        const fileReader = new FileReader()
        const formData = new FormData(e.currentTarget)
        if (formData.get('myImage')?.name != '') {
            fileReader.readAsDataURL(image)
            fileReader.onload = async () => {
                const base64 = fileReader.result
                const res = await fetch(
                    `/api/profile/${a}/plants/${plant.plantId}`,
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            nickname: formData.get('nickname'),
                            description: formData.get('description'),
                            image: base64?.toString(),
                            species: Number(formData.get('species')),
                        }),
                    }
                )
                // plant.nickname = e.target.nickname.value
                // plant.description = e.target.description.value
                setChange(true)
                if (res.status === 200) {
                    console.log('Edited')
                    setEditClicked(false)
                    setClicked(true)
                    setChange(true)
                } else {
                    console.log('Error')
                }
                console.log(plant)
            }
        } else {
            const res = await fetch(
                `/api/profile/${a}/plants/${plant.plantId}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nickname: formData.get('nickname'),
                        description: formData.get('description'),
                        image: '',
                        species: Number(formData.get('species')),
                    }),
                }
            )
            if (!res.ok) {
                console.log('Error')
            } else {
                const p = await res.json()
                setEditClicked(false)
                setClicked(true)
                setChange(true)
            }
        }
    }

    const handleDelete = async () => {
        const a = CryptoJS.enc.Hex.stringify(
            CryptoJS.enc.Utf8.parse(session?.user?.email as string)
        )
        const res = await fetch(`/api/profile/${a}/plants/${plant.plantId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
        if (res.status === 200) {
            console.log('Deleted')
            setClicked(true)
            setChange(true)
        } else {
            console.log('Error')
        }
    }

    useEffect(() => {
        if (status === 'authenticated') {
            getSpecies().then((r) => {
                setSpecies(r)
                const spc = r.find((spec: any) => plant.name == spec.name)
                if (spc != undefined) setDefaultSpec(spc.speciesId)
            })
        }
    }, [status, isClicked])

    useEffect(() => {
        setValues({ nickname: plant.nickname, description: plant.description })
    }, [isClicked])

    const handleChange = (event: any) => {
        setValues({ ...values, [event.target.name]: event.target.value })
    }

    if (isClicked) {
        return <></>
    }

    return (
        <div
            className={`${
                isClicked ? 'collapse backdrop-blur-0' : 'backdrop-blur-[5px]'
            } flex fixed z-30 items-center justify-center snap-center w-screen h-screen left-0 transition-all duration-200`}
        >
            <button
                className={`w-screen h-screen`}
                onClick={() => {
                    setClicked(!isClicked)
                    setEditClicked(false)
                }}
            />
            <div
                className={`${
                    isClicked ? 'hidden' : ''
                } m-16 p-16 flex fixed hover:cursor-auto bg-[#736349] rounded-2xl justify-center items-start flex-col gap-5`}
            >
                {editClicked ? (
                    <>
                        <form
                            onSubmit={handleEdit}
                            className={'gap-3 flex flex-col'}
                        >
                            {createObjectURL == '' ? (
                                <Image
                                    className={'flex-auto select-none'}
                                    src={plant.customImage}
                                    alt={'Plant image'}
                                    width={200}
                                    height={200}
                                />
                            ) : (
                                <Image
                                    src={createObjectURL}
                                    width={300}
                                    height={300}
                                    alt="Selected picture"
                                />
                            )}
                            <input
                                type="file"
                                name="myImage"
                                id="file"
                                className={
                                    'rounded-xl text-white bg-[#292020] p-1'
                                }
                                onChange={uploadToClient}
                            ></input>
                            <div
                                className={`flex flex-row gap-5 justify-start items-center`}
                            >
                                <div className={'flex flex-col'}>
                                    <label htmlFor={'nickname'}>
                                        Nickname:
                                    </label>
                                    <input
                                        className={
                                            'text-black text-bold text-base justify-center items-start rounded-xl p-1'
                                        }
                                        name={'nickname'}
                                        value={values.nickname}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor={'species'}>Species:</label>
                                    <select
                                        id="species"
                                        name="species"
                                        className={
                                            'rounded-xl text-white bg-[#292020] p-1'
                                        }
                                        defaultValue={defaultSpec}
                                    >
                                        {species.map((species: any) => (
                                            <option
                                                key={species.speciesId}
                                                value={species.speciesId}
                                            >
                                                {species.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <label htmlFor={'description'}>Description:</label>
                            <input
                                className={`text-black text-bold text-base justify-center items-start rounded-xl p-1`}
                                name={'description'}
                                value={values.description}
                                onChange={handleChange}
                            />
                            <div
                                className={
                                    'flex flex-row justify-center items-center gap-5 w-full'
                                }
                            >
                                <button
                                    className={
                                        'text-bold text-base bg-[#292020] p-1 rounded-xl'
                                    }
                                    type={'submit'}
                                    // onClick={() => setEditClicked(!editClicked)}
                                >
                                    Edit
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <div
                            className={`flex flex-row gap-5 justify-start items-center`}
                        >
                            <Image
                                className={'flex-auto select-none'}
                                src={plant.customImage}
                                alt={'Plant image'}
                                width={200}
                                height={200}
                            />
                            <div className={'flex flex-col'}>
                                <span
                                    className={
                                        'text-bold text-2xl justify-center items-start'
                                    }
                                >
                                    {'Name:\t' + plant.nickname}
                                </span>
                                <span
                                    className={
                                        'text-bold justify-center items-start'
                                    }
                                >
                                    {'Species:\t' + plant.name}
                                </span>
                                <span className={'text-bold'}>
                                    {plant.days > 0
                                        ? 'Days left:\t' + plant.days
                                        : 'Days overdue:\t' + plant.days * -1}
                                </span>
                                <span className={'text-bold'}>
                                    {'Water every:\t' +
                                        plant.watering_frequency +
                                        ' days'}
                                </span>
                                <span className={'text-bold'}>
                                    {'Water amount:\t' +
                                        plant.watering_amount +
                                        ' ml'}
                                </span>
                            </div>
                        </div>
                        <span
                            className={`text-bold text-base justify-center items-start`}
                        >
                            {'Description:\n' + plant.description}
                        </span>
                        <div
                            className={
                                'flex flex-row justify-center items-center gap-5 w-full'
                            }
                        >
                            <button
                                className={
                                    'text-bold text-base bg-[#292020] p-1 rounded-xl'
                                }
                                onClick={() => setEditClicked(!editClicked)}
                            >
                                Edit
                            </button>
                            <button
                                className={
                                    'text-bold text-base bg-red-950 text-white p-1 px-3 rounded-xl'
                                }
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
