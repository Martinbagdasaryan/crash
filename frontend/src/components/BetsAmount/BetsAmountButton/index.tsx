import { useDispatch, useSelector } from 'react-redux';
import {
	selectCoeficient,
	selectGame,
	selectPlayer,
	selectSettings,
} from '../../../redux/selector';
import { GAME_STATE } from '../../../utils/enums';
import { useUrlParams } from '../../../hooks/useUrlParams';
import { setAddBets, setAddWinAmount, setClearBets } from '../../../redux/selects/game';
import { GET_ACTIONS, SEND_ACTIONS } from '../../../api/connnectionEnum';
import { useSocket } from '../../../socket/SocketContext';
import { cn, ERROR_TYPES, notFoundMessages } from '../../../utils/helper';
import { useEffect, useState } from 'react';
import { useT } from '../../../lang';
import { setBalance, setBalanceCalc } from '../../../redux/selects/players';
import { setError } from '../../../redux/selects/error';
import { setIsBettingRoundId } from '../../../redux/selects/settings';

interface BetsAmountButtonProps {
	index: number;
}

const BetsAmountButton: React.FC<BetsAmountButtonProps> = ({ index }) => {
	const { t } = useT();

	const [isSuccess, setIsSuccess] = useState(false);

	const socket = useSocket();
	const dispatch = useDispatch();

	const { state, bets, roundId } = useSelector(selectGame);
	const { coeficient } = useSelector(selectCoeficient);
	const { playerId, token } = useUrlParams();
	const { maxBet, minBet, balance } = useSelector(selectPlayer);
	const { amount, cashOut, isBettingRoundId, winAmount } =
		useSelector(selectSettings).windowInfo[index];

	const userBet = bets?.find((bet) => bet.index === index);

	const onBets = () => {
		if (balance < amount) {
			dispatch(setIsBettingRoundId({ index, isBettingRoundId: null }));

			dispatch(
				setError({
					code: ERROR_TYPES.LowBalance,
					messages: notFoundMessages[ERROR_TYPES.LowBalance],
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

			setIsSuccess(true);
			dispatch(setAddBets(bet));
			dispatch(setIsBettingRoundId({ index, isBettingRoundId: null }));
			dispatch(setBalanceCalc(amount));
			socket?.emit(SEND_ACTIONS.Bets, { ...bet, autoCashe: cashOut || 0 });
		}
	};

	socket?.on(`${GET_ACTIONS.BetSuccessIndex}${index}`, (data) => {
		if (data.success) {
			setIsSuccess(false);
		}
	});

	socket?.on(`${GET_ACTIONS.CashOutIndex}${index}`, (data) => {
		if (data.success) {
			setIsSuccess(false);
		}
	});

	const handleCashOut = () => {
		dispatch(setIsBettingRoundId({ index, isBettingRoundId: null }));

		const bet = {
			playerId: +(playerId ?? 0),
			amount,
			index,
			roundId,
			sessionId: token ?? '',
		};

		setIsSuccess(true);
		socket?.emit(SEND_ACTIONS.CashOut, bet);
	};

	const handleBottonText = (isCash: boolean, isBettingRoundId: boolean) => {
		if (isCash)
			return `${t('cash_out')} ${((userBet?.amount ?? 0) * (coeficient ?? 0)).toFixed(2)}`;
		else if (isBettingRoundId) return t('cancel');
		else return t('place_bet');
	};

	const isCashOut =
		!!userBet?.amount && !userBet?.win && state === GAME_STATE.RoundInProgress && !winAmount;

	const isDisabled = (!(amount >= minBet && amount <= maxBet) || isSuccess) && !userBet?.amount;

	const onClick = () => {
		if (isCashOut) {
			handleCashOut();
		} else if (!!isBettingRoundId && !(!!userBet?.amount && !userBet?.win)) {

			dispatch(setIsBettingRoundId({ index, isBettingRoundId: null }));
		} else {
			if (state === GAME_STATE.WaitingForBets) {
				if (!userBet?.amount) {
					onBets();
				} else {
					dispatch(setBalance(+balance + (userBet?.amount ?? 0)));
					dispatch(setClearBets(index));
					socket?.emit(SEND_ACTIONS.CancleBets, { boxIndex: index, playerId: playerId });

					dispatch(setIsBettingRoundId({ index, isBettingRoundId: null }));
				}
			} else {
				dispatch(setIsBettingRoundId({ index, isBettingRoundId: isBettingRoundId ? null : roundId }));
			}
		}
	};

	useEffect(() => {
		if (winAmount > 0) {

			dispatch(setIsBettingRoundId({ index, isBettingRoundId: null }));
			setIsSuccess(false);
			dispatch(setAddWinAmount({ index, winAmount }));
		}
	}, [winAmount]);

	return (
		<button
			onClick={onClick}
			disabled={isDisabled}
			className={cn(
				'buttonAnimation flex justify-center items-center w-full min-w-36 rounded-lg shadow-[0_0_3px_rgba(0,0,0,0.3)] font-[600] leading-none h-9',
				{
					bet: (!!userBet?.amount && !userBet?.win) || !!isBettingRoundId,
					win: isCashOut,
				},
				{
					'opacity-50': isDisabled,
					'flex-col': !!isBettingRoundId && !(!!userBet?.amount && !userBet?.win),
				},
			)}
		>
			{handleBottonText(isCashOut, (!!userBet?.amount && !userBet?.win) || !!isBettingRoundId)}
			{!!isBettingRoundId && !(!!userBet?.amount && !userBet?.win) && (
				<p className="text-[14px]">{t('awaiting_next_flight')}</p>
			)}
		</button>
	);
};
export default BetsAmountButton;
