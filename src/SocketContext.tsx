import { createContext, useState, useEffect, useRef } from 'react';
import { MESSAGE_TYPES } from './App';

interface SocketContextProps {
    socket?: WebSocket;
    data?: any;
    isConnected: boolean;
    isJdownloaderRunning: boolean;
    isGamesPathSet: boolean;
    ProxyAddress: ProxyAddressProps;
    currentVersion: string;
}

interface ProxyAddressProps {
    ip: string;
    port: string;
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
    const [ProxyAddress, setProxyAddress] = useState<ProxyAddressProps>({ ip: "localhost", port: "8081" })
    const currentVersion = useRef<string | null>(null)

    useEffect(() => {
        let timeout = 125;
        function connect() {
            const sock = new WebSocket(`ws://${window.location.hostname}:8089`);

            function onOpen() {
                timeout = 125;
                setIsConnected(true);

            }

            function onClose() {
                setIsConnected(false);
                console.log(`disconnected, will reconnect after ${timeout}ms...`);
                setTimeout(connect, Math.min(20000, timeout += timeout));
            }

            function onMessage(event: MessageEvent<any>) {
                const data = JSON.parse(event.data)
                switch (data.type) {
                    case MESSAGE_TYPES.ADD_GAME_TO_AUTO_UPDATES:
                        break;
                    case MESSAGE_TYPES.GET_ALL_GAMES:
                        setIsGamesPathSet(data.is_games_path_set);
                        currentVersion.current = data.version;
                        break;
                    case MESSAGE_TYPES.SET_AUTOUPDATES_GAMES_TXT_PATH_CONFIRM:
                        if (data.value)
                            setIsGamesPathSet(true)
                        break;
                    case MESSAGE_TYPES.PROXY_IP_ADDRESS:
                        setProxyAddress({ ip: data.ip, port: data.port })
                        break;
                    case MESSAGE_TYPES.APP_UPDATE:
                        close();
                    default:
                        break;
                }
                setSocketData(data)
            }

            sock.addEventListener('open', onOpen);

            sock.addEventListener('close', onClose);

            sock.addEventListener('message', onMessage);
            setSocket(sock);

            return () => {
                sock.removeEventListener('close', onClose);
                sock.removeEventListener('message', onMessage);
                sock.removeEventListener('open', onOpen);
                sock.close();
            }
        }

        return connect();
    }, []);

    return (<SocketContext.Provider value={{ socket, data: socketData, isConnected, isGamesPathSet, isJdownloaderRunning, ProxyAddress, currentVersion: currentVersion.current ?? '2.0.0' }}>
        {children}
    </SocketContext.Provider >)
}