import { useEffect, useState, useContext } from 'react'
import { SocketContext } from './SocketContext';
import { MessageProps, MyModal, OPERATION } from './components/MyModal';
import { ChangePendingStatusModal, OPERATION as PENDING_OPERATION } from './components/ChangePendingStatusModal';
import { MESSAGE_TYPES } from './App';
import { Loading } from './components/Loading';
import GameCard from './components/GameCard';
import not_found from './assets/not_found.svg'
import { Switch } from '@headlessui/react';

export interface Game {
    name: string;
    code: string;
    region: number;
    image?: string;
    auto_updates?: boolean;
    game_found?: boolean;
    full_game?: boolean;
    full_game_json?: string[];
    downloads?: number;
    version: string;
    pending: boolean;
}

export enum ActionResult {
    UNINITIALIZED = 0,
    INITIALIZED,
    SUCCESS,
    FAIL,
    FILES_ARE_CORRECT,
}

const REGION_STRING = ["SA", "US", "JP"];

export default function Games() {
    const socketProvider = useContext(SocketContext);
    const [requestedGames, setRequestedGames] = useState([] as Game[])
    const [modalProps, setModalProps] = useState<MessageProps>({ title: '', message: '', operation: 0, code: '' })
    const [scLink, setScLink] = useState('');
    const [isOpen, setIsOpen] = useState(false)
    const [isPendingOpen, setIsPendingOpen] = useState(false)
    const [selectedGame, setSelectedGame] = useState<Game>()
    const [failsafe, setFailsafe] = useState(false)
    const [jdownloadResult, setJdownloaderResult] = useState<ActionResult>(ActionResult.UNINITIALIZED);
    const [fileCheckResult, setFileCheckResult] = useState<ActionResult>(ActionResult.UNINITIALIZED);
    useEffect(() => {
        if (socketProvider?.isConnected) {
            socketProvider?.socket?.send(JSON.stringify({
                type: MESSAGE_TYPES.GET_ALL_GAMES
            }));
        }
    }, [socketProvider?.isConnected])
    useEffect(() => {
        switch (socketProvider?.data?.type) {
            case MESSAGE_TYPES.GAME: {
                const game = socketProvider?.data.game as Game;
                setRequestedGames(oldArray => {
                    const game_index = oldArray.findIndex((e) => e.code === game.code);
                    if (game_index !== -1) {
                        Object.assign(oldArray[game_index], game);
                    } else {
                        if (oldArray.length > 29)
                            oldArray.shift()
                        oldArray.push(game)
                    }
                    return [...oldArray]
                })
            }
                break;
            case MESSAGE_TYPES.REGISTER_PENDING: {
                const success = socketProvider?.data.value;
                if (success) {
                    const game = socketProvider?.data.game as Game;
                    setRequestedGames(oldArray => {
                        const game_index = oldArray.findIndex((e) => e.code === game.code);
                        if (game_index !== -1) {
                            oldArray[game_index].pending = !success;
                            oldArray[game_index].version = game.version;
                            return [...oldArray]
                        } else {
                            if (oldArray.length > 50)
                                oldArray.shift()
                            return [...oldArray, game]
                        }
                    })

                    setModalProps({ title: `Success!`, message: `The incomplete setup was successful! Checking for updates for this game is now supported!`, operation: OPERATION.INFO, code: selectedGame?.code ?? "" });
                    setSelectedGame(undefined)
                    setIsOpen(true)
                } else {
                    setModalProps({ title: `Error`, message: `The incomplete setup was not successful. Error: ${socketProvider?.data.message ?? ""}`, operation: OPERATION.INFO, code: selectedGame?.code ?? "" });
                    setSelectedGame(undefined)
                    setIsOpen(true)
                }

            } break;
            // case MESSAGE_TYPES.IS_JDOWNLOADER_RUNNING:
            //   setIsJdownloaderRunning(socketProvider?.data.value)
            //   break;
            case MESSAGE_TYPES.GAME_ICON: {
                const game = socketProvider?.data.game as Game;
                setRequestedGames(oldArray => {
                    const game_index = oldArray.findIndex((e) => e.code === game.code);
                    if (game_index !== -1) {
                        if (!oldArray[game_index].image) {
                            oldArray[game_index].image = game.image;
                            return [...oldArray]
                        }
                        return oldArray
                    } else {
                        if (oldArray.length > 50)
                            oldArray.shift()
                        return [...oldArray, game]
                    }
                })
            }
                break;
            case MESSAGE_TYPES.GET_ALL_GAMES: {
                setRequestedGames(socketProvider?.data.games)
                setFailsafe(socketProvider?.data.failSafeMode)
            }
                break;
            case MESSAGE_TYPES.GET_ALL_GAMES: {
                setRequestedGames(socketProvider?.data.games)
                setFailsafe(socketProvider?.data.failSafeMode)
            }
                break;
            case MESSAGE_TYPES.ADD_GAME_TO_AUTO_UPDATES:
                if (socketProvider?.data.value) {
                    const game = requestedGames.find((e) => e.code === socketProvider?.data.code);
                    if (game != undefined) {
                        game.auto_updates = true;
                        game.game_found = socketProvider?.data.exists ? true : false
                        if (selectedGame && modalProps.message === `Are you sure you want to add "${game.name}" to auto update list?`) {
                            setTimeout(() => {
                                setModalProps({ title: `Info`, message: `Congratulations, the game is added successfully, from now on, the game is going to be automatically updated!`, operation: OPERATION.INFO, code: game.code });
                                setSelectedGame(undefined)
                                setIsOpen(true)
                            }, 130);
                        }
                    }
                } else {
                    if (selectedGame) {

                        setTimeout(() => {
                            setModalProps({ title: `Error!`, message: socketProvider?.data.message, operation: OPERATION.INFO, code: "" });
                            setSelectedGame(undefined)
                            setIsOpen(true)
                        }, 130);
                    }
                }
                break;
            case MESSAGE_TYPES.REMOVE_GAME_FROM_AUTO_UPDATES: {
                if (socketProvider?.data.value) {
                    const game = requestedGames.find((e) => e.code === socketProvider?.data.code);
                    if (game != undefined) {
                        game.auto_updates = false;
                        if (selectedGame && modalProps.message === `Are you sure you want to remove "${game.name}" from auto update list?`) {
                            setTimeout(() => {
                                setModalProps({ title: `Info`, message: `Removed "${game.name}" successfully from the auto update list.`, operation: OPERATION.INFO, code: game.code });
                                setSelectedGame(undefined)
                                setIsOpen(true)
                            }, 130);
                        }
                    }
                } else {
                    if (selectedGame) {
                        setTimeout(() => {
                            setModalProps({ title: `Error!`, message: socketProvider?.data.message, operation: OPERATION.INFO, code: "" });
                            setSelectedGame(undefined)
                            setIsOpen(true)
                        }, 130);
                    }
                }
            }
                break;
            case MESSAGE_TYPES.DOWNLOAD_GAME_UPDATE: {
                if (isPendingOpen || isOpen)
                    setJdownloaderResult(socketProvider?.data.value ? ActionResult.SUCCESS : ActionResult.FAIL);
                else
                    setJdownloaderResult(ActionResult.UNINITIALIZED);
            } break;
            case MESSAGE_TYPES.CHECK_GAME_FOR_CORRUPTION: {
                if (isOpen)
                    setFileCheckResult(socketProvider?.data.value ? socketProvider?.data.correct ? ActionResult.FILES_ARE_CORRECT : ActionResult.SUCCESS : ActionResult.FAIL);
                else
                    setFileCheckResult(ActionResult.UNINITIALIZED);
            } break;
            default:
                break;
        }
    }, [socketProvider?.data])

    const ChangeGameAutoUpdates = (code: string, title: string, pending: boolean) => {
        const game = requestedGames.find((e) => e.code === code) || {} as Game;

        if (!socketProvider?.isGamesPathSet) {
            setModalProps({ title: `Warning`, message: `games.txt path is not set, please update it first before you can add this game to the auto updates list.`, operation: OPERATION.INFO, code });
        }
        else if (game.auto_updates) {
            // setModalProps({ title: `Info`, message: `The game "${title}" is already added to auto update list.`, operation: OPERATION.INFO });
            setModalProps({ title: `Remove Game`, message: `Are you sure you want to remove "${title}" from auto update list?`, operation: OPERATION.CONFIRMATION, code, full_game: game.full_game, addons: game.full_game_json ? game.full_game_json.length : 0 });
        } else if (pending) {
            setModalProps({ title: `Incomplete Setup!`, message: `Adding this game to auto update list is currently not possible, you have to obtain the SC file link from a certain source first.`, operation: PENDING_OPERATION.INPUT, code });
            setScLink('');
        } else {
            setModalProps({ title: `Add Game`, message: `Are you sure you want to add "${title}" to auto update list?`, operation: OPERATION.CONFIRMATION, code, full_game: game.full_game, addons: game.full_game_json ? game.full_game_json.length : 0 });
        }

        setSelectedGame(game)
        if (pending)
            setIsPendingOpen(true);
        else
            setIsOpen(true)
    }

    const confirmChangingGameAutoUpdates = () => {
        setIsOpen(false)
        socketProvider?.socket?.send(JSON.stringify({
            type: selectedGame?.auto_updates ? MESSAGE_TYPES.REMOVE_GAME_FROM_AUTO_UPDATES : MESSAGE_TYPES.ADD_GAME_TO_AUTO_UPDATES,
            game: selectedGame,
        }))
    }

    const confirmChangingPendingStatus = () => {
        setIsPendingOpen(false)
        socketProvider?.socket?.send(JSON.stringify({
            type: MESSAGE_TYPES.REGISTER_PENDING,
            game: selectedGame,
            value: scLink,
        }))
    }

    const confirmDownload = () => {
        socketProvider?.socket?.send(JSON.stringify({
            type: MESSAGE_TYPES.DOWNLOAD_GAME_UPDATE,
            code: selectedGame?.code,
        }))
        setJdownloaderResult(ActionResult.INITIALIZED);
    }

    const confirmFileCheck = () => {
        socketProvider?.socket?.send(JSON.stringify({
            type: MESSAGE_TYPES.CHECK_GAME_FOR_CORRUPTION,
            code: selectedGame?.code,
        }))
        setFileCheckResult(ActionResult.INITIALIZED);
    }

    const changeFailsafeMode = (e: boolean) => {
        if (e) {
            setModalProps({ title: "Warning", message: "This feature lets you serve any game or update, even if they don't exist on the hard drive, they will still be served from the internet. This should not be enabled unless ABSOLUTELY NECESSARY, if you are done serving a customer, don't forget to disable this.", operation: OPERATION.INFO, code: "" });
            setIsOpen(true);
        }
        setFailsafe(e);
        socketProvider?.socket?.send(JSON.stringify({
            type: MESSAGE_TYPES.CHANGE_FAILSAFE_MODE,
            value: e,
        }))
    }

    return <Loading isLoading={socketProvider?.isConnected ? false : true}>
        <MyModal messageProps={modalProps} isOpen={isOpen} setIsOpen={setIsOpen} confirmAction={confirmChangingGameAutoUpdates} jdownloaderResult={jdownloadResult} setJdownloaderResult={setJdownloaderResult} downloadAction={confirmDownload} fileCheckResult={fileCheckResult} setFileCheckResult={setFileCheckResult} fileCheckAction={confirmFileCheck} />
        <ChangePendingStatusModal messageProps={modalProps} isOpen={isPendingOpen} setIsOpen={setIsPendingOpen} confirmAction={confirmChangingPendingStatus} scLink={scLink} setScLink={setScLink} jdownloaderResult={jdownloadResult} setJdownloaderResult={setJdownloaderResult} downloadAction={confirmDownload} />
        <div className='table md:mb-3'>
            <h2 className="text-lg sm:text-xl align-middle table-cell">Latest Requested Games</h2>
            <Switch.Group>
                <div className="items-center table-cell pl-7 pt-1">
                    <Switch.Label className="mr-3 font-['Kanit'] text-slate-500">Failsafe Mode</Switch.Label>
                    <Switch
                        checked={failsafe}
                        onChange={changeFailsafeMode}
                        className={`${failsafe ? 'bg-blue-600' : 'bg-gray-200'
                            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 align-middle`}
                    >
                        <span
                            className={`${failsafe ? 'translate-x-6' : 'translate-x-1'
                                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                    </Switch>
                </div>
            </Switch.Group>
        </div>
        <h3 className={`text-4xl tracking-wide font-['PsFont'] mt-3 duration-1000 transition-opacity`}>PS4:</h3>
        <h3 className={`text-lg tracking-wide font-['Montserrat'] text-slate-500 text-center my-10 italic duration-1000 transition-opacity ${requestedGames.filter((e) => e.code.startsWith('C')).length ? 'hidden' : ''}`}>No PS4 game was detected yet, start by using the PSX Proxy server.</h3>
        <div className={`flex flex-row text-center overflow-auto gap-4 py-2 my-5 md:my-3 ml-3 duration-1000 transition-opacity ${requestedGames.filter((e) => e.code.startsWith('C')).length ? '' : 'opacity-0'}`}>
            {requestedGames.map((item, i) => {
                if (item.code.startsWith('C')) {
                    return (
                        <GameCard key={i} name={item.name} version={item.version} image={item.image ? item.image : not_found} code={item.code} downloads={item?.downloads} full_game={item.full_game} auto_updates={item?.auto_updates} region={REGION_STRING[item.region]} game_found={item.game_found} addons={item?.full_game_json ? item?.full_game_json.length : 0} onClick={ChangeGameAutoUpdates} />
                    )

                }
            }).reverse()
            }
        </div>

        <h3 className={`text-4xl tracking-wide font-['PsFont'] mt-3 duration-1000 transition-opacity`}>PS5:</h3>
        <h3 className={`text-lg tracking-wide font-['Montserrat'] text-slate-500 text-center my-10 italic duration-1000 transition-opacity ${requestedGames.filter((e) => e.code.startsWith('P')).length ? 'hidden' : ''}`}>No PS5 game was detected yet, start by using the PSX Proxy server.</h3>
        <div className={`flex flex-row text-center overflow-auto gap-4 py-2 my-5 md:my-3 ml-3 duration-1000 transition-opacity ${requestedGames.filter((e) => e.code.startsWith('P')).length ? '' : 'opacity-0'}`}>
            {requestedGames.map((item, i) => {
                if (item.code.startsWith('P'))
                    return (
                        <GameCard key={i} name={item.name} version={item.version} image={item.image ? item.image : not_found} code={item.code} downloads={item?.downloads} full_game={item.full_game} auto_updates={item?.auto_updates} region={REGION_STRING[item.region]} pending={item.pending} game_found={item.game_found} addons={item?.full_game_json ? item?.full_game_json.length : 0} onClick={ChangeGameAutoUpdates} />
                    )
            }).reverse()
            }
        </div>
    </Loading>
}
