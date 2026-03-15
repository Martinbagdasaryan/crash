import { useEffect } from 'react';
import AddAmount from '../AddAmount';
import BetsAmount from '../BetsAmount';
import { selectGame, selectSettings } from '../../redux/selector';
import { useDispatch, useSelector } from 'react-redux';
import { setWindowInfo } from '../../redux/selects/settings';
import { GAME_STATE } from '../../utils/enums';

interface IBetsWindowProps {
	index: number;
}

const BetsWindow: React.FC<IBetsWindowProps> = ({ index }) => {
	const { state } = useSelector(selectGame);
	const dispatch = useDispatch();
	const { isAutoBetCount } = useSelector(selectSettings).windowInfo[index];

	const setBetAmount = (amount: number) => {
		dispatch(
			setWindowInfo({
				index,
				amount,
				isKeybordOpen: false,
				type: null,
			}),
		);
	};

	useEffect(() => {
		if (!!isAutoBetCount && isAutoBetCount > 0 && state === GAME_STATE.WaitingForBets) {
			dispatch(
				setWindowInfo({
					index,
					isKeybordOpen: false,
					type: null,
					isAutoBetCount: isAutoBetCount - 1,
				}),
			);
		}
	}, [state]);

	return (
		<div className="flex flex-col gap-4 items-center w-1/2 mob:gap-3 short:gap-1">
			<BetsAmount index={index} setBetAmount={setBetAmount} />
			<AddAmount index={index} setBetAmount={setBetAmount} />
		</div>
	);
};

export default BetsWindow;
