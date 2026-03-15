import { Request, Response } from 'express';
import { BetServices } from '../services/bet.service';

export const myBets = async (req: Request, res: Response) => {
	const playerId = req.query.playerId as string | undefined;
	const partnerId = req.query.partnerId as string | undefined;

	if (!playerId || !partnerId) {
		return res.status(400).json({ error: 'playerId and partnerId are required' });
	}

	const bets = await BetServices.getPlayersBets(playerId);

	const formatted = bets.map((bet) => ({
		date: bet?.createdAt,
		betAmount: Number(bet?.amount),
		winAmount: Number(bet?.winAmount),
	}));

	return res.json(formatted);
};

export const authenticate = (req: Request, res: Response) => {
	const { userId, token, gameId, hash } = req.body;
	const empick = process.env;
	fetch(`https://${empick}/Authenticate`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			userId: userId,
			token: token,
			gameId: gameId,
			hash: hash,
		}),
	}).then((response) => response.json());
};

export const placeBet = (req: Request, res: Response) => {
	const { token, userId, transactionId, gameId, roundId, amount, freespinInfo, hash } = req.body;
	const empick = process.env;
	fetch(`https://${empick}/PlaceBet`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			userId,
			token,
			transactionId,
			gameId,
			roundId,
			amount,
			freespinInfo,
			hash,
		}),
	}).then((response) => response.json());
};

export const settleWin = (req: Request, res: Response) => {
	const {
		token,
		userId,
		transactionId,
		refTransactionId,
		gameId,
		roundId,
		amount,
		freespinInfo,
		hash,
	} = req.body;
	const empick = process.env;
	fetch(`https://${empick}/PlaceBet`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			token,
			userId,
			transactionId,
			refTransactionId,
			gameId,
			roundId,
			amount,
			freespinInfo,
			hash,
		}),
	}).then((response) => response.json());
};
