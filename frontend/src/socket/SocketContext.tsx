import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { socketUrl } from '../api/connections';
import { SEND_ACTIONS } from '../api/connnectionEnum';
import { useUrlParams } from '../hooks/useUrlParams';
import { setIsSocketConnected } from '../redux/selects/settings';
import { useDispatch } from 'react-redux';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const dispatch = useDispatch();
	const { gameId, token, playerId } = useUrlParams();

	useEffect(() => {
		if (!socketUrl) return;

		const s = io(socketUrl, { path: '/api/socket.io' });

		const onConnect = () => {
			console.log('Connected', s.id);
			dispatch(setIsSocketConnected(true));

			const t = setTimeout(() => {
				s.emit(SEND_ACTIONS.Launch, { gameId, token, playerId });
			}, 100);

			s.once('disconnect', () => clearTimeout(t));
		};

		const onDisconnect = () => {
			console.log('Disconnected');
			dispatch(setIsSocketConnected(false));
		};

		s.on('connect', onConnect);
		s.on('disconnect', onDisconnect);

		setSocket(s);

		return () => {
			s.off('connect', onConnect);
			s.off('disconnect', onDisconnect);
			s.disconnect();
		};
	}, [socketUrl, gameId, token, playerId, dispatch]);

	return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
