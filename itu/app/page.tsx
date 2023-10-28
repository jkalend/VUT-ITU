import Menu from "@components/Menu";
import Dashboard from "@components/Dashboard";

export default function Home() {

    return (
      <div className={"flex min-h-screen flex-col items-center justify-between p-24"}>
          <Dashboard></Dashboard>
          <p className={"text-2xl font-bold text-center"}>Please delete the item after adding it and not doing anything with it or you or anyone else really will get an error in your lovely terminal</p>
          <Menu></Menu>
          <ul className="mt-6">
              <li className="mb-4"><a href="#" className="text-lg">Home</a></li>
              <li className="mb-4"><a href="#" className="text-lg">About</a></li>
              <li className="mb-4"><a href="#" className="text-lg">Services</a></li>
              <li className="mb-4"><a href="#" className="text-lg">Contact</a></li>
          </ul>
          <ul className="mt-6">
              <li className="mb-4"><a href="#" className="text-lg">Home</a></li>
              <li className="mb-4"><a href="#" className="text-lg">About</a></li>
              <li className="mb-4"><a href="#" className="text-lg">Services</a></li>
              <li className="mb-4"><a href="#" className="text-lg">Contact</a></li>
          </ul>
          <ul className="mt-6">
              <li className="mb-4"><a href="#" className="text-lg">Home</a></li>
              <li className="mb-4"><a href="#" className="text-lg">About</a></li>
              <li className="mb-4"><a href="#" className="text-lg">Services</a></li>
              <li className="mb-4"><a href="#" className="text-lg">Contact</a></li>
          </ul>
          <ul className="mt-6">
              <li className="mb-4"><a href="#" className="text-lg">Home</a></li>
              <li className="mb-4"><a href="#" className="text-lg">About</a></li>
              <li className="mb-4"><a href="#" className="text-lg">Services</a></li>
              <li className="mb-4"><a href="#" className="text-lg">Contact</a></li>
          </ul>
          <ul className="mt-6">
              <li className="mb-4"><a href="#" className="text-lg">Home</a></li>
              <li className="mb-4"><a href="#" className="text-lg">About</a></li>
              <li className="mb-4"><a href="#" className="text-lg">Services</a></li>
              <li className="mb-4"><a href="#" className="text-lg">Contact</a></li>
          </ul>
      </div>
    )
}
