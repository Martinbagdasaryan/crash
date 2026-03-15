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
		<div className="absolute flex justify-center items-center z-10 bottom-[30px] w-full pointer-events-none">
			<div className={cn(
				"flex justify-between items-center p-4 gap-4 w-[44%] pointer-events-auto transition-all duration-500",
				"bg-[#050a09]/90 backdrop-blur-xl border-t border-x border-emerald-500/20",
				"shadow-[0_-10px_40px_rgba(0,0,0,0.6)] rounded-t-[2.5rem]",
				{
					'mob:rounded-t-3xl mob:p-2 mob:gap-2 mob:w-full': isMobile,
				}
			)}>

				{Array.from({ length: 2 }).map((_, i) => (
					<div key={i} className="flex-1">
						<BetsWindow index={i} />
					</div>
				))}
			</div>
		</div>
	);
};

export default BetsContainer;
