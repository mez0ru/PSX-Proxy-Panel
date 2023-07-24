import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons/fadownload'
import { faSquareXmark } from '@fortawesome/free-solid-svg-icons/faSquareXmark'
import { faCheck } from '@fortawesome/free-solid-svg-icons/facheck'
import { SparklesIcon } from '@heroicons/react/20/solid'
import { useEffect, useRef, useState } from 'react';
import { Transition } from '@headlessui/react';

type ClickFunction = (code: string, title: string, pending: boolean) => void;

interface GameCardProps {
    name: string;
    code: string;
    region: string;
    image?: string;
    auto_updates?: boolean;
    full_game?: boolean;
    addons: number;
    game_found?: boolean;
    downloads?: number;
    version: string;
    pending?: boolean;
    onClick: ClickFunction;
}

export default function GameCard({ name, code, image, version, full_game = false, region, downloads = 0, auto_updates = false, game_found, pending = false, addons, onClick }: GameCardProps) {
    const [show, setShow] = useState(false)
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false)
    const transitionEnd = () => {
        cardRef.current?.classList.replace('duration-1000', 'duration-300')
        cardRef.current?.removeEventListener('transitionend', transitionEnd)
    }

    const onHover = () => {
        setIsHovered(!isHovered)
    }

    useEffect(() => {
        setShow(true);
        setTimeout(transitionEnd, 1000)
    }, [])

    return (
        <div ref={cardRef} onTransitionEnd={transitionEnd} className={`shadow-lg rounded-[7px] ${auto_updates ? 'border-lime-700' : pending ? 'border-red-600' : 'border-violet-700'} shrink-0 w-[150px] border-2 pb-3 hover:shadow-xl group relative ${auto_updates ? 'hover:bg-lime-700' : pending ? 'hover:bg-red-600' : 'hover:bg-violet-700'} hover:text-white hover:-translate-y-1 hover:scale-102 cursor-pointer transition-all duration-1000 ${show ? 'opacity-100' : 'opacity-0'}`} onMouseEnter={onHover} onMouseLeave={onHover} onClick={() => onClick(code, name, pending)}>
            <img src={image} alt={`${name} Cover`} className='rounded-t-[5px] mb-3' />
            <Transition appear show={game_found !== undefined && !game_found && auto_updates} enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <h4 className="absolute top-[6px] left-[5px] bg-red-600 text-white font-['Kanit'] px-1 text-sm"><FontAwesomeIcon icon={faSquareXmark} /> Not Found</h4>
            </Transition>

            <Transition appear show={game_found !== undefined && game_found && auto_updates} enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <h4 className="absolute top-[6px] left-[5px] bg-green-600/50 group-hover:bg-green-600 text-white font-['Kanit'] px-1 text-sm duration-300 transition-colors"><FontAwesomeIcon icon={faCheck} />READY!</h4>
            </Transition>

            <Transition appear show={!auto_updates && !pending && isHovered} enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <h4 className="absolute top-[6px] left-[5px] bg-violet-600 text-white font-['Kanit'] px-1 text-sm"><SparklesIcon className="inline h-3 w-3" aria-hidden="true" /> Not Added</h4>
            </Transition>

            <h5 className="font-['Ubuntu_Mono'] tracking-tighter px-1">{name}</h5>

            <>{(full_game || code.startsWith("P")) && <span className="bg-indigo-100 font-['Montserrat'] text-indigo-800 text-xs font-medium mr-1.5 px-1.5 py-0.5 rounded-full">Full Game</span>}
                <span className="bg-pink-100 text-pink-800 font-['Montserrat'] text-xs font-medium mr-1.5 px-1.5 py-0.5 rounded-full">{region}</span>
                <br /></>

            <span className="bg-pink-100 text-pink-800 font-['Montserrat'] text-xs font-medium mr-1.5 px-1.5 py-0.5 rounded-full">{version}</span>
            {(addons > 1) && <span className="bg-emerald-100 font-['Montserrat'] text-emerald-800 text-xs font-medium mr-1.5 px-1.5 py-0.5 rounded-full">{addons}X</span>}

            <br />

            <span className="bg-indigo-100 text-indigo-800 text-xs font-['Montserrat'] font-medium mr-1.5 px-1.5 py-0.5 rounded-full"><FontAwesomeIcon icon={faDownload} /> {downloads}</span>
            {pending && <span className="bg-yellow-100 font-['Montserrat'] text-yellow-800 text-xs font-medium mr-1.5 px-1.5 py-0.5 rounded-full">Incomplete</span>}
        </div>
    )
}
