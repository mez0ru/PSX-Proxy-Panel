import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons/fadownload'
import { faSquareXmark } from '@fortawesome/free-solid-svg-icons/faSquareXmark'
import { faCheck } from '@fortawesome/free-solid-svg-icons/facheck'
import { useEffect, useRef, useState } from 'react';
import { Transition } from '@headlessui/react';

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
    onClick: ClickFunction;
}

export default function GameCard({ name, code, image, version, full_game = false, region, downloads = 0, auto_updates = false, onClick }: GameCardProps) {
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
        <div ref={cardRef} onTransitionEnd={transitionEnd} className={`shadow-lg rounded-[7px] ${auto_updates ? 'border-lime-700' : 'border-violet-700'} border-2 pb-3 hover:shadow-xl relative ${auto_updates ? 'hover:bg-lime-700' : 'hover:bg-violet-700'} hover:text-white hover:-translate-y-1 hover:scale-102 cursor-pointer transition-all duration-1000 ${show ? 'opacity-100' : 'opacity-0'}`} onMouseEnter={onHover} onMouseLeave={onHover} onClick={() => onClick(code, name)}>
            <img src={image} alt={`${name} Cover`} className='rounded-t-[5px] mb-3' />
            <Transition appear show={false} enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <h4 className="absolute top-[6px] left-[5px] bg-red-600 text-white font-['Kanit'] px-1 text-sm"><FontAwesomeIcon icon={faSquareXmark} /> Not Found</h4>
            </Transition>

            <Transition appear show={auto_updates && isHovered} enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <h4 className="absolute top-[6px] left-[5px] bg-green-600 text-white font-['Kanit'] px-1 text-sm"><FontAwesomeIcon icon={faCheck} />Already Added!</h4>
            </Transition>

            <h5 className="font-['Ubuntu_Mono'] tracking-tighter">{name}</h5>

            {code.startsWith('CUSA') ?
                (<span className="bg-purple-100 font-['Montserrat'] text-purple-800 text-xs font-medium mr-1.5 px-1.5 py-0.5 rounded-full">PS4</span>) :
                (<span className="bg-blue-100 font-['Montserrat'] text-blue-800 text-xs font-medium mr-1.5 px-1.5 py-0.5 rounded-full">PS5</span>)}

            {full_game && <><span className="bg-indigo-100 font-['Montserrat'] text-indigo-800 text-xs font-medium mr-1.5 px-1.5 py-0.5 rounded-full">Full Game</span>
                <br /></>}

            <span className="bg-pink-100 text-pink-800 font-['Montserrat'] text-xs font-medium mr-1.5 px-1.5 py-0.5 rounded-full">{version}</span>

            <span className="bg-pink-100 text-pink-800 font-['Montserrat'] text-xs font-medium mr-1.5 px-1.5 py-0.5 rounded-full">{region}</span>

            {(!auto_updates && full_game) ? <span className="bg-red-100 font-['Montserrat'] text-red-800 text-xs font-medium mr-1.5 px-1.5 py-0.5 rounded-full">New</span> : !auto_updates && <><br /><span className="bg-red-100 font-['Montserrat'] text-red-800 text-xs font-medium mr-1.5 px-1.5 py-0.5 rounded-full">New</span></>}

            <br />

            <span className="bg-indigo-100 text-indigo-800 text-xs font-['Montserrat'] font-medium mr-1.5 px-1.5 py-0.5 rounded-full"><FontAwesomeIcon icon={faDownload} /> {downloads}</span>
        </div>
    )
}
