import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IBetInfo {
	createdAt: Date;
	odds: number;
}

interface ILader {
	leaderBard: IBetInfo[];
}

const initialState: ILader = {
	leaderBard: [],
};

export const leaderSlice = createSlice({
	name: 'leader',
	initialState,
	reducers: {
		setLaderBard: (state, action: PayloadAction<IBetInfo[]>) => {
			state.leaderBard = action.payload;
		},
	},
});

export const { setLaderBard } = leaderSlice.actions;
