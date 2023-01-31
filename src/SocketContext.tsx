import { createContext, useState, useEffect } from 'react';
import { MESSAGE_TYPES } from './App';

interface SocketContextProps {
    socket?: WebSocket;
    data?: any;
    isConnected: boolean;
    isJdownloaderRunning: boolean;
    isGamesPathSet: boolean;
}

export const SocketContext = createContext<SocketContextProps | undefined>(undefined);

interface Props {
    children: React.ReactNode;
}

export const SocketProvider: React.FC<Props> = ({ children }) => {
    const [socket, setSocket] = useState<WebSocket>()
    const [socketData, setSocketData] = useState<any>()
    const [isConnected, setIsConnected] = useState(false)
    const [isGamesPathSet, setIsGamesPathSet] = useState(true);
    const [isJdownloaderRunning, setIsJdownloaderRunning] = useState(true)

    useEffect(() => {
        let reconnectTimeout: NodeJS.Timeout
        function connect() {
            const sock = new WebSocket(`ws://${window.location.hostname}:8089`);
            let cleared = false;

            sock.addEventListener('open', (event) => {
                if (reconnectTimeout)
                    clearTimeout(reconnectTimeout)
                setIsConnected(true);
                sock.send(JSON.stringify({
                    type: MESSAGE_TYPES.GET_ALL_GAMES
                }));
            });

            sock.addEventListener('close', (event) => {
                setIsConnected(false);
                console.log('disconnected, will reconnect after 1s...');
                if (!cleared)
                    reconnectTimeout = setTimeout(connect, 1000)
            });

            sock.addEventListener('message', (event) => {
                const data = JSON.parse(event.data)
                switch (data.type) {
                    case MESSAGE_TYPES.ADD_GAME_TO_AUTO_UPDATES:
                        console.log('ADD_GAME_TO_AUTO_UPDATES in provider')
                        break;
                    case MESSAGE_TYPES.GET_ALL_GAMES:
                        setIsGamesPathSet(data.is_games_path_set);
                        break;
                    case MESSAGE_TYPES.SET_AUTOUPDATES_GAMES_TXT_PATH_CONFIRM:
                        if (data.value)
                            setIsGamesPathSet(true)
                        break;
                    default:
                        break;
                }
                setSocketData(data)
            });
            setSocket(sock);

            return () => {
                cleared = true;
                sock.close();
            }
        }

        return connect();
    }, []);

    return (<SocketContext.Provider value={{ socket, data: socketData, isConnected, isGamesPathSet, isJdownloaderRunning }}>
        {children}
    </SocketContext.Provider>)
}