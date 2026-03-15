import { useDispatch, useSelector } from 'react-redux';
import { cn } from '../../utils/helper';
import { selectGame, selectPlayer, selectSettings } from '../../redux/selector';
import { setWindowInfo } from '../../redux/selects/settings';
import { setBalance } from '../../redux/selects/players';
import { setClearBets } from '../../redux/selects/game';
import { SEND_ACTIONS } from '../../api/connnectionEnum';
import { useSocket } from '../../socket/SocketContext';
import { useUrlParams } from '../../hooks/useUrlParams';
import { GAME_STATE } from '../../utils/enums';

interface SelectorProps {
	index: number;
}
const Switch = ({ index }: SelectorProps) => {
	const dispatch = useDispatch();
	const { windowInfo } = useSelector(selectSettings);
	const { isAutoBetCount } = windowInfo[index];

	const isActive = !!isAutoBetCount;
	const socket = useSocket();

	const { playerId } = useUrlParams();
	const { balance } = useSelector(selectPlayer);
	const { bets, state } = useSelector(selectGame);
	const userBet = bets?.find((bet) => bet.index === index);

	// Логика остается без изменений
	const setAutoBetCount = (isAutoBetCount: boolean) => {
		if (!!isAutoBetCount) {
			sendAutoPlay(999);
		} else {
			sendAutoPlay(null);
			if (state === GAME_STATE.WaitingForBets) {
				dispatch(setBalance(+balance + (userBet?.amount ?? 0)));
				dispatch(setClearBets(index));
				socket?.emit(SEND_ACTIONS.CancleBets, { boxIndex: index, playerId: playerId });
			}
		}
	};

	const sendAutoPlay = (count: number | null) => {
		const newInfo = {
			index: index,
			type: null,
			isKeybordOpen: false,
			isAutoBetCount: count,
		};
		dispatch(setWindowInfo(newInfo));
	};

	return (
		<div
			onClick={() => setAutoBetCount(!isAutoBetCount)}
			className={cn(
				'group w-10 h-[22px] relative rounded-full duration-300 cursor-pointer p-[2px] transition-all',
				'bg-emerald-950/40 border border-emerald-500/20',
				{
					'bg-emerald-500 border-white/20 shadow-[0_0_15px_rgba(16,185,129,0.6)]': isActive,
				},
			)}
		>
			<div className={cn(
				"absolute inset-0 rounded-full transition-opacity duration-300",
				isActive ? "opacity-0" : "opacity-100"
			)}>
				<div className="absolute top-1/2 left-1.5 -translate-y-1/2 w-1 h-1 rounded-full bg-emerald-500/20" />
			</div>

			<div
				className={cn(
					'w-4 h-4 rounded-full shadow-lg transform transition-all duration-300 ease-in-out flex items-center justify-center',
					{
						'translate-x-5 bg-black': isActive, // Черный рычажок на зеленом фоне
						'translate-x-0 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]': !isActive, // Зеленый рычажок на темном
					}
				)}
			>
				<div className={cn(
					"w-1 h-1 rounded-full",
					isActive ? "bg-emerald-500" : "bg-white/40"
				)} />
			</div>
		</div>
	);
};
export default Switch;
