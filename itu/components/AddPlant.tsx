// @ts-nocheck
// Author: Jan Kalenda
'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import CryptoJS from 'crypto-js'

export default function AddPlant({
    isClicked,
    setClicked,
    setChange,
}: {
    isClicked: boolean
    setClicked: any
    setChange: any
}) {
    const { data: session, status } = useSession()
    const [description, setDescription] = useState('')
    const [image, setImage] = useState(null)
    const [species, setSpecies] = useState([])
    const [createObjectURL, setCreateObjectURL] = useState('')

    const uploadToClient = (event: React.FormEvent<HTMLFormElement>) => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0]

            setImage(i)
            setCreateObjectURL(URL.createObjectURL(i))
        }
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        // encode email to hex
        const a = CryptoJS.enc.Hex.stringify(
            CryptoJS.enc.Utf8.parse(session?.user?.email as string)
        )

        const fileReader = new FileReader()
        const formData = new FormData(event.currentTarget)

        // if image is selected
        if (formData.get('myImage').name != '') {
            fileReader.readAsDataURL(image)

            setDescription('')
            setImage(null)
            setCreateObjectURL('')
            fileReader.onload = async () => {
                const base64 = fileReader.result
                const res = await fetch(`/api/profile/${a}/newPlant`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nickname: formData.get('nickname'),
                        description: formData.get('description'),
                        species: Number(formData.get('species')),
                        image: base64?.toString(),
                    }),
                })
                if (!res.ok) {
                    console.log('Error')
                } else {
                    const p = await res.json()
                    //setNewPostFlag((flag)=> !flag)
                }
            }
        } else {
            // if image is not selected
            const res = await fetch(`/api/profile/${a}/newPlant`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nickname: formData.get('nickname'),
                    description: formData.get('description'),
                    species: Number(formData.get('species')),
                    image: '',
                }),
            })
            if (!res.ok) {
                console.log('Error')
            } else {
                const p = await res.json()
            }
        }
        setClicked(true)
        setChange(true)
    }

    const handleChange = (event: any) => {
        // dummy handler
    }

    useEffect(() => {
        if (status === 'authenticated') {
            // get species from database
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

            getSpecies().then((r) => {
                setSpecies(r)
            })
        }
    })

    return (
        <div
            className={`${
                isClicked ? 'collapse backdrop-blur-0' : 'backdrop-blur-[5px]'
            } flex fixed z-30 items-center justify-center snap-center w-screen h-screen left-0 transition-all duration-200`}
        >
            <button
                className={`w-screen h-screen`}
                onClick={() => setClicked(!isClicked)}
            />
            <div
                className={`${
                    isClicked ? 'hidden' : ''
                } m-16 p-16 flex fixed hover:cursor-auto bg-[#736349] rounded-2xl justify-center items-start flex-col`}
            >
                <div>
                    {createObjectURL == '' ? (
                        ''
                    ) : (
                        <Image
                            src={createObjectURL}
                            width={300}
                            height={300}
                            alt="Selected picture"
                        />
                    )}
                </div>
                <form
                    className={'flex flex-col gap-2 text-black'}
                    onSubmit={onSubmit}
                >
                    <input
                        type="file"
                        name="myImage"
                        id="file"
                        className={'rounded-xl text-white bg-[#292020] p-1'}
                        onChange={uploadToClient}
                    ></input>
                    <br></br>
                    <label htmlFor="nickname">Plant Nickname:</label>
                    <input
                        type="text"
                        id="nickname"
                        name="nickname"
                        maxLength={40}
                        className={'rounded-xl text-white bg-[#292020] p-1'}
                        onChange={handleChange}
                    ></input>
                    <label htmlFor="description">Plant Description:</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        maxLength={190}
                        className={'rounded-xl text-white bg-[#292020] p-1'}
                        onChange={handleChange}
                    ></input>
                    <label htmlFor="species">Plant Species:</label>
                    <select
                        id="species"
                        name="species"
                        onChange={handleChange}
                        className={'rounded-xl text-white bg-[#292020] p-1'}
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
                    <button
                        type={'submit'}
                        className={
                            'z-10 p-2 text-center font-bold text-xl rounded-xl bg-green-800'
                        }
                    >
                        Add Plant
                    </button>
                </form>
            </div>
        </div>
    )
}
