import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Player } from './types';

const initialState: Player = {
	id: 0,
	balance: 0,
	nickName: '',
	language: 'en',
	currencyId: 'AMD',
	minBet: 10,
	maxBet: 1500,
	tableName: '',
};

export const playerSlice = createSlice({
	name: 'player',
	initialState,
	reducers: {
		setPlayerData: (_, action: PayloadAction<Player>) => {
			return action.payload;
		},
		setBalance: (state, action: PayloadAction<number>) => {
			state.balance = action.payload;
		},
		setBalanceCalc: (state, action: PayloadAction<number>) => {
			state.balance -= action.payload;
		},
		setPlayerNickName: (state, action: PayloadAction<Player['nickName']>) => {
			state.nickName = action.payload;
		},
	},
});

export const { setPlayerData, setBalance, setPlayerNickName, setBalanceCalc } = playerSlice.actions;
