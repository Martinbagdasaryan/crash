import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...args: ClassValue[]) {
	return twMerge(clsx(args));
}

const NumberFormat = (num: number | string): string => {
	return new Intl.NumberFormat('ru').format(Number(num));
};

export const NumberFormatter = (limit: number): string => {
	if (limit > 999999) {
		return `${NumberFormat(limit / 1000000)}M`;
	} else if (limit > 999) {
		return `${NumberFormat(limit / 1000)}K`;
	} else {
		return NumberFormat(limit);
	}
};

export const cutAmount = (amount: number, cutter: number): number => {
	return Math.floor(+(amount / cutter).toFixed(0));
};

export const dataFormater = (date: Date) => {
	const d = new Date(date);
	const day = String(d.getDate()).padStart(2, '0');
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const year = d.getFullYear();
	const hours = String(d.getHours()).padStart(2, '0');
	const minutes = String(d.getMinutes()).padStart(2, '0');
	return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const maskNumber = (num: number | string, visibleStart = 1, visibleEnd = 1): string => {
	const str = String(num);
	if (str.length <= visibleStart + visibleEnd) return str;
	const hidden = '*'.repeat(str.length - visibleStart - visibleEnd);
	return str.slice(0, visibleStart) + hidden + str.slice(-visibleEnd);
};

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
	[ERROR_TYPES.LowBalance]: 'Insufficient balance.',
	// [key: number]: "Unknown error.";
};
