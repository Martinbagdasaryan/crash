import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IBets, IState, Player } from './types';
import { GAME_STATE } from '../../utils/enums';

const initialState: IState = {
	roundId: 0,
	state: GAME_STATE.RoundStart,
	bets: [],
	bettingTime: 0,
	allBets: [],
};

export const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		setStateGame: (_, action: PayloadAction<IState>) => {
			const { roundId, state, bets, bettingTime, allBets } = action.payload;

			return { roundId, state, bets, bettingTime, allBets: allBets };
		},
		setAddBets: (state, action: PayloadAction<IBets>) => {
			state.bets.push(action.payload);
		},
		setAddWinAmount: (state, action: PayloadAction<{ index: number; winAmount: number }>) => {
			const { index, winAmount } = action.payload;

			const bet = state.bets.find((bet) => bet.index === index);
			if (bet) {
				bet.win = winAmount;
			}
		},
		setClearBets: (state, action: PayloadAction<number>) => {
			state.bets = state.bets.filter((bet) => bet.index !== action.payload);
		},
		setAllBets: (state, action: PayloadAction<IBets[]>) => {
			state.allBets = action.payload;
		},
	},
});

export const { setStateGame, setAddBets, setClearBets, setAllBets, setAddWinAmount } =
	gameSlice.actions;
