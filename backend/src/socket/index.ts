import { Server } from 'socket.io';
import { onConnection } from './handlers';
import { Game } from '../services/game.service';
import { GET_ACTIONS, SEND_ACTIONS } from '../constants/enums';
import { BetType } from '../constants/types';
import { PlayerServices } from '../services/user.service';

export let io: Server;

export const connectedSockets = new Map<string, string>();

export const initSocket = (server: any) => {
	io = new Server(server, {
		cors: { origin: process.env.VITE_FRONT_URL },
		path: '/api/socket.io',
	});

	const game = new Game();

	game.startBettingTimer();

	io.on('connection', (socket) => {
		socket.on(GET_ACTIONS.CashOut, (data: BetType) => {
			const cashOut = game.cashOut(data.playerId, data.index);
			io.to(socket.id).emit(`${SEND_ACTIONS.CashOutIndex}${data.index}`, {
				success: !!cashOut,
			});
		});

		onConnection(io, socket, connectedSockets);

		socket.on('disconnect', () => {
			for (const [playerId, id] of connectedSockets.entries()) {
				if (id === socket.id) {
					connectedSockets.delete(playerId);
					break;
				}
			}
			PlayerServices.logoutInGame(socket.id);
		});
	});

	return io;
};
