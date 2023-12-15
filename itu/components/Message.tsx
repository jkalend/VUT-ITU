export default function Group({ message } : {message: any}) {
    return (
        <div className="flex p-2 flex-col bg-gray-600 hover:bg-gray-700">
            <div className="flex flex-row break-words items-center ">
                <h2 className="font-bold mr-3 text-amber-300 break-all flex-wrap">{message.author.username}</h2>
                <p className="text-xs text-gray-400 break-all flex-wrap">{message.dateCreated}</p>
            </div>
            <div className="flex flex-row break-all">
                <p className="text-while break-all flex-wrap">{message.text}</p>
            </div>
        </div>
    );
}