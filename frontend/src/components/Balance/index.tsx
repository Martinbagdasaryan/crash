import { useDispatch, useSelector } from 'react-redux';
import { selectPlayer, selectSettings } from '../../redux/selector';
import { setIsMobileMenu } from '../../redux/selects/settings';
import InfoComponentsMenu from '../InfoComponentMenu';

const Balance = () => {
	const { balance, currencyId } = useSelector(selectPlayer);
	const { isMobileMenu } = useSelector(selectSettings);
	const dispatch = useDispatch();

	return (
		<>
			<div className='absolute top-0 left-0 w-full h-fit flex justify-center z-[30] pointer-events-none'>
				<div className='w-[44%] mob:w-full flex flex-col items-center p-2 h-fit pointer-events-auto'>
					<div className="flex justify-between items-center w-full h-11 px-4 overflow-hidden bg-[#050a09]/80 backdrop-blur-md border border-emerald-500/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)] rounded-b-2xl">

						<div className="flex items-center gap-2">
							<div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
							<span className="text-[10px] font-black text-emerald-500/50 uppercase tracking-tighter">Live</span>
						</div>

						<div className="flex items-center gap-3">
							<div className="flex items-center gap-2">
								<span className="text-emerald-400 font-black text-sm">
									{currencyId}
								</span>
								<span className="text-white font-[1000] text-xl tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
									{(+balance).toFixed(2)}
								</span>
							</div>

							<button
								onClick={() => dispatch(setIsMobileMenu(true))}
								className="hidden mob:flex justify-center items-center w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 active:scale-90 transition-all"
							>
								<img src={`/icons/menu.svg`} className="w-5 h-5" style={{ filter: 'invert(58%) sepia(88%) saturate(365%) hue-rotate(113deg) brightness(96%) contrast(91%)' }} />
							</button>
						</div>
					</div>
				</div>
			</div>
			{isMobileMenu && <InfoComponentsMenu />}
		</>
	);
};

export default Balance;
