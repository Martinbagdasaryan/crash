import { useEffect } from 'react';
import { GET_ACTIONS } from '../api/connnectionEnum';
import { useSocket } from '../socket/SocketContext';
import { setAllBets, setStateGame } from '../redux/selects/game';
import { useDispatch } from 'react-redux';
import { IBetResult, ICoeficient, IState } from '../utils/types';
import { useUrlParams } from './useUrlParams';
import { setCoeficient } from '../redux/selects/coeficient';
import { setBalance, setPlayerData } from '../redux/selects/players';
import {
	setProvablyFair,
	setWindowInfoAmount,
	setWindowInfoWinAmount,
} from '../redux/selects/settings';
import { setError } from '../redux/selects/error';
import { IBets } from '../redux/selects/types';
import { setLaderBard } from '../redux/selects/leade';

export const useSocketListener = () => {
	const socket = useSocket();
	const dispatch = useDispatch();
	const { playerId } = useUrlParams();

	useEffect(() => {
		if (!socket || !playerId) return;

		const onGame = (game: IState) => {
			const { roundId, state, bets, bettingTime } = game;
			const myBets = bets.filter((bet) => bet.playerId === +playerId);

			dispatch(
				setStateGame({
					roundId,
					state,
					bets: myBets,
					bettingTime,
					allBets: bets,
				}),
			);
		};

		const onBets = (bets: { bets: IBets[] }) => dispatch(setAllBets(bets.bets));

		const onPlayer = (playerData: any) => {
			dispatch(setWindowInfoAmount(playerData.minBet));

			dispatch(setPlayerData(playerData));
		};

		const onCoef = (coef: ICoeficient) => dispatch(setCoeficient({ coeficient: coef.value }));

		const onError = (error: any) => dispatch(setError(error));

		const onFair = (data: any) =>
			dispatch(
				setProvablyFair({
					playerSeed: data.playerSeed,
					serverHash: data.serverHash,
				}),
			);

		const onWin = (data: any) =>
			dispatch(
				setWindowInfoWinAmount({
					index: data.betIndex,
					winAmount: data.winAmount,
				}),
			);

		const onLeader = (data: any) => dispatch(setLaderBard(data.leader));

		const onBalance = (data: any) => dispatch(setBalance(data.balane));

		socket.on(GET_ACTIONS.Game, onGame);
		socket.on(GET_ACTIONS.Bets, onBets);
		socket.on(GET_ACTIONS.Player, onPlayer);
		socket.on(GET_ACTIONS.Coeficient, onCoef);
		socket.on(GET_ACTIONS.Error, onError);
		socket.on(GET_ACTIONS.ProvablyFair, onFair);
		socket.on(GET_ACTIONS.WinAmount, onWin);
		socket.on(GET_ACTIONS.leaderBoard, onLeader);
		socket.on(GET_ACTIONS.Balance, onBalance);

		return () => {
			socket.off(GET_ACTIONS.Game, onGame);
			socket.off(GET_ACTIONS.Bets, onBets);
			socket.off(GET_ACTIONS.Player, onPlayer);
			socket.off(GET_ACTIONS.Coeficient, onCoef);
			socket.off(GET_ACTIONS.Error, onError);
			socket.off(GET_ACTIONS.ProvablyFair, onFair);
			socket.off(GET_ACTIONS.WinAmount, onWin);
			socket.off(GET_ACTIONS.leaderBoard, onLeader);
			socket.off(GET_ACTIONS.Balance, onBalance);
		};
	}, [socket, playerId, dispatch]);
};
