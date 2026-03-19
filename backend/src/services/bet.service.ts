import { GAME_ID, GAME_STATE, OperationType, SEND_ACTIONS } from '../constants/enums';
import { DBInterface } from 'dbSrc/db.service';
import { BetType, BetTypeForServices } from '../constants/types';
import { RoundService } from './round.service';
import { ERROR_TYPES } from '../constants/errortypes';
import { ErrorSender } from '../utils/ErrorSender';
import { connectedSockets, io } from '../socket';
import { Game } from './game.service';
import axios from 'axios';
import GamesTransactions from 'models/gamesTransactions';
import Players from 'models/players';
import { log } from 'console';

export class BetServices {
	public static betsArray: BetTypeForServices[] = [];

	public static onBets = async (bets: BetType) => {
		const gameState = Game.gameState;
		const hasBet = this.betsArray.find(
			(item) => item.index === bets.index && bets.playerId === item.playerId,
		);

		const soketId = connectedSockets.get(String(bets.playerId));

		if (gameState !== GAME_STATE.WaitingForBets || hasBet) {
			ErrorSender.sendError(ERROR_TYPES.InvalidBetAmount, soketId);
			return;
		}

		const user = await DBInterface.get(Players, {
			conditions: { id: String(bets.playerId) },
		});

		if (!user) {
			return;
		}

		const totalBetAmount = this.betsArray.reduce((amount, item) => {
			if (bets.playerId === item.playerId) {
				return amount + item.amount;
			}
			return amount;
		}, 0);

		if (!!user?.balance && (user?.balance < bets.amount || user?.balance < totalBetAmount)) {
			ErrorSender.sendError(ERROR_TYPES.LowBalance, soketId);
			return;
		}

		this.betsArray.push({
			...bets,
			balance: user?.balance,
			token: bets.token,
			currencyId: user.currencyId,
		});

		const userBet = this.betsArray.map((item) => {
			if (bets.playerId === item.playerId) {
				return { ...item, balance: user?.balance - (totalBetAmount + bets.amount) };
			}
			return item;
		});

		this.betsArray = userBet;

		io.emit(SEND_ACTIONS.Bets, {
			bets: this.betsArray,
		});
	};

	public static getPlayersBets = async (playerId: string) => {
		const playerBets = await this.getPlayersBetsPrivate(playerId);

		return playerBets;
	};

	public static autoCashOutBets = async (multi: number) => {
		if (this.betsArray.length === 0) return;

		for (let i = 0; i < this.betsArray.length; i++) {
			const bet = this.betsArray[i];

			if (+bet.autoCashe <= multi && !bet.win && +bet.autoCashe) {
				await this.setCashOutBets(bet.playerId, bet.index, +bet.autoCashe);
			}
		}
	};

	public static removeRoundBets = () => {
		this.betsArray = [];
	};

	public static setCashOutBets = async (playerId: number, index: number, multi: number) => {
		const bet = await this.getBet(playerId, index);

		const soketId = connectedSockets.get(String(playerId));

		if (!bet) {
			ErrorSender.sendError(ERROR_TYPES.CashOutNotAllowed, soketId);
			return;
		}

		const coff = multi.toFixed(2);
		const winAmount = +(+bet.amount * +coff).toFixed(2);
		try {
			const response = await axios.post(
				`${process.env.GATE_WAY_URL}/wallet/win`,
				{
					token: bet.sessionId,
					userId: bet.playerId,
					transactionId: bet.id,
					gameId: +process.env.GAME_ID!,
					roundId: bet.roundId,
					amount: winAmount,
				},
				{
					timeout: 1000,
				},
			);

			if (response.data.status !== 0) {
				await ErrorSender.sendError(ERROR_TYPES.CashOutNotAllowed, soketId);
				return;
			}

			await DBInterface.update(
				GamesTransactions,
				{ id: bet.id },
				{
					winAmount,
					odds: +coff,
					updatedAt: new Date(),
				},
			);
		} catch (e) {
			await ErrorSender.sendError(ERROR_TYPES.CashOutNotAllowed, soketId);
			log(e);
			return;
		}

		let playerBet: BetTypeForServices | undefined;

		const newBetsArr = [...this.betsArray].map((bet) => {
			if (String(bet.playerId) === String(playerId) && !bet.win) {
				if (bet.index === index) {
					playerBet = {
						...bet,
						win: winAmount,
						profit: coff,
						balance: (bet.balance += winAmount),
					};

					return {
						...bet,
						win: winAmount,
						profit: coff,
						balance: (bet.balance += winAmount),
					};
				}
				return { ...bet, balance: (bet.balance += winAmount) };
			}

			return bet;
		});

		this.betsArray = newBetsArr;

		await DBInterface.update(
			Players,
			{
				id: String(playerBet?.playerId),
			},
			{
				balance: playerBet?.balance,
			},
		);

		io.to(connectedSockets.get(String(playerId))!).emit(SEND_ACTIONS.WinAmount, {
			betIndex: bet.index,
			winAmount: winAmount,
		});

		io.to(connectedSockets.get(String(playerBet?.playerId))!).emit(SEND_ACTIONS.Balance, {
			balane: playerBet?.balance,
		});

		io.emit(SEND_ACTIONS.Bets, {
			bets: this.betsArray,
		});

		return playerBet;
	};

