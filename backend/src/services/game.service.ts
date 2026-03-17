import crypto from 'crypto';
import { DBInterface } from 'dbSrc/db.service';
import Round from 'models/rounds';
import { GAME_STATE, SEND_ACTIONS } from '../constants/enums';
import { bettingTime, profitability } from '../utils/helpers';
import { Coeficient, PlayersSeedsArray, State } from '../constants/types';
import { RoundService } from './round.service';
import { BetServices } from './bet.service';
import { logarithm } from './math.service';
import { io } from '../socket';
import Player from 'models/players';
import PlayerSeeds from 'models/playersSeeds';

class Game {
	multi = 1.0;
	playerSeedsArray: PlayersSeedsArray[] = [];

	constructor() {
		this.playerSeedsArray = [];
	}
	// --- Вспомогательные функции ---
	static gameState = GAME_STATE.RoundStart;
	// Хэшируем строку алгоритмом SHA-256 → возвращаем hex строку
	private sha256Hex(input: string): string {
		return crypto.createHash('sha256').update(input).digest('hex');
	}

	// Генерируем HMAC-SHA256 (key = serverSeed, msg = clientSeed:nonce) → hex
	private hmacSha256Hex(key: string, msg: string): string {
		return crypto.createHmac('sha256', key).update(msg).digest('hex');
	}

	// --- Генерация serverSeed и commit ---
	public newServerSeed(): { seed: string; commit: string } {
		// Генерируем случайный 32-байтовый serverSeed (hex)
		const seed = crypto.randomBytes(32).toString('hex');

		// commit = SHA256(serverSeed), чтобы игрок мог проверить честность
		const commit = this.sha256Hex(seed);

		return { seed, commit };
	}

	public generateClientSeed(): { seed: string; commit: string } {
		// Генерируем случайный 16-байтовый clientSeed (hex)
		const seed = crypto.randomBytes(16).toString('hex');

		// commit = SHA256(clientSeed), чтобы игрок мог проверить честность
		const commit = this.sha256Hex(seed);

		return { seed, commit };
	}

	// --- Получаем случайное число r из HMAC ---
	private hexToR(hmacHex: string): number {
		// Берём первые 13 hex символов (≈ 52 бита)
		const first13 = hmacHex.slice(0, 13);

		// Переводим HEX → DEC (integer)
		const intVal = parseInt(first13, 16);

		// Нормализуем: [0..1), делим на 2^52
		const r = intVal / Math.pow(2, 52);

		return r;
	}

	// --- Преобразование r в множитель (Odds) ---
	private computeMultiplierFromR(r: number, houseEdge = 0.0): number {
		if (r >= 1) r = 0.999999999999; // защита от деления на 0

		// Формула: 1 / (1 - r)
		let mult = 1 / (1 - r);

		// Учитываем комиссию казино (house edge)
		mult = mult * (1 - houseEdge);

		// Округляем до сотых
		mult = Math.floor(mult * 100) / 100;

		// Минимум всегда = 1.00x
		if (mult <= 1) mult = 1.0;

		if (mult > 10000) mult = 10000;

		return mult;
	}

	// --- Полный раунд игры ---
	public async generateRound(
		serverSeed: string,
		clientSeed: string = 'client',
		nonce: number = 0,
		houseEdge: number = 0.0,
	): Promise<{ hmacHex: string; r: number; multiplier: number; msg: string }> {
		// Формируем сообщение "clientSeed:nonce"
		const msg = `${clientSeed}:${nonce}`;

		// HMAC(serverSeed, msg) → hex
		const hmacHex = this.hmacSha256Hex(serverSeed, msg);

		// HEX → DEC → нормализованное r
		const r = this.hexToR(hmacHex);

		// Вычисляем множитель (Odds)
		const multiplier = this.computeMultiplierFromR(r, houseEdge);

		// Для наглядности выводим процесс
		// this.debugHexProcess(hmacHex, r, multiplier);

		// // Плавно выводим     в консоли (эффект анимации)
		// console.log(multiplier, "multiplier");
		// await this.printMultiplier(multiplier);

		return { hmacHex, r, multiplier, msg };
	}

	// --- Визуализация мультипликатора (растёт до значения) ---
	private async printMultiplier(multiplier: number, roundId: number): Promise<void> {
		while (this.multi < multiplier) {
			const x = +this.multi;

			let base = x <= 50 ? 1000 : x <= 100 ? 2500 : 50;
			const faster = logarithm(base, x) || 0.01;

			this.multi = +(this.multi + faster);
			const coeficient: Coeficient = {
				value: +x.toFixed(2),
			};

			io.emit(SEND_ACTIONS.Coeficient, coeficient);

			await new Promise((res) => setTimeout(res, 200));
			BetServices.autoCashOutBets(x);
		}

		Game.SendGameAction(roundId, GAME_STATE.RoundEnded);

		await DBInterface.update(
			Round,
			{ id: roundId, gameId: 1 },
			{
				state: GAME_STATE.RoundEnded,
				updatedAt: new Date(),
			},
		);

		BetServices.removeRoundBets();

		io.emit(SEND_ACTIONS.Coeficient, { value: multiplier });

		await new Promise((res) => setTimeout(res, 2000));

		const rounds = await RoundService.getRounds();

		BetServices.getLeaderBoard();
		
		io.emit(SEND_ACTIONS.Rounds, rounds);
		
		const maxRounds = await RoundService.getMaxCoefficientesRound();
		io.emit(SEND_ACTIONS.HighestData, maxRounds);

		this.multi = 1.0;
		io.emit(SEND_ACTIONS.Coeficient, { value: 0 });

		this.startBettingTimer();
	}

