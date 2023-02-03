import { useState } from 'react'
import Footer from './components/Footer'
import Alert from './components/Alert'
import { SocketProvider } from './SocketContext'
import Games from './Games'
import Header from './components/Header'
import Logs from './Logs'

export const MESSAGE_TYPES = {
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
  PROXY_IP_ADDRESS: 13,
  REMOVE_GAME_FROM_AUTO_UPDATES: 14,
}

function App() {
  return (
    <div className="App">
      {/* <div className="hidden border-lime-700 : 'violet'}-700"></div> */}
      <div className="md:container md:mx-auto px-4 flex flex-col min-h-screen">
        <SocketProvider>
          <Header />
          <Games />
          {/* <Logs /> */}
          <Footer />
        </SocketProvider>
      </div>

    </div>
  )
}

export default App
