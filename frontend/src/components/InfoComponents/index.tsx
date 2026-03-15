import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import HistoryInRound from '../HistoryInRound';
import MyBetsHistory from '../MyBetsHistory';
import HighestBets from '../HighestBets';
import InfoComponentsMenu from '../InfoComponentMenu';
import { useT } from '../../lang';
import { cn } from '../../utils/helper';
import { selectGame, selectPlayer, selectSettings } from '../../redux/selector';
import {
	setGameVolume,
	setIsMenuOpen,
	setMusicVolume,
	setSoundVolume,
} from '../../redux/selects/settings';

const InfoComponents: React.FC = () => {
	const { t } = useT();
	const dispatch = useDispatch();
	const { isMobile } = useSelector(selectSettings);

	const { musicVolume, soundVolume, gameVolume, isMobileMenu, overall } =
		useSelector(selectSettings);
	const { roundId, allBets } = useSelector(selectGame);
	const { tableName } = useSelector(selectPlayer);
	const { isMenuOpen } = useSelector(selectSettings);

	const [window, setWindow] = useState(0);

	const allWindows = [
		{ type: 0, name: t('all_bets') },
		{ type: 1, name: t('my_bets') },
		{ type: 2, name: t('leaderboard') },
	];

	const menuItems = [
		{
			isActive: musicVolume * overall,
			iconActive: 'musicOn',
			iconInactive: 'musicOff',
			action: () => dispatch(setMusicVolume(+!musicVolume)),
		},
		{
			isActive: soundVolume * overall || gameVolume * overall,
			iconActive: 'soundOn',
			iconInactive: 'soundOff',
			action: () => {
				const isActive = soundVolume * overall || gameVolume * overall;
				dispatch(setSoundVolume(+!isActive));
				dispatch(setGameVolume(+!isActive));
			},
		},
		{
			isActive: isMobileMenu,
			iconActive: 'close',
			iconInactive: 'menu',
			action: () => dispatch(setIsMenuOpen(!isMenuOpen)),
		},
	];

	const switchWindow = (type: number) => {
		switch (type) {
			case 0:
				return <HistoryInRound />;
			case 1:
				return <MyBetsHistory />;
			case 2:
				return <HighestBets />;
			default:
				return null;
		}
	};

	return (
		<div
			className={cn(
				'absolute top-0 right-0 z-20 w-[28%] flex flex-col items-center gap-3 p-3 h-[calc(100%-30px)]',
				'bg-[#050a09]/90 backdrop-blur-md border-l border-emerald-500/10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]',
				{ 'mob:hidden': isMobile }
			)}
		>
			{/* Верхняя панель: Имя стола и Настройки */}
			<div className="flex justify-between items-center w-full h-11 bg-emerald-500/5 border border-emerald-500/10 px-4 rounded-xl font-black text-[12px] tracking-widest uppercase text-emerald-500/80">
				<span>{tableName}</span>
				<div className="flex justify-around items-center gap-2">
					{menuItems.map((item, index) => (
						<button
							key={index}
							onClick={item.action}
							className={cn(
								"flex justify-center items-center p-2 rounded-lg transition-all duration-200",
								"bg-emerald-950/40 border border-emerald-500/10 hover:bg-emerald-500 hover:text-black",
								{ "text-emerald-400": item.isActive, "text-gray-500": !item.isActive }
							)}
						>
							<img
								src={`/icons/${item.isActive ? item.iconActive : item.iconInactive}.svg`}
								alt={item.iconActive}
								className={cn("w-4 h-4 transition-all", { "brightness-0": item.isActive })}
								style={{ filter: item.isActive ? 'drop-shadow(0 0 5px rgba(16,185,129,0.5))' : 'none' }}
							/>
						</button>
					))}
				</div>
			</div>

			{isMenuOpen ? (
				<InfoComponentsMenu />
			) : (
				<>
					{/* Переключатель вкладок (Tabs) */}
					<div className="flex justify-around items-center w-full h-10 p-1 bg-emerald-950/40 border border-emerald-500/10 rounded-xl">
						{allWindows.map((w) => (
							<button
								key={w.type}
								onClick={() => setWindow(w.type)}
								className={cn(
									'flex justify-center items-center h-full text-center px-1 w-1/3 rounded-lg text-[11px] font-black uppercase tracking-tight transition-all duration-300',
									window === w.type
										? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'
										: 'text-emerald-500/50 hover:text-emerald-400'
								)}
							>
								{w.name}
							</button>
						))}
					</div>

					{/* Контент вкладок */}
					<div className="flex flex-col w-full flex-1 overflow-hidden bg-emerald-950/20 rounded-2xl border border-emerald-500/10 p-2 gap-2">
						{/* Статистика раунда */}
						<div className="flex justify-between items-center w-full h-8 px-2">
							<div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
								{t('all_bets')}: <span className="text-emerald-400 ml-1">{allBets.length}</span>
							</div>
							<div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
								{t('round')}: <span className="text-emerald-400 ml-1">#{roundId}</span>
							</div>
						</div>

						{/* Список ставок */}
						<div className="flex flex-col items-center w-full h-full bg-[#050a09]/40 border border-emerald-500/5 rounded-xl overflow-hidden">
							{switchWindow(window)}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default InfoComponents;
