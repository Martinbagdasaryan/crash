export enum ERROR_TYPES {
	PlayerNotFound = 1,
	InvalidBetAmount = 2,
	RoundNotFound = 3,
	CashOutNotAllowed = 4,
	InternalServerError = 5,
	GameNotFound = 6,
	DBError = 7,
	PartnerNotFound = 8,
	LowBalance = 9,
}

export const notFoundMessages = {
	[ERROR_TYPES.PlayerNotFound]: 'Player not found.',
	[ERROR_TYPES.RoundNotFound]: 'Round not found.',
	[ERROR_TYPES.CashOutNotAllowed]: 'Cash out not allowed.',
	[ERROR_TYPES.InvalidBetAmount]: 'Invalid bet amount.',
	[ERROR_TYPES.InternalServerError]: 'Internal server error.',
	[ERROR_TYPES.GameNotFound]: 'Game not found.',
	[ERROR_TYPES.DBError]: 'Something went wrong.',
	[ERROR_TYPES.PartnerNotFound]: 'Partner not found.',
	[ERROR_TYPES.LowBalance]: 'Insufficient balance.',
};
