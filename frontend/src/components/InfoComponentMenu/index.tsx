import { useDispatch, useSelector } from 'react-redux';
import { setIsMenuOpen, setIsMobileMenu } from '../../redux/selects/settings';
import { useState } from 'react';
import MyBetsHistory from '../MyBetsHistory';
import HighestBets from '../HighestBets';
import Settings from '../Settings';
import ProvablyFair from '../ProvablyFair.tsx';
import { useT } from '../../lang';
import { selectSettings } from '../../redux/selector';
import { cn } from '../../utils/helper';

const InfoComponentsMenu = () => {
	const { t } = useT();
	const dispatch = useDispatch();
	const [isActive, setIsActive] = useState<number | null>(null);
	const { isMenuOpen } = useSelector(selectSettings);

	const items = [
		{ type: 0, text: t('leaderboard'), icon: 'star' },
		{ type: 1, text: t('my_bets'), icon: 'history' },
		{ type: 2, text: t('provably_fair'), icon: 'shield' },
		{ type: 3, text: t('settings'), icon: 'settings' },
		{ type: 4, text: t('back'), icon: 'logout' },
	];

	const close = () => {
		dispatch(setIsMenuOpen(false));
		dispatch(setIsMobileMenu(false));
	};

	const switchWindow = (type: number | null) => {
		// Обертка для контента окон
		const ContentWrapper = ({ children }: { children: React.ReactNode }) => (
			<div className="flex flex-col p-2 items-center w-full h-full overflow-hidden bg-[#050a09]/60 border border-emerald-500/10 rounded-2xl backdrop-blur-sm">
				{children}
			</div>
		);

		switch (type) {
			case 0: return <ContentWrapper>
				<HighestBets />
			</ContentWrapper>;
			case 1: return <ContentWrapper>
				<MyBetsHistory />
			</ContentWrapper>;
			case 2: return <ProvablyFair />;
			case 3: return <Settings />;
			case 4: window.history.back(); return null;
			default: return null;
		}
	};

	return (
		<div className="w-full h-full bg-[#050a09] absolute top-0 right-0 flex flex-col px-3 pb-3 items-center z-[100] animate-fadeIn">
			{isActive === null ? (
				<>
					{/* Кнопка закрытия */}
					<div className='w-full flex justify-end py-4'>
						<button
							onClick={close}
							className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all"
						>
							<img src="/icons/close.svg" className="w-5 h-5" style={{ filter: 'brightness(0) saturate(100%) invert(58%) sepia(88%) saturate(365%) hue-rotate(113deg) brightness(96%) contrast(91%)' }} />
						</button>
					</div>

					{/* Список пунктов меню */}
					<div className="w-full flex flex-col gap-2">
						{items.map((item) => (
							<button
								key={item.type}
								onClick={() => setIsActive(item.type)}
								className={cn(
									"w-full h-[54px] px-4 flex items-center justify-between rounded-xl transition-all duration-200",
									"bg-emerald-500/5 border border-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 group",
									"short:h-10"
								)}
							>
								<span className="text-[14px] font-black uppercase tracking-widest text-emerald-500/80 group-hover:text-emerald-400">
									{item.text}
								</span>
								<div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
									<svg
										className="w-3 h-3 text-emerald-500 group-hover:text-black transition-colors"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth="4"
									>
										<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
									</svg>
								</div>
							</button>
						))}
					</div>
				</>
			) : (
				<>
					{/* Хедер активного окна */}
					<div className="flex items-center justify-between w-full py-4 mb-2 border-b border-emerald-500/10">
						<button
							onClick={() => setIsActive(null)}
							className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-emerald-500/60 hover:text-emerald-400 transition-colors"
						>
							<img src="/icons/leftArrow.svg" className="w-4 h-4 opacity-60" />
							{t('back')}
						</button>
						<p className="text-[14px] font-black uppercase tracking-[0.2em] text-emerald-500">
							{items[isActive].text}
						</p>
						<div className="w-10" /> {/* Спейсер для центровки заголовка */}
					</div>

					{/* Контент выбранного окна */}
					<div className="w-full flex-1 overflow-hidden">
						{switchWindow(isActive)}
					</div>
				</>
			)}
		</div>
	);
};

export default InfoComponentsMenu;
