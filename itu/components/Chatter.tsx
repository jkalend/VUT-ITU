import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Chatter({ chatter, isClicked, setIsClicked, setChatter, group, transfer, setTransfer} 
    : {chatter: any, isClicked: boolean, setIsClicked: any, setChatter: any, group: any, transfer: boolean, setTransfer: any}) {

    const { data: session } = useSession();

    const toggleRemove = () => {
        setChatter(chatter);
        setIsClicked(!isClicked);
    }

    const toggleTransfer = () => {
        setTransfer(!transfer);
    }

    if(group !== null){
        return (
            <div className="flex flex-row w-full h-12 border border-black bg-gray-500 rounded-xl items-center">
                {group.ownerEmail === chatter.email ? 
                (
                    <button className={`${group.ownerEmail === chatter.email ? "pointer-events-none" : "" } flex h-11 aspect-square pl-2 items-center justify-center`}
                    onClick={group.ownerEmail === chatter.email ? toggleTransfer : undefined}
                    >
                        <Image
                            className={"flex-auto"}
                            src={"/crown.png"}
                            alt={"Remove member"}
                            width={10}
                            height={10}
                            layout="fixed"
                            unoptimized={true}
                        />
                    </button>
                )
                :
                (
                    <div className={"flex h-11 aspect-square pl-2 items-center justify-center"}/>
                )}
                <div className="flex flex-grow items-center justify-center">
                    <h2 className="text-black items-center justify-center font-semibold">@{chatter.username}</h2>
                </div>
                {group.ownerEmail === session?.user?.email || chatter.email === session?.user?.email ?
                    (
                    <button onClick={toggleRemove} className="flex h-10 aspect-square items-center justify-center">
                        <Image
                            className={"flex-auto"}
                            src={"/remove-user.png"}
                            alt={"Remove member"}
                            width={10}
                            height={10}
                            layout="fixed"
                            unoptimized={true}
                        />
                    </button>
                    )
                    :
                    (
                    <div className={"flex h-11 aspect-square items-center justify-center"}/>
                    )}
            </div>
        );
    } else {
        return (
            <div className="flex flex-row w-full h-12 border border-black bg-gray-500 rounded-xl">
                <div className="flex w-[76%] items-center justify-center">
                    <h2 className="text-black items-center justify-center font-semibold">Loading...</h2>
                </div>
            </div>
        );
    }
}