	public static cancelBets = (playerId: number, index: number) => {
		const newBetsArr = [...this.betsArray].filter(
			(bet) => bet.index !== index && +bet.playerId === +playerId,
		);

		this.betsArray = newBetsArr;
		io.emit(SEND_ACTIONS.Bets, {
			bets: this.betsArray,
		});
	};

	public static getAllBets = async () => {
		const allBets = await this.getAllBetsPrivate();

		return allBets;
	};

	public static getBet = async (playerId: number, index: number) => {
		const allBets = await this.getBetPrivate(playerId, index);
		return allBets;
	};

	public static getLeaderBoard = async () => {
		const leaderBoard = await this.getLeader();

		io.emit(SEND_ACTIONS.leaderBoard, {
			leader: leaderBoard,
		});
	};

	private static getBetPrivate = async (playerId: number, index: number) => {
		const lastRound = await RoundService.lastRound();

		const player = await DBInterface.get(Players, {
			conditions: { id: String(playerId) },
		});

		const bet = await DBInterface.get(GamesTransactions, {
			conditions: { roundId: lastRound?.id, playerId: player!.id, index: index },
		});
		return bet;
	};

	private static getAllBetsPrivate = async () => {
		const lastRound = await RoundService.lastRound();

		const allBets = await DBInterface.all(GamesTransactions, {
			conditions: { roundId: lastRound?.id },
		});

		return allBets;
	};

	private static getPlayersBetsPrivate = async (playerId: string) => {
		const playerBets = await DBInterface.all(GamesTransactions, {
			include: ['Round'],
			conditions: { playerId: playerId, gameId: +process.env.GAME_ID! },
			limit: 50,
			sort: [['id', 'DESC']],
		});
		return playerBets;
	};


	public static saveAllBets = async () => {
		const savedBets: BetTypeForServices[] = [];

		for (const bet of this.betsArray) {
			try {
				const saveBet = await this.saveBets(bet);

				const response = await axios.post(
					`${process.env.GATE_WAY_URL}/wallet/bet`,
					{
						token: bet.token,
						userId: bet.playerId,
						transactionId: saveBet.id,
						gameId: +process.env.GAME_ID!,
						roundId: bet.roundId,
						amount: bet.amount,
					},
					{
						timeout: 1000,
					},
				);

				if (response.data.status !== 0) {
					await DBInterface.update(
						GamesTransactions,
						{ id: saveBet.id },
						{ operationType: OperationType.Rollback },
					);

					const soketId = connectedSockets.get(String(bet.playerId));
					await ErrorSender.sendError(ERROR_TYPES.InvalidBetAmount, soketId);
					continue;
				}

				savedBets.push(bet);
			} catch (e) {
				await ErrorSender.sendError(ERROR_TYPES.InvalidBetAmount);
				console.error(e);
			}
		}

		this.betsArray = savedBets;

		io.emit(SEND_ACTIONS.Bets, {
			bets: this.betsArray,
		});
	};

	private static saveBets = async (bets: BetTypeForServices) => {
		const transactionData = {
			playerId: bets.playerId,
			currencyId: bets.currencyId,
			amount: bets.amount,
			clientSeed: 'adssad',
			index: bets.index,
			win: 0,
			state: 1,
			operationType: OperationType.Bet,
			sessionId: bets.token,
			referenceId: '0',
			roundId: bets.roundId,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		io.to(connectedSockets.get(String(bets?.playerId))!).emit(SEND_ACTIONS.Balance, {
			balane: bets.balance,
		});

		const transaction = await DBInterface.create(GamesTransactions, transactionData);

		return transaction;
	};

	private static getLeader = async () => {
		const playerBets = await DBInterface.all(GamesTransactions, {
			limit: 30,
			include: ['Round'],
			conditions: { gameId: +process.env.GAME_ID! },
			sort: [['winAmount', 'DESC']],
		});
		return playerBets;
	};
}
