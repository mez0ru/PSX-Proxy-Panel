import { createContext } from 'react';

export const SocketContext = createContext<WebSocket | undefined>(undefined);