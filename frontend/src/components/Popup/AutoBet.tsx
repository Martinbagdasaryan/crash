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
		<div className="w-full h-full flex flex-col justify-between">
			<div className="w-full h-[20%] text-center text-[18px] font-[700]">Auto play</div>

			<div className="w-full h-[60%] flex flex-col justify-center items-center">
				<div className=" font-[400] flex flex-col justify-center items-center gap-1">
					<span>Number of rounds: {roundCount || lastCount - 1}</span>
					<span>Total bet: {totalBet || betAmount * lastCount - 1}</span>
				</div>
				<div className="flex justify-around items-center w-full h-full gap-1 mob:w-full max-w-[400px]">
					{roundCounts.map((ro) => (
						<button
							key={ro}
							onClick={() => {
								setRoundCount(ro);
								setTotalBet(betAmount * ro);
							}}
							className={cn('w-14 h-9 rounded-full bg-blue-900 shadow-lg font-[600]', {
								'bg-blue-600': roundCount === ro,
							})}
						>
							{ro}
						</button>
					))}
				</div>
			</div>
			<div className="w-full h-[20%] flex justify-center items-center">
				<button
					onClick={onStart}
					className={cn(
						'relative flex justify-center items-center rounded-lg h-full w-full max-w-[400px] overflow-hidden inset-shadow-sm font-[600] bg-blue-600',
					)}
				>
					Start
				</button>
			</div>
		</div>
	);
};

export default AutoBetPopup;
