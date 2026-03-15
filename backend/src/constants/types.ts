import { GAME_STATE } from './enums';

export type State = {
	roundId: number;
	state: GAME_STATE;
	bets: BetType[];
	bettingTime: number;
};

export type Coeficient = {
	value: number;
};

export type BetType = Omit<BetTypeForServices, 'balance'>;

export type BetTypeForServices = {
	playerId: number;
	amount: number;
	index: number;
	sessionId: string;
	profit: string;
	odds: number;
	roundId: number;
	win?: number;
	balance: number;
	autoCashe: string;
	token: string;
	currencyId: string;
};

export type BetResult = {
	index: number;
	roundId: number;
	playerId: number | string;
	amount: number;
	odds: number;
	win: number;
	playerNick: string;
};

export type PlayersSeedsArray = {
	clientSeed: string;
	playerId: number | null;
};

export type authentication = {
	id: string;
	balance: number;
	nickName: string;
	currencyId: string;
};
