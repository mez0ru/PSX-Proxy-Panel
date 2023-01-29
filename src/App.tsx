import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { OPERATION, MyModal } from './components/MyModal'
import GameCard from './components/GameCard'
import not_found from './assets/not_found.svg'
import Footer from './components/Footer'
import Alert from './components/Alert'
import Loading from './components/Loading'

interface Game {
  name: string;
  code: string;
  region: number;
  image?: string;
  auto_updates?: boolean;
  full_game?: boolean;
  downloads?: number;
  version: string;
  console: number;
}

const REGION_STRING = ["SA", "US", "JP"];

interface Game_From_Server {
  type: number;
  game: Game;
}

const MESSAGE_TYPES = {
  GAME: 1,
  LOG: 2,
  IS_JDOWNLOADER_RUNNING: 3,
  IS_PS4_AUTOMATIC_UPDATER_RUNNING: 4,
  APP_UPDATE: 5,
  SET_AUTOUPDATES_GAMES_TXT_PATH: 6,
  GAME_ICON: 7,
  GET_ALL_GAMES: 8,
  GET_LOGS: 9,
  NOT_IMPLEMENTED: 10,
  ADD_GAME_TO_AUTO_UPDATES: 11,
  SET_AUTOUPDATES_GAMES_TXT_PATH_CONFIRM: 12,
}

