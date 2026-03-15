export enum OperationType {
	Bet = 0,
	Win = 1,
	Rollback = 2,
}

export enum ERROR_TYPES {
	PlayerNotFound = 1,
	InvalidBetAmount = 2,
	RoundNotFound = 3,
	CashOutNotAllowed = 4,
	InternalServerError = 5,
	GameNotFound = 6,
	DbErrors = 7,
	PartnerNotFound = 8,
	LowBalance = 9,
}