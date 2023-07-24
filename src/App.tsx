import { useState } from 'react'
import Footer from './components/Footer'
import Alert from './components/Alert'
import { SocketProvider } from './SocketContext'
import Games from './Games'
import Header from './components/Header'
import Logs from './Logs'
import Serving from './Serving'
import { Outlet } from 'react-router-dom'

export enum MESSAGE_TYPES {
  GAME = 1,
  REGISTER_PENDING,
  LOG,
  IS_JDOWNLOADER_RUNNING,
  IS_PS4_AUTOMATIC_UPDATER_RUNNING,
  APP_UPDATE,
  SET_AUTOUPDATES_GAMES_TXT_PATH,
  GAME_ICON,
  GET_ALL_GAMES,
  GET_LOGS,
  NOT_IMPLEMENTED,
  ADD_GAME_TO_AUTO_UPDATES,
  SET_AUTOUPDATES_GAMES_TXT_PATH_CONFIRM,
  PROXY_IP_ADDRESS,
  REMOVE_GAME_FROM_AUTO_UPDATES,
  CHANGE_FAILSAFE_MODE,
  DOWNLOAD_GAME_UPDATE,
  CHECK_GAME_FOR_CORRUPTION,
}

function App() {
  return (
    <div className="App">
      {/* <div className="hidden border-lime-700 : 'violet'}-700"></div> */}
      <div className="md:container md:mx-auto px-4 flex flex-col min-h-screen">
        <SocketProvider>
          <Header />
          <Outlet />
          <Footer />
        </SocketProvider>
      </div>

    </div>
  )
}

export default App
