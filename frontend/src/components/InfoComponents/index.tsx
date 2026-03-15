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
			className={
				'absolute top-0 right-0 z-20 w-[30%] flex flex-col items-center gap-2 p-2 h-[calc(100%-30px)] bg-gray-950/60 border-l border-black tab:w-[40%] tab:h-[calc(100%-171px)] mob:hidden short:flex duration-150 short:h-[calc(100%-20px)] short:tab:h-[calc(100%-109px)] short:mob:h-[calc(100%-116px)] short:p-1 short:gap-1'
			}
		>
			<div className="flex justify-between items-center w-full h-11 bg-sky-950/50 shadow-[inset_0_0_20px_rgba(23,100,250,0.3)] px-4 rounded-lg font-[600] short:text-3.5 short:h-7">
				<span>{tableName}</span>
				<div className="flex justify-around items-center gap-1">
					{menuItems.map((item, index) => (
						<button
							key={index}
							onClick={item.action}
							className="flex justify-center items-center p-2 bg-gray-950/50 rounded-lg hover:opacity-100 hover:bg-blue-500 short:p-1"
						>
							<img
								src={`/icons/${item.isActive ? item.iconActive : item.iconInactive}.svg`}
								alt={item.iconActive}
								className="w-5 h-5 short:w-4 short:h-4"
							/>
						</button>
					))}
				</div>
			</div>

			{isMenuOpen ? (
				<InfoComponentsMenu />
			) : (
				<>
					<div className="flex justify-around items-center w-full h-11 overflow-hidden bg-sky-950/40 shadow-[inset_0_0_20px_rgba(23,100,250,0.3)] rounded-lg short:top-[45px] short:px-0.5 short:right-[3px] short:text-3.5 short:h-[34px] short:leading-none">
						{allWindows.map((w) => (
							<button
								key={w.type}
								onClick={() => setWindow(w.type)}
								className={cn(
									'flex justify-center items-center h-full text-left px-1 w-1/3 rounded-lg font-[500] hover:text-gray-300',
									{
										'buttonAnimation shadow-[0_0_3px_rgba(0,0,0,0.3)]': window === w.type,
									},
								)}
							>
								<span className="overflow-hidden text-ellipsis leading-[1.2rem]">{w.name}</span>
							</button>
						))}
					</div>
					<div className="flex flex-col w-full flex-1 overflow-hidden bg-sky-950/50 shadow-[inset_0_0_20px_rgba(23,100,250,0.3)] rounded-lg px-2 py-2 gap-2 short:px-0.5 short:py-0.5 short:top-[85px] short:gap-0.5 short:right-[3px]">
						<div className="flex justify-between items-center w-full h-8 px-2 bg-transparent short:px-0.5 short:h-7">
							<div className="flex justify-center items-center gap-1 font-[600] short:text-3.5">
								{t('all_bets')}:<span className="text-blue-500 font-[500]">{allBets.length}</span>
							</div>
							<div className="flex justify-center items-center gap-1 font-[600] short:text-3.5">
								{t('round')}:<span className="text-blue-500 font-[500]">#{roundId}</span>
							</div>
						</div>
						<div className="flex flex-col pr-1 items-center w-full h-full bg-gray-950/40 border border-gray-950/50 rounded-lg overflow-hidden short:p-0.5">
							{switchWindow(window)}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default InfoComponents;
