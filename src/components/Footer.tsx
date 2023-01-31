import { useState, useContext } from 'react'
import { MESSAGE_TYPES } from '../App';
import { SocketContext } from '../SocketContext';
import { MessageProps, OPERATION, SetGamesPathModal } from './SetGamesPathModal';

interface FooterProps {
    marginfull: boolean;
    path: string;
    setPath: React.Dispatch<React.SetStateAction<string>>;
}

export default function Footer({ marginfull, path, setPath }: FooterProps) {
    const [passcode, setPasscode] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [modalProps, setModalProps] = useState<MessageProps>({ title: '', message: '', operation: 0 })
    const socket = useContext(SocketContext)

    const confirmGamesPath = () => {
        setIsOpen(false)
        socket?.send(JSON.stringify({
            type: MESSAGE_TYPES.SET_AUTOUPDATES_GAMES_TXT_PATH_CONFIRM,
            passcode, value: path,
        }))
    }

    const FooterOnClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        switch (event.currentTarget.id) {
            case 'about':
                setModalProps({ title: `About`, message: `This is the control panel of psx proxy server, changes are immediate, meaning you don't have to refresh the page to observe changes, new games will automatically pop up here, including any changes.`, operation: OPERATION.INFO });
                break;
            case 'licensing':
                setModalProps({
                    title: `Licensing`, message: `This software should be used as is, with the permission of the owner. All rights reserved.\n
            Editing of assets, source code, reverse engineering are all prohibited under this license. Contact the creator for any furthur inqueries "mez0ru@gmail.com".`, operation: OPERATION.INFO
                });
                break;
            case 'set-games':
                setPasscode('')
                setModalProps({ title: `Change games.txt path`, message: `YOU MUST NOT CHANGE THE PATH, THIS IS THE ADMINISTRATOR'S JOB.`, operation: OPERATION.INPUT });
                socket?.send(JSON.stringify({ type: MESSAGE_TYPES.SET_AUTOUPDATES_GAMES_TXT_PATH }))
                break;

        }

        setIsOpen(true);
    }

    return (<>
        <SetGamesPathModal messageProps={modalProps} isOpen={isOpen} setIsOpen={setIsOpen} confirmAction={confirmGamesPath} passcode={passcode} setPasscode={setPasscode} path={path} setPath={setPath} />
        <footer className={`p-4 bg-white md:flex md:items-center md:justify-between md:p-6 ${marginfull ? 'mt-auto' : ''}`}>
            <span className="text-sm text-gray-500 sm:text-center">© 2023 <a href="https://github.com/mez0ru" className="hover:underline">Hamzah Abdulqudos Al-washali</a>. All Rights Reserved.
            </span>
            <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 sm:mt-0">
                <li>
                    <a id="about" href="#" className="mr-4 hover:underline md:mr-6" onClick={FooterOnClick}>About</a>
                </li>
                <li>
                    <a id="set-games" href="#" className="mr-4 hover:underline md:mr-6" onClick={FooterOnClick}>Set "Games.txt" Path</a>
                </li>
                <li>
                    <a id="licensing" href="#" className="mr-4 hover:underline md:mr-6" onClick={FooterOnClick}>Licensing</a>
                </li>
            </ul>
        </footer>
    </>
    )
}
