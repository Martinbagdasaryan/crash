import { GAME_STATE } from '../../utils/enums';

export interface BetData {
	id: number;
	playerId: number;
	amount: number;
	odds: number;
	status: 'pending' | 'won' | 'lost';
}

export interface Player {
	id: number;
	balance: number;
	nickName: string;
	language: string;
	currencyId: string;
	minBet: number;
	maxBet: number;
	tableName: string;
}

export interface IProvablyFair {
	playerSeed: string;
	serverHash: string;
}

export interface Settings {
	isMobileMenu: boolean;
	isMenuOpen: boolean;
	isKeybordOpen: boolean;
	isMobile: boolean;
	isLandscept: boolean;
	isSocketConnected: boolean;
	musicVolume: number;
	overall: number;
	gameVolume: number;
	soundVolume: number;
	popupIndex: null | number;
	windowInfo: WindowInfo[];
	popupType: POPUP_TYPE | null;
	provablyFair: IProvablyFair;
}

export interface Bets {
	bets: BetData[];
}

export interface WindowInfo {
	index: number;
	amount: number;
	type: KEYBORD_TYPE | null;
	cashOut: number;
	isKeybordOpen: boolean;
	isAutoBetCount: null | number;
	winAmount: number;
	isBettingRoundId: null | number
}

export interface SendWindowInfo {
	index: number;
	amount?: number;
	type: KEYBORD_TYPE | null;
	cashOut?: number;
	isKeybordOpen: boolean;
	isAutoBetCount?: null | number;
	isBettingRoundId?: null | number;
}

export interface IState {
	roundId: number;
	state: GAME_STATE;
	bets: IBets[];
	bettingTime: number;
	allBets: IBets[];
}

export interface IBets {
	index: number;
	roundId: number;
	playerId: number;
	amount: number;
	profit?: number;
	win?: number;
	playerNick?: string;
	betIsSuccess?: boolean;
}

export interface IClearBets {
	playerId: number;
	index: number;
	roundId: number;
}

export enum KEYBORD_TYPE {
	Amount,
	Cashout,
}

export enum POPUP_TYPE {
	AutoBet,
}

export interface ICoeficientValue {
	coeficient: number;
}

export interface IError {
	messages: string;
	code: number;
}
