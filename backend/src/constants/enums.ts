export enum SEND_ACTIONS {
	Bets = 'bets',
	Launch = 'launch',
	Stats = 'stats',
	Game = 'game',
	Player = 'player',
	Coeficient = 'coeficient',
	Error = 'error',
	BetSuccessIndex = 'betSuccessIndex',
	CashOutIndex = 'cashoutIndex',
	MyBetsHistory = 'myBetsHIstory',
	Rounds = 'rounds',
	ProvablyFair = 'provablyFair',
	WinAmount = 'winAmount',
	leaderBoard = 'leaderBoard',
	Balance = 'balance',
	HighestData = 'highestData'
}

export enum GET_ACTIONS {
	Bets = 'bets',
	CancleBets = 'cancleBets',
	Launch = 'launch',
	gameStats = 'stats',
	Coeficient = 'coeficient',
	Game = 'game',
	CashOut = 'cashout',
	Error = 'error',
	MyBetsHistory = 'myBetsHIstory',
}

export enum GAME_STATE {
	RoundStart,
	WaitingForBets,
	RoundInProgress,
	RoundEnded,
	WaitingInRoundStart,
}

export enum OperationType {
	Bet = 0,
	Win = 1,
	Rollback = 2,
}

export enum GAME_ID {
	AviaDream = 1,
}
