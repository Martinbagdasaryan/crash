import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from './axiosInstance';

interface myBetsData {
	playerId: string;
	partnerId: string;
}

interface myBetsResponse {
	myBets: string;
}

export const myBets = createAsyncThunk<myBetsResponse, myBetsData>(
	'MyBets',
	async ({ playerId, partnerId }) => {
		try {
			const response = await axiosInstance.get('user/bets', {
				params: { playerId, partnerId },
			});
			return response.data;
		} catch (error: any) {
			throw error?.response?.data;
		}
	},
);
