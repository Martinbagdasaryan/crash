import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IError } from './types';

const initialState: IError = {
	messages: '',
	code: 0,
};

export const errorSlice = createSlice({
	name: 'error',
	initialState,
	reducers: {
		setError: (_, action: PayloadAction<IError>) => {
			return action.payload;
		},
	},
});

export const { setError } = errorSlice.actions;
