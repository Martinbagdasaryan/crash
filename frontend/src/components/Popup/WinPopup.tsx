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
		.map((info) => (
			<div
				key={info.index}
				className={cn('absolute top-2 left-0 flex justify-center w-[75%] h-fit z-50 mob:w-full', {
					'top-20 short:top-[60px]': info.index === 1 && !!windowInfo[0].winAmount,
				})}
			>
				<div className="bg-gradient-to-r from-amber-400 via-[#B767F8] to-[#FA00D0] border-blue-950 px-2 rounded-full max-w-[350px] min-w-[300px] mob:max-w-[250px] mob:min-w-[200px] max-h-20 min-h-[50px] short:h-[50px] flex flex-col justify-center items-center">
					<h2 className="text-[18px] text-[#fcbd20] font-bold flex gap-2">
						<p>You win</p>
					</h2>
					<div className="flex gap-2 items-center">
						<span className="font-bold w-fit h-fit">{currencyId}</span>
						<p className="font-bold">{info.winAmount}</p>
					</div>
				</div>
			</div>
		));
};

export default WinPopup;
