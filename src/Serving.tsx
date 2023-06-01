import { useState } from "react";

export default function Serving() {
    const [hidden, setHidden] = useState(false);
    return <div onClick={() => setHidden(true)} className={`cursor-pointer ${hidden ? 'hidden' : ''}`}>
        <div className='table md:mb-3'>
            <h2 className="text-lg sm:text-xl align-middle table-cell">Currently Serving <span className="font-['Montserrat'] text-red-500 font-semibold">LIVE</span></h2>
        </div>
        <div className={`flex items-center justify-center text-lg tracking-wide font-['Montserrat'] text-slate-500 text-center my-3 italic duration-1000 transition-opacity bg-slate-50 h-[250px]`}><h3>To be implemented in a future update... (Click to hide).</h3></div>
        {/* <div className={`flex flex-row text-center overflow-auto gap-4 py-2 my-5 md:my-3 ml-3 duration-1000 transition-opacity ${requestedGames.length ? '' : 'opacity-0'}`}>
            {requestedGames.map((item, i) => {
                return (
                    <GameCard key={i} name={item.name} version={item.version} image={item.image ? item.image : not_found} code={item.code} downloads={item?.downloads} full_game={item.full_game} auto_updates={item?.auto_updates} region={REGION_STRING[item.region]} game_found={item.game_found} onClick={ChangeGameAutoUpdates} />
                )
            })
            }
        </div> */}
    </div>
}
