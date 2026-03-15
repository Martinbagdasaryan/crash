import { useSelector } from 'react-redux';
import { useT } from '../../lang';
import { selectSeader } from '../../redux/selector';
import { dataFormater } from '../../utils/helper';
import TableHeader from '../TableHeader';
const HighestBets: React.FC = () => {
	const { t } = useT();
	const { leaderBard } = useSelector(selectSeader);

	return (
		<>
			<TableHeader headers={['data', 'coefficient']} />
			<div className="w-full overflow-y-auto h-full flex gap-1.5 p-1 flex-col custom-scrollbar">
				{leaderBard && leaderBard.length > 0 ? (
					leaderBard.map((bet, index) => (
						<div
							key={index}
							className="flex w-full min-h-[40px] rounded-xl transition-all duration-300 items-center justify-between px-3 bg-emerald-500/5 border border-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 group"
						>
							{/* Дата (Слева) */}
							<div className="flex justify-start items-center w-[55%]">
								<span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-300 transition-colors">
									{dataFormater(bet.createdAt)}
								</span>
							</div>

							{/* Коэффициент (Справа, светится) */}
							<div className="flex justify-end items-center w-[45%]">
								<span className="font-[1000] text-emerald-400 text-[14px] drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
									{bet.odds ? `x${Number(bet.odds).toFixed(2)}` : '-'}
								</span>
							</div>
						</div>
					))
				) : (
					<div className="flex w-full h-full items-center justify-center opacity-20 italic text-sm py-10">
						{t('no_data_available') /* или твой ключ для отсутствия данных */}
					</div>
				)}
			</div>
		</>
	);
};
export default HighestBets;
