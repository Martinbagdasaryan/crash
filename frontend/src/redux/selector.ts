import { RootState } from './selects/store';

export const selectPlayer = (state: RootState) => state.player;
export const selectSettings = (state: RootState) => state.settings;
export const selectGame = (state: RootState) => state.game;
export const selectCoeficient = (state: RootState) => state.coeficient;
export const selectError = (state: RootState) => state.error;
export const selectSeader = (state: RootState) => state.leader;
