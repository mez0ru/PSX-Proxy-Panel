import { useContext } from 'react'
import { SocketContext } from '../SocketContext'
import Alert from './Alert'

export default function Header() {
    const socketProvider = useContext(SocketContext)
    return <header className="mt-5">
        <div className="table md:mb-1">
            <h1 className="align-middle text-2xl sm:text-3xl md:text-5xl table-cell font-['Montserrat']">PSX Proxy Application</h1>
            <div className="text-sm align-middle table-cell pl-3 text-slate-400 font-['Kanit'] md:text-base md:pl-5">
                <h6>Version 2.0.0 Beta</h6>
                {socketProvider?.isConnected ? <h6>Status: <span className='text-blue-400'>Connected</span></h6> : <h6>Status: <span className="text-rose-400"> &nbsp;No Connection</span></h6>}
                <h6 className="font-['Montserrat']">IP : &nbsp;{socketProvider?.ProxyAddress.ip}<br className='inline-block lg:hidden' /><span className="hidden lg:inline-block">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>PORT : &nbsp;{socketProvider?.ProxyAddress.port}</h6>
            </div>
        </div>
        {!socketProvider?.isJdownloaderRunning && <Alert message="JDownloader is not running!" />}
        {!socketProvider?.isGamesPathSet && <Alert level={4} message="games.txt path is not set, contact the person in charge to update it ASAP." />}
    </header>
}
