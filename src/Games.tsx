import { useEffect, useState, useContext } from 'react'
import { SocketContext } from './SocketContext';
import { MessageProps, MyModal, OPERATION } from './components/MyModal';
import { MESSAGE_TYPES } from './App';
import { Loading } from './components/Loading';
import GameCard from './components/GameCard';
import not_found from './assets/not_found.svg'

interface Game {
    name: string;
    code: string;
    region: number;
    image?: string;
    auto_updates?: boolean;
    full_game?: boolean;
    downloads?: number;
    version: string;
}

const REGION_STRING = ["SA", "US", "JP"];

interface Game_From_Server {
    type: number;
    game: Game;
}

export default function Games() {
    const socketProvider = useContext(SocketContext);
    const [requestedGames, setRequestedGames] = useState([] as Game[])
    const [modalProps, setModalProps] = useState<MessageProps>({ title: '', message: '', operation: 0 })
    const [isOpen, setIsOpen] = useState(false)
    const [selectedGame, setSelectedGame] = useState<Game>()

    useEffect(() => {
        switch (socketProvider?.data?.type) {
            case MESSAGE_TYPES.GAME: {
                console.log('GAME')
                const game = socketProvider?.data.game as Game;
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
            // case MESSAGE_TYPES.IS_JDOWNLOADER_RUNNING:
            //   setIsJdownloaderRunning(socketProvider?.data.value)
            //   break;
            case MESSAGE_TYPES.GAME_ICON: {
                const game = socketProvider?.data.game as Game;
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
                console.log('GET_ALL_GAMES')
                setRequestedGames([])
                socketProvider?.data.games.map((game_unmodified: Game_From_Server) => {
                    setRequestedGames(oldArray => [...oldArray, game_unmodified.game])
                })
            }
                break;
            case MESSAGE_TYPES.ADD_GAME_TO_AUTO_UPDATES:
                if (socketProvider?.data.value) {
                    setRequestedGames(oldArray => {
                        let newArray = [...oldArray]
                        const game = newArray.find((e) => e.code === socketProvider?.data.code);
                        if (game != undefined) {
                            game.auto_updates = true;
                            if (selectedGame && modalProps.message === `Are you sure you want to add "${game.name}" to auto update list?`) {
                                setTimeout(() => {
                                    setModalProps({ title: `Info`, message: `Congratulations, the game is added successfully, from now on, the game is going to be automatically updated!`, operation: OPERATION.INFO });
                                    setSelectedGame(undefined)
                                    setIsOpen(true)
                                }, 130);
                            }
                        }
                        return newArray
                    })
                } else {
                    if (selectedGame) {

                        setTimeout(() => {
                            setModalProps({ title: `Error!`, message: socketProvider?.data.message, operation: OPERATION.INFO });
                            setSelectedGame(undefined)
                            setIsOpen(true)
                        }, 130);
                    }
                }
                break;
            case MESSAGE_TYPES.REMOVE_GAME_FROM_AUTO_UPDATES:
                if (socketProvider?.data.value) {
                    setRequestedGames(oldArray => {
                        let newArray = [...oldArray]
                        const game = newArray.find((e) => e.code === socketProvider?.data.code);
                        if (game != undefined) {
                            game.auto_updates = false;
                            if (selectedGame && modalProps.message === `Are you sure you want to remove "${game.name}" from auto update list?`) {
                                setTimeout(() => {
                                    setModalProps({ title: `Info`, message: `Removed "${game.name}" successfully from the auto update list.`, operation: OPERATION.INFO });
                                    setSelectedGame(undefined)
                                    setIsOpen(true)
                                }, 130);
                            }
                        }
                        return newArray
                    })
                } else {
                    if (selectedGame) {
                        setTimeout(() => {
                            setModalProps({ title: `Error!`, message: socketProvider?.data.message, operation: OPERATION.INFO });
                            setSelectedGame(undefined)
                            setIsOpen(true)
                        }, 130);
                    }
                }
                break;
            default:
                break;
        }
    }, [socketProvider?.data])

    const ChangeGameAutoUpdates = (code: string, title: string) => {
        const game = requestedGames.find((e) => e.code === code) || {} as Game;

        if (!socketProvider?.isGamesPathSet) {
            setModalProps({ title: `Warning`, message: `games.txt path is not set, please update it first before you can add this game to the auto updates list.`, operation: OPERATION.INFO });
        }
        else if (game.auto_updates) {
            // setModalProps({ title: `Info`, message: `The game "${title}" is already added to auto update list.`, operation: OPERATION.INFO });
            setModalProps({ title: `Confirmation`, message: `Are you sure you want to remove "${title}" from auto update list?`, operation: OPERATION.CONFIRMATION });
        } else {
            setModalProps({ title: `Confirmation`, message: `Are you sure you want to add "${title}" to auto update list?`, operation: OPERATION.CONFIRMATION });
        }

        setSelectedGame(game)
        setIsOpen(true)
    }

    const confirmChangingGameAutoUpdates = () => {
        setIsOpen(false)
        socketProvider?.socket?.send(JSON.stringify({
            type: selectedGame?.auto_updates ? MESSAGE_TYPES.REMOVE_GAME_FROM_AUTO_UPDATES : MESSAGE_TYPES.ADD_GAME_TO_AUTO_UPDATES,
            game: selectedGame,
        }))
    }

    return <Loading isLoading={socketProvider?.isConnected ? false : true}>
        <MyModal messageProps={modalProps} isOpen={isOpen} setIsOpen={setIsOpen} confirmAction={confirmChangingGameAutoUpdates} />
        <h2 className="text-lg sm:text-xl md:mb-3">Requested Games</h2>
        <h3 className={`text-lg tracking-wide font-['Montserrat'] text-slate-500 text-center my-10 italic duration-1000 transition-opacity ${requestedGames.length ? 'hidden' : ''}`}>Fresh! nothing to show here...<br />Start by using the PSX Proxy server.</h3>
        <div className={`grid grid-cols-8c text-center gap-4 my-5 md:my-8 ml-3 duration-1000 transition-opacity ${requestedGames.length ? '' : 'opacity-0'}`}>
            {requestedGames.map((item, i) => {
                return (
                    <GameCard key={i} name={item.name} version={item.version} image={item.image ? item.image : not_found} code={item.code} downloads={item?.downloads} full_game={item.full_game} auto_updates={item?.auto_updates} region={REGION_STRING[item.region]} onClick={ChangeGameAutoUpdates} />
                )
            })
            }
        </div>
    </Loading>

}
