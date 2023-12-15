export default function Group({ group } : {group: any}) {
    return (
        <a href={`/chat/${group.groupId}`}>
            <button className="aspect-auto h-full max-w-xs bg-orange-300 rounded-xl hover:bg-orange-400 hover:cursor-pointer">
                <div className="flex p-5 flex-col justify-center break-words items-center ">
                    <h1 className="m-1 font-bold text-gray-800 break-all flex-wrap">{group.name}</h1>
                    <p className="m-1 text-gray-800 break-words flex-wrap">{group.creator}</p>
                </div>
            </button>
        </a>
    );
}
