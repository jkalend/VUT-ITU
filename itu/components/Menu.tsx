"use client";

async function createData() {
    try {
        const res = await fetch("/api/posts", {
            method: "POST"
        })
        if (res.ok) {
            console.log("OK")
        }
    } catch (e) {
        console.log(e);
    }
}

async function removeData() {
    try {
        const res = await fetch("/api/posts", {
            method: "DELETE"
        })
        if (res.ok) {
            console.log("OK")
        }
    } catch (e) {
        console.log(e);
    }
}

export default function Menu() {
    return (
        <div className={"flex-auto justify-between mx-10 my-3 py-3 px-5"}>
            <button className={'text-center bg-gray-600 rounded-full mx-10 my-3 px-5 py-3 hover:bg-green-950'}
                    type={'button'}
                    onClick={() => {
                        createData()
                    }}
            >
                Add Item
            </button>
            <button className={'bg-gray-600 rounded-full mx-10 my-3 px-5 py-3 hover:bg-red-950'}
                    type={'button'}
                    onClick={() => {
                        removeData()
                    }}
            >
                Remove Item
            </button>
        </div>
    );
}