	// // --- Отладка: показываем шаги HEX → DEC → Odds ---
	// private debugHexProcess(
	//   hmacHex: string,
	//   r: number,
	//   multiplier: number
	// ): void {
	//   const first13 = hmacHex.slice(0, 13);
	//   const intVal = parseInt(first13, 16);

	//   // DBInterface.update(Round, { serverSeed, clientSeed: this.clientSeed, roundId: this.roundId });
	//   console.log("=== Debug HEX → DEC → Odds ===");
	//   console.log("HMAC HEX:", hmacHex);
	//   console.log("First 13 HEX:", first13);
	//   console.log("HEX → DEC:", intVal);
	//   console.log("r:", r);
	//   console.log("Odds (multiplier):", multiplier);
	//   console.log("==============================");
	// }

	private async generateSeeds(): Promise<{
		serverSeed: string;
		finalClientSeed: string;
	}> {
		const { seed: serverSeed, commit } = this.newServerSeed();

		const clients = Array.from(io.sockets.sockets.keys());

		for (const id of clients) {
			const { seed: clientSeed, commit: clientCommit } = this.generateClientSeed();

			const info = {
				playerSeed: clientSeed,
				serverHash: commit,
			};

			if (this.playerSeedsArray.length < 3) {
				const user = await DBInterface.get(Player, {
					conditions: {
						socketId: id,
					},
				});

				if (user) {
					this.playerSeedsArray.push({
						clientSeed: clientSeed,
						playerId: user.id,
					});
				}
			}

			io.to(id).emit(SEND_ACTIONS.ProvablyFair, info);
		}

		if (this.playerSeedsArray.length === 0) {
			const { seed: clientSeed, commit: clientCommit } = this.generateClientSeed();
			this.playerSeedsArray.push({
				clientSeed: clientSeed,
				playerId: null,
			});
		}

		const combined = [...this.playerSeedsArray].join('');
		const finalClientSeed = crypto.createHash('sha256').update(combined).digest('hex');

		return { serverSeed, finalClientSeed };
	}

	public async startBettingTimer() {
		const { serverSeed, finalClientSeed } = await this.generateSeeds();

		const lastRound = await RoundService.nextRound();

		const roundId = lastRound?.id ?? 0;

		const round = await this.generateRound(serverSeed, finalClientSeed, roundId, profitability);

		for (let seed of this.playerSeedsArray) {
			if (!seed.playerId) continue;

			await DBInterface.create(PlayerSeeds, {
				playerId: seed.playerId,
				seed: seed.clientSeed,
				roundId: roundId,
				createdAt: new Date(),
			});
		}

		this.playerSeedsArray = [];

		const first13 = round.hmacHex.slice(0, 13);

		Game.SendGameAction(roundId, GAME_STATE.RoundStart);

		await DBInterface.create(Round, {
			gameId: 1,
			serverSeed: serverSeed,
			coeficient: round.multiplier,
			SHA256Hash: first13,
			hex: round.hmacHex,
			dec: parseInt(first13, 16),
			state: GAME_STATE.WaitingForBets,
			createdAt: new Date(),
		});

		Game.SendGameAction(roundId, GAME_STATE.WaitingForBets, bettingTime / 1000);
		setTimeout(async () => {
			await BetServices.saveAllBets();
			this.startRound();
		}, bettingTime);
	}

	private async startRound() {
		const rounds = await DBInterface.all(Round, {
			limit: 2,
			sort: [['id', 'DESC']],
		});
		const round = rounds[1];

		if (round) {
			Game.SendGameAction(round.id, GAME_STATE.WaitingInRoundStart, 0);
			await new Promise((res) => setTimeout(res, 1500));
			await DBInterface.update(
				Round,
				{ id: round.id },
				{
					state: GAME_STATE.RoundInProgress,
					updatedAt: new Date(),
				},
			);

			Game.SendGameAction(round.id, GAME_STATE.RoundInProgress, 0);

			await this.printMultiplier(round?.coeficient, round.id);
		} else {
			this.startBettingTimer();
		}
	}

	public async cashOut(playerId: number, index: number) {
		const bet = await BetServices.setCashOutBets(playerId, index, this.multi);

		if (!bet) return;

		Game.SendGameAction(bet.roundId, GAME_STATE.RoundInProgress, 0);
	}

	public async getCurrentMultiplier(roundId: number) {
		return Game.SendGameAction(roundId, GAME_STATE.RoundInProgress, 0);
	}

	public static async SendGameAction(roundId: number, roundState: GAME_STATE, bettingTime = 0) {
		const bets = BetServices.betsArray;
		this.gameState = roundState;
		const state: State = {
			roundId: roundId,
			bets: bets,
			state: roundState,
			bettingTime: bettingTime,
		};

		io.emit(SEND_ACTIONS.Game, state);
	}
}

export { Game };
