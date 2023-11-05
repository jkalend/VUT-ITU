import Dashboard from "@components/Dashboard";
import Sidebar from "@components/Sidebar";

export default function abc() {

    return (
        <div className={"flex min-h-screen flex-col items-center justify-between p-24"}>
            <div className={"flex w-1/2 justify-between text-orange-200 text-lg font-semibold"}>
                <div><a href="#">Home</a></div>
                <div><a href="#">Contact</a></div>
                <div><a href="#">Services</a></div>
                <div><a href="#">About</a></div>
            </div>
        </div>
    )
}