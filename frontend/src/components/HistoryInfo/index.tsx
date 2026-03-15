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
		<div className="absolute bottom-0 right-0 z-20 w-full flex justify-start gap-1.5 items-center h-[30px] bg-[#050a09] border-t border-emerald-500/10 px-2 overflow-x-auto no-scrollbar short:h-6">
			{history.map((item, index) => (
				<div
					key={index}
					className={cn(
						"flex items-center justify-center px-2 min-w-[50px] h-[20px] rounded-full text-[11px] font-black transition-all duration-300",
						"border backdrop-blur-sm",
						{
							/* Низкий коэффициент (Красный/Розовый неон) */
							'bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]': item < 1.5,
							/* Средний коэффициент (Зеленый неон) */
							'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]': item >= 1.5 && item < 10,
							/* Высокий коэффициент (Золотой/Желтый неон - Джекпот) */
							'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.4)] animate-pulse': item >= 10
						}
					)}
				>
					{item.toFixed(2)}x
				</div>
			))}
		</div>
	);
};

export default HistoryInfo;
