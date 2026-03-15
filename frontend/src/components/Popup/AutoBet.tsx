import { useState } from 'react';
import { cn } from '../../utils/helper';
import { useDispatch, useSelector } from 'react-redux';
import { selectSettings } from '../../redux/selector';
import { setPopupType, setWindowInfo } from '../../redux/selects/settings';

const AutoBetPopup: React.FC = () => {
	const dispatch = useDispatch();

	const [roundCount, setRoundCount] = useState(0);
	const [totalBet, setTotalBet] = useState(0);

	const { windowInfo, popupIndex } = useSelector(selectSettings);
	const playerWindowInfo = windowInfo[popupIndex ?? 0];
	const betAmount = playerWindowInfo?.amount ?? 0;

	const roundCounts = [1, 5, 10, 25, 50, 100];

	const lastCount =
		(playerWindowInfo?.isAutoBetCount || 0) < 100 ? (playerWindowInfo?.isAutoBetCount ?? 0) : 0;

	const onStart = () => {
		dispatch(
			setWindowInfo({
				index: popupIndex ?? 0,
				isKeybordOpen: false,
				type: null,
				isAutoBetCount: roundCount > 0 ? roundCount + 1 : (lastCount || 9999),
			}),
		);
		dispatch(setPopupType(null));
	};

	return (
		<div className="w-full h-full flex flex-col justify-between p-4 bg-[#050a09] text-white">
			<div className="w-full h-[15%] text-center text-[14px] font-black uppercase tracking-[0.3em] text-emerald-500/60">
				Auto Play Settings
			</div>

			<div className="w-full h-[65%] flex flex-col justify-center items-center gap-2">
				<div className="flex flex-col justify-center items-center gap-2 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 w-full max-w-[320px]">
					<div className="flex justify-between w-full">
						<span className="text-slate-400 text-xs uppercase font-bold">Rounds:</span>
						<span className="text-emerald-400 font-black">{roundCount || (lastCount > 0 ? lastCount - 1 : '∞')}</span>
					</div>
					<div className="flex justify-between w-full border-t border-emerald-500/5 pt-2">
						<span className="text-slate-400 text-xs uppercase font-bold">Total Bet:</span>
						<span className="text-white font-black">{(totalBet || betAmount * (lastCount > 0 ? lastCount - 1 : 0)).toFixed(2)}</span>
					</div>
				</div>

				<div className="grid grid-cols-3 gap-3 w-full max-w-[320px]">
					{roundCounts.map((ro) => (
						<button
							key={ro}
							onClick={() => {
								setRoundCount(ro);
								setTotalBet(betAmount * ro);
							}}
							className={cn(
								'h-11 rounded-xl font-black transition-all duration-200 border text-sm',
								roundCount === ro
									? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105'
									: 'bg-emerald-950/30 border-emerald-500/20 text-emerald-500/70 hover:border-emerald-500 hover:text-emerald-400'
							)}
						>
							{ro}
						</button>
					))}
				</div>
			</div>

			{/* Кнопка START: Большая и яркая */}
			<div className="w-full h-[20%] flex justify-center items-center pt-2">
				<button
					onClick={onStart}
					className={cn(
						'relative flex justify-center items-center rounded-2xl h-14 w-full max-w-[320px] font-black uppercase tracking-widest transition-all duration-300',
						'bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_45px_rgba(16,185,129,0.5)] active:scale-95'
					)}
				>
					Start Autoplay
				</button>
			</div>
		</div>
	);
};

export default AutoBetPopup;
