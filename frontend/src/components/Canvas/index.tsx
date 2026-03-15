import React, { useEffect, useRef, memo } from 'react';
import { init } from '../../libs/gamelib';
import { useSelector } from 'react-redux';
import { selectCoeficient, selectGame, selectSettings } from '../../redux/selector';
import { GAME_STATE } from '../../utils/enums';
import { GameCycleController } from '../../libs/controllers';

const Canvas: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const GCControllerRef = useRef<GameCycleController | null>(null);
	const rafIdRef = useRef<number | null>(null);
	// const coef = useSelector(selectCoeficient).coeficient;
	const game = useSelector(selectGame);
	const { musicVolume, gameVolume, overall } = useSelector(selectSettings);

	// const setCanvasSize = (canvas: HTMLCanvasElement, ctx?: CanvasRenderingContext2D) => {
	// 	const dpr = window.devicePixelRatio || 1;
	// 	canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
	// 	canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
	// 	ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
	// };

	// useEffect(() => {
	// 	if (!canvasRef.current) return;
	// 	const canvas = canvasRef.current;
	// 	const ctx = init(canvas);

	// 	setCanvasSize(canvas, ctx);

	// 	const gcc = new GameCycleController(musicVolume, gameVolume, overall);
	// 	GCControllerRef.current = gcc;

	// 	const pointerHandler = () => {
	// 		if (game.state !== GAME_STATE.RoundInProgress) return;
	// 		gcc.startGameSound.play();
	// 	};
	// 	window.addEventListener('pointerdown', pointerHandler);

	// 	const resizeHandler = () => {
	// 		setCanvasSize(canvas, ctx);
	// 		gcc.setSize();
	// 	};

	// 	window.addEventListener('resize', resizeHandler);

	// 	let lastTime = performance.now();

	// 	const animate = (time: number) => {
	// 		if (!ctx || !canvasRef.current) {
	// 			rafIdRef.current = requestAnimationFrame(animate);
	// 			return;
	// 		}
	// 		let deltaSeconds = time - lastTime;
	// 		lastTime = time;
	// 		if (deltaSeconds > 50) deltaSeconds = 50;
	// 		ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
	// 		gcc?.drawDelta(deltaSeconds);
	// 		rafIdRef.current = requestAnimationFrame(animate);
	// 	};

	// 	rafIdRef.current = requestAnimationFrame(animate);

	// 	const mute = () => GCControllerRef.current?.mute();
	// 	const unmute = () => GCControllerRef.current?.unMute(gameVolume, overall);

	// 	window.addEventListener('blur', mute);
	// 	window.addEventListener('focus', unmute);

	// 	return () => {
	// 		if (rafIdRef.current) {
	// 			cancelAnimationFrame(rafIdRef.current);
	// 			rafIdRef.current = null;
	// 		}
	// 		window.removeEventListener('blur', mute);
	// 		window.removeEventListener('focus', unmute);
	// 		window.removeEventListener('pointerdown', pointerHandler as EventListener);
	// 		window.removeEventListener('resize', resizeHandler as EventListener);
	// 		gcc.stopSound();
	// 		GCControllerRef.current = null;
	// 	};
	// }, []);

	// useEffect(() => {
	// 	const s = game.state;
	// 	const gcc = GCControllerRef.current;
	// 	if (!gcc) return;
	// 	if (s === GAME_STATE.WaitingForBets) {
	// 		gcc.bettingTime();
	// 	} else if (s === GAME_STATE.RoundInProgress) {
	// 		gcc.startGame();
	// 	} else if (s === GAME_STATE.RoundEnded) {
	// 		gcc.crush();
	// 	}
	// 	if (game.state !== GAME_STATE.RoundEnded) {
	// 		const bets = game.bets || [];
	// 		gcc.airplane.cachedOut = bets.length > 0 && bets.every((b) => !!b.win);
	// 	}
	// }, [game.state]);

	useEffect(() => {
		const gcc = GCControllerRef.current;
		if (!gcc) return;
		gcc.setMusicVolume(musicVolume, overall);
		gcc.setGameVolume(gameVolume, overall);
	}, [musicVolume, gameVolume, overall]);

	return (
		<canvas
			ref={canvasRef}
		/>
	);
};

export default memo(Canvas);
