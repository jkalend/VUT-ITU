"use client"
import Image from "next/image";
import {getPlantDetail, PlantData} from "@/app/PlantData";
import {useState, useEffect} from "react";
import {useSession} from "next-auth/react";

export type SpeciesData = {
    name: string,
    period: number,
    amount: number,
}

export default function AddSpecies({isClicked, setClicked}: {
    isClicked: boolean,
    setClicked: any,
}) {

    const [data, setData] = useState({} as SpeciesData);
    const {data: session, status} = useSession();
    const [description, setDescription] = useState("")
    const [image, setImage] = useState(null);
    const [species, setSpecies] = useState([])
    const [createObjectURL, setCreateObjectURL] = useState("");

    const uploadToClient = (event: React.FormEvent<HTMLFormElement>) => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0];

            setImage(i);
            setCreateObjectURL(URL.createObjectURL(i));
        }
    };


    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const fileReader = new FileReader();
        const desc = description
        const formData = new FormData(event.currentTarget)

        fileReader.readAsDataURL(image);

        setDescription("")
        setImage(null)
        setCreateObjectURL("")
        setClicked(true)
        fileReader.onload = async () => {
            const base64 = fileReader.result
            const res = await fetch(`/api/species`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    "name": formData.get("name"),
                    "period": Number(formData.get("period")),
                    "amount": Number(formData.get("amount")),
                    "image": base64?.toString()
                }),
            });
            if (!res.ok) {
                console.log("Error")
            } else {
                const p = await res.json()
                //setNewPostFlag((flag)=> !flag)
            }
        };
    }

    const handleChange = (event: any) => {
        const {name, value} = event.target;
        setData({...data, [name]: value});
    }

    const getSpecies = async () => {
        const res = await fetch(`/api/species`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });
        if (!res.ok) {
            console.log("Error")
        }
        const data = await res.json();
        return data;
    }

    useEffect(() => {
        if (status === "authenticated") {
            getSpecies().then(r => {
                setData(r);
            });
        }
    });

    return (
        <div
            className={`${isClicked ? "collapse backdrop-blur-0" : "backdrop-blur-[5px]"} flex fixed z-30 items-center justify-center snap-center w-screen h-screen left-0 transition-all duration-200`}>
            <button className={`w-screen h-screen`} onClick={() => setClicked(!isClicked)}/>
            <div
                className={`${isClicked ? "hidden" : ""} m-16 p-16 flex fixed hover:cursor-auto bg-[#736349] rounded-2xl justify-center items-start flex-col`}>
                <form className={"flex flex-col gap-2 text-black"} onSubmit={onSubmit}>
                    <input type='file' name="myImage" id="file" onChange={uploadToClient} required>
                    </input>
                    <br></br>
                    <label htmlFor="name">Species Name:</label>
                    <input type="text" id="name" name="name"
                           onChange={handleChange}></input>
                    <label htmlFor="number">Species watering period:</label>
                    <input type="text" id="period" name="period"
                           onChange={handleChange}></input>
                    <label htmlFor="number">Species watering amount:</label>
                    <input id="amount" name="amount" onChange={handleChange}/>
                    <button type={"submit"} className={"z-10 p-2 text-center font-bold text-xl rounded-xl bg-red-800"}>
                        Add Species
                    </button>
                </form>
            </div>
        </div>
    );
}