function App() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isJdownloaderRunning, setIsJdownloaderRunning] = useState(true)
  const [requestedGames, setRequestedGames] = useState([] as Game[])
  const [selectedGame, setSelectedGame] = useState({} as Game)
  const [operation, setOperation] = useState(0)
  const [isGamesPathSet, setIsGamesPathSet] = useState(true)
  const [connected, setConnected] = useState(false)
  const [path, setPath] = useState('')
  const [passcode, setPasscode] = useState('')
  const [socket, setSocket] = useState<WebSocket>()

  useEffect(() => {
    function connect() {
      const sock = new WebSocket(`ws://${window.location.hostname}:8089`);

      sock.addEventListener('open', (event) => {
        setConnected(true);
        sock.send(JSON.stringify({
          type: MESSAGE_TYPES.GET_ALL_GAMES
        }));
      });

      sock.addEventListener('close', (event) => {
        setConnected(false);
        console.log('disconnected, will reconnect after 1s...');
        setTimeout(connect, 1000)
      });

      sock.addEventListener('message', (event) => {
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
                setTitle(`Info!`);
                setMessage(`Congratulations, the game is added successfully!`);
                return newArray
              })
            } else {
              setTitle(`Error!`);
              setMessage(data.message);
            }

            break;
          case MESSAGE_TYPES.SET_AUTOUPDATES_GAMES_TXT_PATH: {
            setPath(data.value)
          }
            break;
          case MESSAGE_TYPES.SET_AUTOUPDATES_GAMES_TXT_PATH_CONFIRM: {
            if (data.value) {
              setOperation(OPERATION.INFO);
              setTitle("Info")
              setMessage("Operation completed successfully!");
              setIsGamesPathSet(true)
            } else {
              setOperation(OPERATION.INFO);
              setTitle("Error")
              setMessage(data.message);
            }
          }
            break;
          default:
            break;
        }
      });

      setSocket(sock);
    }
    connect();
    return () => {
      socket?.close();
    }

  }, []);


  const FooterOnClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    switch (event.currentTarget.id) {
      case 'about':
        setTitle(`About`);
        setMessage(`This is the control panel of psx proxy server, changes are immediate, meaning you don't have to refresh the page to observe changes, new games will automatically pop up here, including any changes.`);
        setOperation(OPERATION.INFO);
        break;
      case 'licensing':
        setTitle(`Licensing`);
        setMessage(`This software should be used as is, with the permission of the owner. All rights reserved.\n
        Editing of assets, source code, reverse engineering are all prohibited under this license.\n
        Contact the creator for any furthur inqueries "mez0ru@gmail.com".`);
        setOperation(OPERATION.INFO);
        break;
      case 'set-games':
        setPasscode('')
        setTitle(`Change games.txt path`);
        setMessage(`YOU MUST NOT CHANGE THE PATH, THIS IS THE ADMINISTRATOR'S JOB.`);
        setOperation(OPERATION.INPUT);
        socket?.send(JSON.stringify({ type: MESSAGE_TYPES.SET_AUTOUPDATES_GAMES_TXT_PATH }))
        break;

    }

    setIsOpen(true);
  }

  const addRequestedGame = (code: string, title: string) => {
    const game = requestedGames.find((e) => e.code === code) || {} as Game;
    setOperation(OPERATION.ADD_GAME_TO_AUTO_UPDATES);

    if (!isGamesPathSet) {
      setOperation(OPERATION.INFO);
      setTitle(`Warning`);
      setMessage(`games.txt path is not set, please update it first before you can add this game to the auto updates list.`);
    }
    else if (game.auto_updates) {
      setTitle(`Info`);
      setMessage(`The game "${title}" is already added to auto update list.`);
      setOperation(OPERATION.ADD_GAME_TO_AUTO_UPDATES);
    } else {
      setTitle(`Confirmation"`);
      setMessage(`Are you sure you want to add ${title} to auto update list?`);
      setOperation(OPERATION.ADD_GAME_TO_AUTO_UPDATES);
    }

    setSelectedGame(game)
    setIsOpen(true)
  }

  const confirmAddingGameToAutoUpdates = () => {
    socket?.send(JSON.stringify({
      type: MESSAGE_TYPES.ADD_GAME_TO_AUTO_UPDATES,
      game: selectedGame,
    }))
  }

  const confirmGamesPath = () => {
    socket?.send(JSON.stringify({
      type: MESSAGE_TYPES.SET_AUTOUPDATES_GAMES_TXT_PATH_CONFIRM,
      passcode, value: path,
    }))
  }

  return (
    <div className="App">
      {/* <div className="hidden border-lime-700 : 'violet'}-700"></div> */}
      <div className="md:container md:mx-auto px-4 flex flex-col min-h-screen">
        <header className="mt-5">
          <div className="table mb-7">
            <h1 className="text-2xl sm:text-3xl md:text-5xl table-cell font-['Montserrat']">PSX Proxy Application</h1><span className="text-sm md:text-base align-middle table-cell pl-3 text-slate-400 font-['Kanit'] tracking-wide">Version 2.0.0 Beta</span>
          </div>
          {!isJdownloaderRunning && <Alert message="JDownloader is not running!" />}
          {!isGamesPathSet && <Alert level={4} message="games.txt path is not set, contact the person in charge to update it ASAP." />}
        </header>

        <section className={connected ? '' : 'm-auto'}>
          {connected ?
            <>
              <h2 className="text-lg sm:text-xl md:my-3">Requested Games</h2>
              <h3 className={`text-lg tracking-wide font-['Montserrat'] text-slate-500 text-center my-10 italic duration-500 transition-opacity ${requestedGames.length ? 'hidden' : ''}`}>Fresh! nothing to show here...<br />Start by using the PSX Proxy server.</h3>
              <div className={`grid grid-cols-8c text-center gap-4 my-5 md:my-8 ml-3 duration-500 transition-opacity ${requestedGames.length ? '' : 'opacity-0'}`}>
                {requestedGames.map((item, i) => (
                  <GameCard key={i} name={item.name} version={item.version} image={item.image ? item.image : not_found} code={item.code} downloads={item?.downloads} full_game={item.full_game} auto_updates={item?.auto_updates} region={REGION_STRING[item.region]} onClick={addRequestedGame} />
                ))}
              </div>
            </> : <Loading />
          }

        </section>
        <Footer marginfull={connected} onClick={FooterOnClick} />
      </div>
      <MyModal title={title} message={message} isOpen={isOpen} setIsOpen={setIsOpen} confirmAction={operation === OPERATION.INPUT ? confirmGamesPath : confirmAddingGameToAutoUpdates} isGameAdded={selectedGame.auto_updates || false} operation={operation} passcode={passcode} setPasscode={setPasscode} path={path} setPath={setPath} />
    </div>
  )
}

export default App
