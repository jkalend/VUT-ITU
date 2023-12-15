export default function Chatter({ chatter } : {chatter: any}) {
    return (
        <div className="flex w-full h-12 border border-black bg-gray-500 rounded-xl items-center justify-center">
            <h2 className="text-black items-center justify-center font-semibold">@{chatter.username}</h2>
        </div>
    );
}