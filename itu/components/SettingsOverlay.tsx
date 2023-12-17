// @ts-nocheck
// Authors : Jaroslav Streit (xstrei06), Jan kalenda (xkalen07)

'use client'
import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js'
import { useSession } from 'next-auth/react'

export default function SettingsOverlay({
    isClicked,
    setClicked,
}: {
    isClicked: boolean
    setClicked: any
}) {
    const { data: session, status } = useSession()
    const [daysRemaining, setDaysRemaining] = useState(3)
    // const [isChecked, setIsChecked] = useState(false)

    const handleDaysRemaining = async (event: any) => {
        event.preventDefault()
        const a = CryptoJS.enc.Hex.stringify(
            CryptoJS.enc.Utf8.parse(session?.user?.email as string)
        )

        const formdata = new FormData(event.target)
        setDaysRemaining(Number(formdata.get('days-remaining')))

        // edit days remaining to display
        const res = await fetch(`/api/profile/${a}/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                stgDays: Number(formdata.get('days-remaining')),
            }),
        })
    }

    useEffect(() => {
        if (status === 'authenticated') {
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
            getSettings().then((r) => {
                setDaysRemaining(r)
                console.log(r)
            })
        }
    }, [status])

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
                onClick={() => setClicked(!isClicked)}
            />
            <div
                className={`${
                    isClicked ? 'hidden' : ''
                } m-16 p-12 flex fixed hover:cursor-auto bg-[#736349] rounded-2xl justify-center items-start flex-col`}
            >
                {/*<div className={"flex gap-5 justify-center items-center"}>*/}
                {/*    <div className={""}>*/}
                {/*        <span className={"text-bold"}>{"Theme:\t"}</span>*/}
                {/*    </div>*/}
                {/*    <SlidingSwitch isChecked={isChecked} setIsChecked={setIsChecked}></SlidingSwitch>*/}
                {/*</div>*/}
                <form
                    className={'flex justify-center items-center mt-5 gap-4'}
                    onSubmit={handleDaysRemaining}
                >
                    <label className={''}>Days remaining to display:</label>
                    <input
                        id="days-remaining"
                        type="number"
                        name="days-remaining"
                        className={
                            'content-center w-16 bg-[#cccccc] text-black text-center rounded-xl'
                        }
                        value={daysRemaining}
                        onChange={(e) =>
                            setDaysRemaining(Number(e.target.value))
                        }
                        required
                    />
                </form>
            </div>
        </div>
    )
}
