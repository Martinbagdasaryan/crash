import { useEffect, useState } from 'react';
import { cn, dataFormater } from '../../utils/helper';
import { useSocket } from '../../socket/SocketContext';
import { GET_ACTIONS, SEND_ACTIONS } from '../../api/connnectionEnum';
import { useUrlParams } from '../../hooks/useUrlParams';
import { useT } from '../../lang';
import TableHeader from '../TableHeader';

interface history {
	createdAt: Date;
	winAmount: number;
	odds: number;
	amount: number;
}
const MyBetsHistory: React.FC = () => {
	const { t } = useT();
	const [history, setHistory] = useState<history[]>([]);
	const socket = useSocket();
	const { playerId } = useUrlParams();

	useEffect(() => {
		if (!playerId || !socket) return;
		socket.emit(SEND_ACTIONS.MyBetsHistory, { playerId });
		const handler = (data: history[]) => setHistory(data);
		socket.on(GET_ACTIONS.MyBetsHistory, handler);
		return () => {
			socket.off(GET_ACTIONS.MyBetsHistory, handler);
		};
	}, [playerId, socket]);

	return (
		<>
			<TableHeader headers={['data', 'bets', 'coefficient', 'win']} />
			<div className="w-full overflow-y-auto h-full flex gap-1.5 p-1 flex-col custom-scrollbar">
				{history.length > 0 ? (
					history.map((bet, index) => {
						const isWin = !!+bet.winAmount;

						return (
							<div
								key={index}
								className={cn(
									'flex w-full min-h-[40px] rounded-xl font-bold transition-all duration-300 items-center justify-between px-2',
									'bg-emerald-500/5 border border-transparent hover:bg-emerald-500/10',
									{
										/* Подсветка выигрышной строки */
										'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]': isWin,
									}
								)}
							>
								{/* Дата: приглушенная и мелкая */}
								<div className="flex justify-start items-center w-[25%] text-[10px] text-slate-500 font-medium">
									{dataFormater(bet.createdAt)}
								</div>

								{/* Ставка: нейтральный белый */}
								<div className="flex justify-center items-center w-[25%] text-[12px] text-white/90">
									{Number(bet.amount || 0).toFixed(2)}
								</div>

								{/* Коэффициент: яркий изумруд при выигрыше */}
								<div className={cn(
									"flex justify-center items-center w-[25%] text-[12px]",
									isWin ? "text-emerald-400 font-black" : "text-slate-500"
								)}>
									{!!bet?.odds ? `x${Number(bet.odds || 0).toFixed(2)}` : '-'}
								</div>

								{/* Сумма выигрыша: золото или изумруд */}
								<div className={cn(
									"flex justify-end items-center w-[25%] text-[12px] pr-1",
									isWin ? "text-emerald-400 font-black drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]" : "text-slate-500"
								)}>
									{isWin ? Number(bet.winAmount || 0).toFixed(2) : '-'}
								</div>
							</div>
						);
					})
				) : (
					<div className="flex w-full h-full items-center justify-center opacity-20 italic text-sm py-10">
						{t('no_bets_placed')}
					</div>
				)}
			</div>
		</>
	);
};

export default MyBetsHistory;
