import axios from 'axios';
import { Server, Socket } from 'socket.io';
import { GET_ACTIONS, SEND_ACTIONS } from '../constants/enums';
import { authentication, BetType, State } from '../constants/types';
import { ErrorSender } from '../utils/ErrorSender';
import { ERROR_TYPES } from '../constants/errortypes';
import { TableService } from '../services/table.service';
import { RoundService } from '../services/round.service';
import { BetServices } from '../services/bet.service';
import { DBInterface } from 'dbSrc/db.service';
import Currencies from 'models/currencies';
import { ceilTo } from '../utils/helpers';

export const onConnection = async (
	io: Server,
	socket: Socket,
	connectedSockets: Map<string, string>,
) => {
	socket.on(GET_ACTIONS.Bets, (data: BetType) => {
		const bets = BetServices.onBets(data);

		io.to(socket.id).emit(`${SEND_ACTIONS.BetSuccessIndex}${data.index}`, {
			success: !!bets,
		});
	});

	socket.on(GET_ACTIONS.CancleBets, (data: { playerId: number; boxIndex: number }) => {
		BetServices.cancelBets(data.playerId, data.boxIndex);
	});

	socket.on(SEND_ACTIONS.Stats, (data: any) => {
		io.emit(SEND_ACTIONS.Stats, data);
	});

	socket.on(
		GET_ACTIONS.Launch,
		async (data: { playerId: string; gameId: string; token: string }) => {
			if (!data.playerId) {
				ErrorSender.sendError(ERROR_TYPES.PlayerNotFound, socket.id);
				return;
			}

			let playerInfo: { data: authentication } | null = null;
			try {
				playerInfo = await axios.post(
					`${process.env.GATE_WAY_URL}/games/authentication?token=${data.token}&gameId=${data.gameId}&userId=${data.playerId}`,
				);
			} catch (e) {
				console.log(e);
			}

			if (!playerInfo) {
				ErrorSender.sendError(ERROR_TYPES.PlayerNotFound, socket.id);
				return;
			}

			const game = await TableService.game(data.gameId);

			if (!game) {
				ErrorSender.sendError(ERROR_TYPES.GameNotFound, socket.id);
				return;
			}

			const currency = await DBInterface.get(Currencies, {
				conditions: { id: playerInfo.data.currencyId },
			});

			const rate = currency?.rate || 1;
			

			const playerData = {
				id: playerInfo.data.id,
				balance: playerInfo.data.balance,
				nickName: playerInfo.data.nickName,
				currencyId: playerInfo.data.currencyId,
				minBet: ceilTo(game.limitMin / rate, 2),
				maxBet: ceilTo(game.limitMax / rate, 2),
				tableName: game.name,
			};

			const rounds = await RoundService.getRounds();
			const currentRound = await RoundService.lastRound();

			const state: State = {
				roundId: currentRound!.id,
				state: currentRound!.state,
				bets: BetServices.betsArray,
				bettingTime: 0,
			};

			io.to(socket.id).emit(SEND_ACTIONS.Game, state);
			connectedSockets.set(data.playerId, socket.id);

			io.to(socket.id).emit(SEND_ACTIONS.Player, playerData);

			BetServices.getLeaderBoard();

			io.to(socket.id).emit(SEND_ACTIONS.Rounds, rounds);
		},
	);

	socket.on(GET_ACTIONS.MyBetsHistory, async ({ playerId }: { playerId: string }) => {
		const myBets = await BetServices.getPlayersBets(playerId);

		if (!myBets) return;

		myBets.map((bet) => {
			return {
				date: bet?.createdAt,
				betAmount: Number(bet?.amount),
				multiplier: bet?.odds,
				winAmount: Number(bet?.winAmount),
			};
		});

		io.to(socket.id).emit(SEND_ACTIONS.MyBetsHistory, myBets);
	});
};
