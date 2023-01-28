import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons/fadownload'

type ClickFunction = (code: string, title: string) => void;

interface GameCardProps {
    name: string;
    code: string;
    region: string;
    image?: string;
    auto_updates?: boolean;
    full_game?: boolean;
    downloads?: number;
    version: string;
    console?: number;
    onClick: ClickFunction;
}

export default function GameCard({ name, code, image, version, full_game = false, region, downloads = 0, console = 4, auto_updates = false, onClick }: GameCardProps) {
    const [isHidden, setIsHidden] = useState(true)
    useEffect(() => {
        setIsHidden(false)
    })

    return (
        <div className={`shadow-lg rounded-[7px] ${auto_updates ? 'border-lime-700' : 'border-violet-700'} border-2 pb-3 hover:shadow-xl ${auto_updates ? 'hover:bg-lime-700' : 'hover:bg-violet-700'} hover:text-white duration-300 transition-all hover:-translate-y-1 hover:scale-102 cursor-pointer ${isHidden ? 'opacity-0' : ''}`} onClick={() => onClick(code, name)}>
            <img src={image} alt={`${name} Cover`} className='rounded-t-[5px] mb-3' />
            <h5 className="font-['Ubuntu_Mono'] tracking-tighter">{name}</h5>
            {console === 4 ?
                (<span className="bg-purple-100 text-purple-800 text-xs font-medium mr-1.5 px-1.5 py-0.5 rounded-full">PS4</span>) :
                (<span className="bg-blue-100 text-blue-800 text-xs font-medium mr-1.5 px-1.5 py-0.5 rounded-full">PS5</span>)}
            {full_game && <span className="bg-indigo-100 text-indigo-800 text-xs font-medium mr-1.5 px-1.5 py-0.5 rounded-full">Full Game</span>
            }
            {!auto_updates && <span className="bg-red-100 text-red-800 text-xs font-medium mr-1.5 px-1.5 py-0.5 rounded-full">New</span>}
            <br />
            <span className="bg-pink-100 text-pink-800 text-xs font-medium mr-1.5 px-1.5 py-0.5 rounded-full">{version}</span>
            <span className="bg-pink-100 text-pink-800 text-xs font-medium mr-1.5 px-1.5 py-0.5 rounded-full">{region}</span>
            <br />
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium mr-1.5 px-1.5 py-0.5 rounded-full"><FontAwesomeIcon icon={faDownload} /> {downloads}</span>
        </div>
    )
}
