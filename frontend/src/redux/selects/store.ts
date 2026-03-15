import { configureStore } from '@reduxjs/toolkit';
import { playerSlice } from './players';
import { settingsSlice } from './settings';
import { gameSlice } from './game';
import { coeficientSlice } from './coeficient';
import { errorSlice } from './error';
import { leaderSlice } from './leade';

export const store = configureStore({
	reducer: {
		player: playerSlice.reducer,
		settings: settingsSlice.reducer,
		game: gameSlice.reducer,
		coeficient: coeficientSlice.reducer,
		error: errorSlice.reducer,
		leader: leaderSlice.reducer,
	},
});

export type AppStore = typeof store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
