import { useSelector } from 'react-redux';
import { selectGame } from '../../redux/selector';
import { cn, maskNumber } from '../../utils/helper';
import { useT } from '../../lang';
import TableHeader from '../TableHeader';
const HistoryInRound: React.FC = () => {
	const { t } = useT();
	const { allBets } = useSelector(selectGame);

	return (
		<>
			<TableHeader headers={['player_id', 'bets', 'coefficient', 'win']} />
			<div className="w-full overflow-y-auto h-full flex gap-1 p-1 flex-col custom-scrollbar">
				{allBets.length > 0 ? (
					allBets.map((bet, index) => {
						const isWin = !!bet.win ? +bet.win : 0;

						return (
							<div
								key={index}
								className={cn(
									'flex w-full min-h-[36px] rounded-lg font-bold transition-all duration-300 items-center justify-between px-1',
									'bg-emerald-500/5 border border-transparent', // Базовый стиль строки
									{
										/* Стиль для победителя: подсвеченная граница и фон */
										'bg-emerald-500/15 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]': !!isWin,
									},
								)}
							>
								{/* ID Игрока (Приглушенный) */}
								<div className="flex justify-center items-center w-[25%] text-[11px] text-slate-400">
									{maskNumber(bet.playerId)}
								</div>

								{/* Ставка */}
								<div className="flex justify-center items-center w-[25%] text-[12px] text-white/90">
									{bet.amount}
								</div>

								{/* Коэффициент (Profit) */}
								<div className={cn(
									"flex justify-center items-center w-[25%] text-[12px]",
									isWin ? "text-emerald-400 font-black" : "text-slate-500"
								)}>
									{bet.profit ? `x${bet.profit}` : '-'}
								</div>

								{/* Выигрыш */}
								<div className={cn(
									"flex justify-center items-center w-[25%] text-[12px] rounded-md px-1",
									isWin ? "text-emerald-400 font-black" : "text-slate-500"
								)}>
									{bet.win || '-'}
								</div>
							</div>
						);
					})
				) : (
					<div className="flex w-full h-20 items-center justify-center opacity-30 italic text-sm">
						<span>{t('no_bets_placed')}</span>
					</div>
				)}
			</div>
		</>
	);
};

export default HistoryInRound;
