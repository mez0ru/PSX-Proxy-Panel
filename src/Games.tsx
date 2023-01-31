import { useEffect, useState, useContext } from 'react'
import { SocketContext } from './SocketContext';
import { MessageProps } from './components/MyModal';
import { MESSAGE_TYPES } from './App';

interface GamesProps {
    setMessageProps: MessageProps;
}

export default function Games({ setMessageProps }: GamesProps) {
    const socket = useContext(SocketContext);
    const [requestedGames, setRequestedGames] = useState([] as Game[])

    useEffect(() => {
        function onMessage(event) {
            const data = JSON.parse(event.data)
            switch (data.type) {
                case MESSAGE_TYPES.GAME: {
                    const game = data.game as Game;
                    setRequestedGames(oldArray => {
                        let newArray = [...oldArray]
                        const game_index = newArray.findIndex((e) => e.code === game.code);
                        if (game_index !== -1) {
                            newArray[game_index] = game;
                            return newArray
                        } else {
                            if (newArray.length > 29)
                                newArray.shift()
                            return [...newArray, game]
                        }
                    })
                }
                    break;
                case MESSAGE_TYPES.IS_JDOWNLOADER_RUNNING:
                    setIsJdownloaderRunning(data.value)
                    break;
                case MESSAGE_TYPES.GAME_ICON: {
                    const game = data.game as Game;
                    setRequestedGames(oldArray => {
                        let newArray = [...oldArray]
                        const game_index = newArray.findIndex((e) => e.code === game.code);
                        if (game_index !== -1) {
                            newArray[game_index].image = game.image;
                            return newArray
                        } else {
                            if (newArray.length > 29)
                                newArray.shift()
                            return [...newArray, game]
                        }
                    })
                }
                    break;
                case MESSAGE_TYPES.GET_ALL_GAMES: {
                    setRequestedGames([])
                    data.games.map((game_unmodified: Game_From_Server) => {
                        setRequestedGames(oldArray => [...oldArray, game_unmodified.game])
                    })
                    setIsGamesPathSet(data.is_games_path_set);
                }
                    break;
                case MESSAGE_TYPES.ADD_GAME_TO_AUTO_UPDATES:
                    if (data.value) {
                        setRequestedGames(oldArray => {
                            let newArray = [...oldArray]
                            const game_index = newArray.findIndex((e) => e.code === data.code);
                            newArray[game_index].auto_updates = true;
                            setSelectedGame(newArray[game_index]);
                            setModalProps({ title: `Info`, message: `Congratulations, the game is added successfully!`, operation: OPERATION.INFO });
                            return newArray
                        })
                    } else {
                        setModalProps({ title: `Error!`, message: data.message, operation: OPERATION.INFO });
                    }

                    break;
                case MESSAGE_TYPES.SET_AUTOUPDATES_GAMES_TXT_PATH: {
                    setPath(data.value)
                }
                    break;
                case MESSAGE_TYPES.SET_AUTOUPDATES_GAMES_TXT_PATH_CONFIRM: {
                    if (data.value) {
                        setModalProps({ title: `Info`, message: "Operation completed successfully!", operation: OPERATION.INFO });
                        setIsGamesPathSet(true)
                    } else {
                        setModalProps({ title: `Error!`, message: data.message, operation: OPERATION.INFO });
                    }
                }
                    break;
                default:
                    break;
            }
        }

        if (socket) {

        }

        return () => {
            socket?.removeEventListener('message', onMessage);
        }
    }, [third])


    return (
        <>
            <h2 className="text-lg sm:text-xl md:my-3">Requested Games</h2>
            <h3 className={`text-lg tracking-wide font-['Montserrat'] text-slate-500 text-center my-10 italic duration-1000 transition-opacity ${requestedGames.length ? 'hidden' : ''}`}>Fresh! nothing to show here...<br />Start by using the PSX Proxy server.</h3>
            <div className={`grid grid-cols-8c text-center gap-4 my-5 md:my-8 ml-3 duration-1000 transition-opacity ${requestedGames.length ? '' : 'opacity-0'}`}>
                {requestedGames.map((item, i) => {
                    return (
                        <GameCard key={i} name={item.name} version={item.version} image={item.image ? item.image : not_found} code={item.code} downloads={item?.downloads} full_game={item.full_game} auto_updates={item?.auto_updates} region={REGION_STRING[item.region]} onClick={addRequestedGame} />
                    )
                })
                }
            </div>
        </>
    )
}
