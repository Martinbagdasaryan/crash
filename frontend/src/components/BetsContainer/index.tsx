import { useEffect, useState } from 'react';
import BetsWindow from '../BetsWindow';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../../socket/SocketContext';
import { selectGame, selectPlayer, selectSettings } from '../../redux/selector';
import { useUrlParams } from '../../hooks/useUrlParams';
import { setError } from '../../redux/selects/error';
import { cn, ERROR_TYPES, notFoundMessages } from '../../utils/helper';
import { GAME_STATE } from '../../utils/enums';
import { setAddBets } from '../../redux/selects/game';
import { setBalanceCalc } from '../../redux/selects/players';
import { SEND_ACTIONS } from '../../api/connnectionEnum';
import { setIsBettingRoundId, setWindowInfo } from '../../redux/selects/settings';


const BetsContainer: React.FC = () => {

	const socket = useSocket();
	const dispatch = useDispatch();
	const { isMobile } = useSelector(selectSettings);
	
	const { state, roundId, bets } = useSelector(selectGame);
	const { playerId, token } = useUrlParams();
	const { maxBet, minBet, balance } = useSelector(selectPlayer);
	const contener =
		useSelector(selectSettings).windowInfo;

	const onBets = (index: number, newBalance: number) => {
		const { amount, cashOut } = contener[index];
		if (state !== GAME_STATE.WaitingForBets) return;

		const userBet = bets?.find((bet) => bet.index === index)?.amount;
		if (!!userBet) return

		if (balance < amount || newBalance < 0) {
			dispatch(
				setError({
					code: ERROR_TYPES.LowBalance,
					messages: notFoundMessages[ERROR_TYPES.LowBalance],
				}),
			);
			dispatch(
				setWindowInfo({
					index,
					isKeybordOpen: false,
					type: null,
					isAutoBetCount: 0,
				}),
			);
			return;
		}

		if (amount >= minBet && amount <= maxBet && state === GAME_STATE.WaitingForBets) {
			const bet = {
				playerId: +(playerId ?? 0),
				amount: amount,
				index,
				roundId,
				token: token ?? '',
				betIsSuccess: false,
			};

			dispatch(setAddBets(bet));
			dispatch(setBalanceCalc(amount));
			socket?.emit(SEND_ACTIONS.Bets, { ...bet, autoCashe: cashOut || 0 });
		}
	};

	useEffect(() => {
		let newBalance = balance;
		for (let i = 0; i < contener.length; i++) {
			if (!!contener[i].isAutoBetCount && contener[i].amount) {
				newBalance -= contener[i].amount
				onBets(i, newBalance)
			}
		}
		;
	}, [contener[0].isAutoBetCount, contener[1].isAutoBetCount]);

	useEffect(() => {
		let newBalance = balance;
		for (let i = 0; i < contener.length; i++) {
			if (contener[i].isBettingRoundId && contener[i].isBettingRoundId !== roundId && state === GAME_STATE.WaitingForBets) {
				newBalance -= contener[i].amount
				onBets(i, newBalance);
				dispatch(setIsBettingRoundId({ index: i, isBettingRoundId: null }));
			}
		}
	}, [contener[0].isBettingRoundId, contener[1].isBettingRoundId, state]);

	

	return (
		<div className="absolute flex justify-center items-center z-20 bottom-[20px] w-full short:bottom-5">
			<div className={cn("flex justify-between items-center p-4 gap-2 rounded-2xl border border-gray-950/50 bg-blue-950/80 shadow-[inset_0_0_20px_rgba(23,100,250,0.3)] w-[44%] rounded-b-none", {
				' mob:rounded-t-2xl mob:p-2 mob:gap-1 mob:w-full': isMobile
			})}>
				{Array.from({ length: 2 }).map((_, i) => (
					<BetsWindow key={i} index={i} />
				))}
			</div>
		</div>
	);
};

export default BetsContainer;
