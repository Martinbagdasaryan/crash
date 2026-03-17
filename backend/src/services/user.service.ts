import { randomInt } from 'crypto';
import Player from 'models/players';
import { DBInterface } from 'dbSrc/db.service';
import { SEND_ACTIONS } from '../constants/enums';
import { State } from '../constants/types';
import { RoundService } from './round.service';
import { BetServices } from './bet.service';
import { io } from '../socket';
import { ErrorSender } from '../utils/ErrorSender';
import { ERROR_TYPES } from '../constants/errortypes';

export class PlayerServices {
	static getUser = async (id: string) => {
		const user = await this.getUserPrivate(id);
		return user;
	};

	static checkUser = async (playerId: string, socketId: string) => {
		const user = await PlayerServices.getUser(
			playerId,
			// balance,
		);

		if (!user) {
			return;
		}

		await DBInterface.update(
			Player,
			{
				id: user.id,
			},
			{
				socketId: socketId,
			},
		);

		const currentRound = await RoundService.lastRound();
		const bets = currentRound ? BetServices.betsArray : [];

		const state: State = {
			roundId: currentRound!.id,
			state: currentRound!.state,
			bets: bets,
			bettingTime: 0,
		};

		io.emit(SEND_ACTIONS.Game, state);

		return user;
	};

	static logoutInGame = async (socketId: string) => {
		await this.logout(socketId);
	};

	private static getUserPrivate = async (id: string) => {
		const user = await DBInterface.get(Player, {
			conditions: { id: id },
		});
		return user;
	};

	private static getOrCreateUser = async (
		partnerPlayerId: string,
		partnerId: string,
		socketId: string,
	) => {
		// const [user, isCreated] = await DBInterface.getOrCreate(
		// 	Player,
		// 	{ partnerPlayerId: partnerPlayerId, partnerId: partnerId },
		// 	{
		// 		nickName: `player-${randomInt(999999)}`,
		// 		partnerId: partnerId,
		// 		partnerPlayerId: partnerPlayerId,
		// 		socketId: socketId,
		// 		balance: balance,
		// 	},
		// );
		// if (!isCreated) {
		// 	await DBInterface.update(
		// 		Player,
		// 		{
		// 			id: user.id,
		// 		},
		// 		{
		// 			socketId: socketId,
		// 			balance: balance,
		// 		},
		// 	);
		// }
		// return user;
	};

	private static logout = async (socketId: string) => {
		const user = await DBInterface.update(
			Player,
			{
				socketId: socketId,
			},
			{
				socketId: undefined,
			},
		);

		return user;
	};
}
