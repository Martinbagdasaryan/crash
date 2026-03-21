import React, { useEffect, useRef, memo } from 'react';
import { useSelector } from 'react-redux';
import { selectGame, selectSettings } from '../../redux/selector';
import { GAME_STATE } from '../../utils/enums';
import { GameCycleController } from '../../libs/controllers';

const Canvas: React.FC = () => {
	const GCControllerRef = useRef<GameCycleController | null>(null);
	const game = useSelector(selectGame);
	const { musicVolume, gameVolume, overall } = useSelector(selectSettings);

	useEffect(() => {
		const gcc = new GameCycleController(musicVolume, gameVolume, overall);
		GCControllerRef.current = gcc;

		return () => {
			gcc.stopSound();
			GCControllerRef.current = null;
		};
	}, []);

	useEffect(() => {
		const pointerHandler = () => {
			if (game.state !== GAME_STATE.RoundInProgress) return;

			GCControllerRef.current?.startGameSound.play();
		};

		const mute = () => GCControllerRef.current?.mute();
		const unmute = () => GCControllerRef.current?.unMute(gameVolume, overall);

		window.addEventListener('click', pointerHandler);
		window.addEventListener('blur', mute);
		window.addEventListener('focus', unmute);

		return () => {
			window.removeEventListener('click', pointerHandler);
			window.removeEventListener('blur', mute);
			window.removeEventListener('focus', unmute);
		};
	}, [game.state, gameVolume, overall]);

	useEffect(() => {
		const s = game.state;
		const gcc = GCControllerRef.current;
		if (!gcc) return;

		if (s === GAME_STATE.WaitingForBets) {
			gcc.bettingTime();
		} else if (s === GAME_STATE.RoundInProgress) {
			gcc.startGame();
		} else if (s === GAME_STATE.RoundEnded) {
			gcc.crush();
		}
	}, [game.state]);

	useEffect(() => {
		const gcc = GCControllerRef.current;
		if (!gcc) return;
		gcc.setMusicVolume(musicVolume, overall);
		gcc.setGameVolume(gameVolume, overall);
	}, [musicVolume, gameVolume, overall]);

	return null;
};

export default memo(Canvas);