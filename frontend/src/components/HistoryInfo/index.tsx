import { useSelector } from 'react-redux';
import { selectGame } from '../../redux/selector';
import { cn } from '../../utils/helper';
import { GAME_STATE } from '../../utils/enums';
import { useSocket } from '../../socket/SocketContext';
import { GET_ACTIONS } from '../../api/connnectionEnum';
import { useState } from 'react';

const HistoryInfo: React.FC = () => {
	const { state } = useSelector(selectGame);
	const isBettingTime = state === GAME_STATE.WaitingForBets;
	const socket = useSocket();
	const [history, setHistory] = useState<number[]>([]);

	socket?.on(GET_ACTIONS.Rounds, (data) => {
		setHistory(data);
	});

	return (
		<div className="absolute bottom-0 right-0 z-20 w-full flex justify-between gap-2 items-center h-[30px] bg-sky-950 px-2 overflow-hidden short:h-5 ">
			{history.map((item, index) => (
				<span
					key={index}
					className={cn(' font-[600] short:text-3 text-gray-400', {
						'text-red-400': item < 1.5 && isBettingTime,
						'text-green-500': item >= 1.5 && isBettingTime,
					})}
				>
					{item.toFixed(2)}
				</span>
			))}
		</div>
	);
};

export default HistoryInfo;
