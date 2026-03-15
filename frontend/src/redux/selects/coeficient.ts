import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IBets, ICoeficientValue, IState } from './types';

const initialState: ICoeficientValue = {
	coeficient: 0,
};

export const coeficientSlice = createSlice({
	name: 'coeficient',
	initialState,
	reducers: {
		setCoeficient: (state, action: PayloadAction<ICoeficientValue>) => {
			state.coeficient = action.payload.coeficient;
		},
	},
});

export const { setCoeficient } = coeficientSlice.actions;
