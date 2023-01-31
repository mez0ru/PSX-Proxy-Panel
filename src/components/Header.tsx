import { useContext } from 'react'
import { SocketContext } from '../SocketContext'
import Alert from './Alert'

export default function Header() {
    const socketProvider = useContext(SocketContext)
    return <header className="mt-5">
        <div className="table mb-7">
            <h1 className="text-2xl sm:text-3xl md:text-5xl table-cell font-['Montserrat']">PSX Proxy Application</h1><span className="text-sm md:text-base align-middle table-cell pl-3 text-slate-400 font-['Kanit'] tracking-wide">Version 2.0.0 Beta</span>
        </div>
        {!socketProvider?.isJdownloaderRunning && <Alert message="JDownloader is not running!" />}
        {!socketProvider?.isGamesPathSet && <Alert level={4} message="games.txt path is not set, contact the person in charge to update it ASAP." />}
    </header>
}
