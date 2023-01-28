import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { OPERATION, MyModal } from './components/MyModal'
import GameCard from './components/GameCard'
import not_found from './assets/not_found.svg'
import Footer from './components/Footer'
import Alert from './components/Alert'

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

let socket: WebSocket

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

  console.log(window.location.hostname);

  useEffect(() => {
    function connect() {
      socket = new WebSocket(`ws://${window.location.hostname}:8089`);

      socket.addEventListener('open', (event) => {
        setConnected(true);
        socket.send(JSON.stringify({
          type: MESSAGE_TYPES.GET_ALL_GAMES
        }));
      });

      socket.addEventListener('close', (event) => {
        setConnected(false);
        console.log('disconnected, will reconnect after 1s...');
        setTimeout(connect, 1000)
      });

      socket.addEventListener('message', (event) => {
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
                console.log('added game')
                if (newArray.length > 29)
                  newArray.shift()
                return [...newArray, game]
              }
            })
          }
            // console.log(game)
            break;
          case MESSAGE_TYPES.IS_JDOWNLOADER_RUNNING:
            setIsJdownloaderRunning(data.value)
            console.log('jdownload haha')
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
                console.log('added game')
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
            console.log('received empty')
            setPath(data.value)
          }
            break;
          case MESSAGE_TYPES.SET_AUTOUPDATES_GAMES_TXT_PATH_CONFIRM: {
            console.log('SET_AUTOUPDATES_GAMES_TXT_PATH_CONFIRM')
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
    }
    connect();
    return () => {
      socket.close();
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
        socket.send(JSON.stringify({ type: MESSAGE_TYPES.SET_AUTOUPDATES_GAMES_TXT_PATH }))
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
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.ADD_GAME_TO_AUTO_UPDATES,
      game: selectedGame,
    }))
    console.log('sent!')
  }

  const confirmGamesPath = () => {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.SET_AUTOUPDATES_GAMES_TXT_PATH_CONFIRM,
      passcode, value: path,
    }))
    console.log('confirmGamesPath sent!')
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
            </> :
            <>
              <center role="status" className="table">
                <svg aria-hidden="true" className="table-cell inline w-7 h-7 sm:w-10 sm:h-10 mr-2 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="sr-only">Loading...</span>
                <h1 className="text-xl sm:text-4xl md:text-5xl table-cell font-['Montserrat'] align-middle table-cell">Please Wait</h1>
              </center>

            </>
          }

        </section>
        <Footer marginfull={connected} onClick={FooterOnClick} />
      </div>


      <MyModal title={title} message={message} isOpen={isOpen} setIsOpen={setIsOpen} confirmAction={operation === OPERATION.INPUT ? confirmGamesPath : confirmAddingGameToAutoUpdates} isGameAdded={selectedGame.auto_updates || false} operation={operation} passcode={passcode} setPasscode={setPasscode} path={path} setPath={setPath} />
    </div>
  )
}

export default App
