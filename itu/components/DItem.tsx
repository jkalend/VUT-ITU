import Link from "next/link";

export default function DItem( {name, image_path, days} : {name: string, image_path: string, days: number}) {

    let style = (days >= 0) ? 'bg-green-200 hover:bg-green-300':'bg-red-200 hover:bg-red-300'
  return (
    <div className="w-[363px] h-[322px] relative">
    <div className="w-[363px] h-[322px] left-0 top-0 absolute bg-orange-200 rounded-lg"></div>
    <img className="w-[345.29px] h-[215px] left-[8.85px] top-[9px] absolute rounded-lg" src={image_path} />
    <div className="w-[164.90px] left-[99.60px] top-[287px] absolute text-stone-400 text-center text-sm font-semibold]">
        {(days >= 0) ? (days == 1) ? `in ${days} days`: `in ${days} days`: (days == -1) ?`${-days} day overdue`:`${-days} days overdue`}
    </div>
    <div className="w-[318px] h-[34px] px-[21px] py-[5px] left-[25px] top-[181px] absolute bg-white bg-opacity-70 rounded-lg shadow justify-center items-center gap-2.5 inline-flex">
        <div className="text-black text-xl font-semibold font-['Inter']">{name}</div>
    </div>
    <div className={"w-[326px] h-[47px] px-[25px] py-[9px] left-[17px] top-[232px] absolute border border-black justify-center items-center gap-2.5 inline-flex text-white font-bold rounded-lg " + style}>
        <div className="text-slate-700 text-2xl font-semibold font-['Inter']">Tap to Water</div>
    </div>
    </div>
  )
}
