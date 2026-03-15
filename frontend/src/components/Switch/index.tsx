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


	const setAutoBetCount = (isAutoBetCount: boolean) => {
		if (!!isAutoBetCount) {
			sendAutoPlay(999);
		}
		else {

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
			className={cn(
				'w-10 h-[18px] bg-gray-300 shadow-[0_0_3px_rgba(0,0,0,0.3)] relative rounded-full duration-300 cursor-pointer',
				{
					'bg-blue-700': isActive,
				},
			)}
			onClick={() => {
				setAutoBetCount(!isAutoBetCount);
			}}
		>
			<div
				className={cn(
					'absolute top-[1px] left-[1px] w-4 h-4 bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out overflow-hidden',
					{
						'left-[23px]': isActive,
					},
					{
						buttonAnimation: !isActive,
					},
				)}
			/>
		</div>
	);
};

export default Switch;
