import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	IProvablyFair,
	KEYBORD_TYPE,
	POPUP_TYPE,
	SendWindowInfo,
	Settings,
	WindowInfo,
} from './types';

const initialState: Settings = {
	isMobileMenu: false,
	isMenuOpen: false,
	isMobile: false,
	isLandscept: false,
	isKeybordOpen: false,
	isSocketConnected: false,
	musicVolume: 0.05,
	gameVolume: 0.05,
	soundVolume: 0.05,
	overall: 1,
	popupType: null,
	popupIndex: null,
	windowInfo: [
		{
			index: 0,
			amount: 0,
			type: KEYBORD_TYPE.Amount,
			cashOut: 0,
			isKeybordOpen: false,
			isAutoBetCount: null,
			winAmount: 0,
			isBettingRoundId: null
		},
		{
			index: 1,
			amount: 0,
			type: KEYBORD_TYPE.Amount,
			cashOut: 0,
			isKeybordOpen: false,
			isAutoBetCount: null,
			winAmount: 0,
			isBettingRoundId: null
		},
	],
	provablyFair: {
		playerSeed: '91d58cc8ff751309baa20078b46f43ec',
		serverHash: 'a5dc221dcc5302e4dfcf9ca25bd46f205312ea6b445d75fbe18b03bb7036d0a1',
	},
};

export const settingsSlice = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		setIsMobileMenu: (state, action: PayloadAction<boolean>) => {
			state.isMobileMenu = action.payload;
		},
		setIsMenuOpen: (state, action: PayloadAction<boolean>) => {
			state.isMenuOpen = action.payload;
		},
		setisKeybordOpen: (state, action: PayloadAction<boolean>) => {
			state.isKeybordOpen = action.payload;
		},
		setWindowInfo: (state, action: PayloadAction<SendWindowInfo>) => {
			const { index, amount, isKeybordOpen, type, cashOut, isAutoBetCount, isBettingRoundId } = action.payload;
			const info = state.windowInfo[index];

			state.windowInfo[index] = {
				index,
				amount: amount ?? info.amount,
				isKeybordOpen,
				type,
				cashOut: cashOut ?? info.cashOut,
				isAutoBetCount: isAutoBetCount === undefined ? info.isAutoBetCount : isAutoBetCount,
				winAmount: 0,
				isBettingRoundId: isBettingRoundId ?? info.isBettingRoundId
			};
		},

		setWindowInfoAmount: (state, action: PayloadAction<number>) => {
			const updatedWindowInfo: WindowInfo[] = [...state.windowInfo].map((item) => {
				return { ...item, amount: action.payload };
			});

			state.windowInfo = updatedWindowInfo;
		},

		setWindowInfoWinAmount: (
			state,
			action: PayloadAction<{ index: number; winAmount: number }>,
		) => {
			const { index, winAmount } = action.payload;
			[...state.windowInfo][index].winAmount = winAmount;
		},
		setIsSocketConnected: (state, action: PayloadAction<boolean>) => {
			state.isSocketConnected = action.payload;
		},
		setIsMobile: (state, action: PayloadAction<boolean>) => {
			state.isMobile = action.payload;
		},
		setIsLandscept: (state, action: PayloadAction<boolean>) => {
			state.isLandscept = action.payload;
		},
		setPopupType: (state, action: PayloadAction<POPUP_TYPE | null>) => {
			state.popupType = action.payload;
		},
		setPopupIndex: (state, action: PayloadAction<number | null>) => {
			state.popupIndex = action.payload;
		},
		setProvablyFair: (state, action: PayloadAction<IProvablyFair>) => {
			state.provablyFair = action.payload;
		},
		setMusicVolume: (state, action: PayloadAction<number>) => {
			state.musicVolume = action.payload;
		},
		setGameVolume: (state, action: PayloadAction<number>) => {
			state.gameVolume = action.payload;
		},
		setOverallState: (state, action: PayloadAction<number>) => {
			state.overall = action.payload;
		},
		setSoundVolume: (state, action: PayloadAction<number>) => {
			state.soundVolume = action.payload;
		},
		setIsBettingRoundId: (state,
			action: PayloadAction<{ index: number; isBettingRoundId: number | null }>,) => {
			const { index, isBettingRoundId } = action.payload;
			[...state.windowInfo][index].isBettingRoundId = isBettingRoundId;
		},
	},
});

export const {
	setIsMobileMenu,
	setIsMenuOpen,
	setisKeybordOpen,
	setWindowInfo,
	setIsSocketConnected,
	setIsMobile,
	setIsLandscept,
	setPopupType,
	setPopupIndex,
	setProvablyFair,
	setWindowInfoAmount,
	setWindowInfoWinAmount,
	setMusicVolume,
	setGameVolume,
	setSoundVolume,
	setIsBettingRoundId, 
	setOverallState
} = settingsSlice.actions;
