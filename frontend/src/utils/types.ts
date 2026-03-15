import { GAME_STATE } from './enums';

export interface IState {
	roundId: number;
	coeficient: number;
	state: GAME_STATE;
	bets: IBetResult[];
	bettingTime: number;
}

export interface ICoeficient {
	value: number;
}

export interface IBetResult {
	index: number;
	roundId: number;
	playerId: number;
	amount: number;
	// profit: number;
	win: number;
	playerNick: string;
}
