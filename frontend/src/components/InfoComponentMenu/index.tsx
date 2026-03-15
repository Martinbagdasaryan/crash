import { useDispatch, useSelector } from 'react-redux';
import { setIsMenuOpen, setIsMobileMenu } from '../../redux/selects/settings';
import { useState } from 'react';
import MyBetsHistory from '../MyBetsHistory';
import HighestBets from '../HighestBets';
import Settings from '../Settings';
import ProvablyFair from '../ProvablyFair.tsx';
import { useT } from '../../lang';
import { selectSettings } from '../../redux/selector';

const InfoComponentsMenu = () => {
	const { t } = useT();
	const dispatch = useDispatch();
	const [isActive, setIsActive] = useState<number | null>(null);
	const { isMenuOpen } = useSelector(selectSettings);

	const items = [
		{
			type: 0,
			text: t('leaderboard'),
		},
		{
			type: 1,
			text: t('my_bets'),
		},
		{
			type: 2,
			text: t('provably_fair'),
		},
		{
			type: 3,
			text: t('settings'),
		},
		{
			type: 4,
			text: t('back'),
		},
	];

	const close = () => {
		dispatch(setIsMenuOpen(false));
		dispatch(setIsMobileMenu(false));
	};

	const switchWindow = (type: number | null) => {
		switch (type) {
			case 0:
				return (
					<div className="flex flex-col p-1 short:p-0.5 items-center w-full h-full overflow-hidden bg-gray-950/40 border border-gray-950/50 rounded-lg">
						<HighestBets />
					</div>
				);
			case 1:
				return (
					<div className="flex flex-col p-1 short:p-0.5 items-center w-full h-full overflow-hidden bg-gray-950/40 border border-gray-950/50 rounded-lg">
						<MyBetsHistory />
					</div>
				);
			case 2:
				return <ProvablyFair />;
			case 3:
				return <Settings />;
			case 4:
				window.history.back();
				return null;
			default:
				return null;
		}
	};

	return (
		<div className="w-full h-full bg-sky-950 absolute top-0 right-0 flex flex-col px-1 pb-1 items-center z-20">
			{isActive === null ? (
				<>
					<div className='w-full flex justify-end mt-3 mr-3 h-fit'>
						<button onClick={close} className="flex justify-end w-5 h-5">
							<img src={`/icons/close.svg`} className={`w-6 h-6 short:w-4 short:h-4`} />
						</button>
					</div>
					{items.map((item) => (
						<button
							onClick={() => setIsActive(item.type)}
							className="w-full h-[60px] border-b border-gray-500 text-[18px] font-[700] short:h-10 short:text-3"
							key={item.type}
						>
							{item.text}
						</button>
					))}
				</>
			) : (
				<>
					<div className="flex flex-col justify-center items-center w-full mb-3">
						<button
							onClick={() => setIsActive(null)}
							className="flex justify-center items-center self-start gap-2 ml-3 mb-1 mt-3 text-[700] short:mt-3"
						>
							<img src={`/icons/leftArrow.svg`} className={`w-6 h-6 short:w-4 short:h-4`} />
							{t('back')}
						</button>
						<p className="text-[18px] font-[700] short:text-3">{items[isActive].text}</p>
					</div>
					{switchWindow(isActive)}
				</>
			)}
		</div>
	);
};

export default InfoComponentsMenu;
