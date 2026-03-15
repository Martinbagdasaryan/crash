import { useDispatch, useSelector } from 'react-redux';
import { selectPlayer, selectSettings } from '../../redux/selector';
import { useEffect } from 'react';
import { cn } from '../../utils/helper';
import { setWindowInfoWinAmount } from '../../redux/selects/settings';
const WinPopup = () => {
	const { windowInfo } = useSelector(selectSettings);
	const { currencyId } = useSelector(selectPlayer);
	const dispatch = useDispatch();

	useEffect(() => {
		const timeouts: ReturnType<typeof setTimeout>[] = [];
		windowInfo.forEach((win, index) => {
			if (win.winAmount) {
				const t = setTimeout(() => {
					dispatch(setWindowInfoWinAmount({ index, winAmount: 0 }));
				}, 5000);
				timeouts.push(t);
			}
		});
		return () => timeouts.forEach(clearTimeout);
	}, [windowInfo.map((w) => w.winAmount).join(), dispatch]);

	return windowInfo
		.filter((info) => info.winAmount)
		.map((info, idx) => (
			<div
				key={info.index}
				/* Смещение, если выигрышей два */
				className={cn('absolute left-0 flex justify-center w-full h-fit z-[60] animate-winAppear', {
					'top-4': idx === 0,
					'top-24': idx === 1,
				})}
			>
				{/* Основной контейнер выигрыша */}
				<div className="relative flex flex-col justify-center items-center px-8 py-2 min-w-[280px] rounded-full overflow-hidden bg-emerald-500 border-2 border-white/30 shadow-[0_0_50px_rgba(16,185,129,0.8)] mob:min-w-[220px]">

					{/* Световой блик, пробегающий по плашке */}
					<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shine" />

					<h2 className="text-[14px] text-black font-black uppercase tracking-[0.3em] mb-0.5 drop-shadow-sm">
						You Win
					</h2>

					<div className="flex gap-2 items-center text-black">
						<span className="font-black text-lg opacity-70">{currencyId}</span>
						<p className="text-3xl font-[1000] tracking-tighter italic">
							{info.winAmount.toFixed(2)}
						</p>
					</div>

					{/* Декоративные частицы по бокам внутри плашки */}
					<div className="absolute left-4 w-1.5 h-1.5 bg-white rounded-full animate-ping" />
					<div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full animate-ping delay-100" />
				</div>
			</div>
		));
};
export default WinPopup;
