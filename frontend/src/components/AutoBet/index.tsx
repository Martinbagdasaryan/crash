import Switch from '../Switch';
import { useDispatch, useSelector } from 'react-redux';
import { setPopupIndex, setPopupType, setWindowInfo } from '../../redux/selects/settings';
import { POPUP_TYPE } from '../../redux/selects/types';
import { selectSettings } from '../../redux/selector';

interface AutoBetProps {
	index: number;
}

const AutoBet: React.FC<AutoBetProps> = ({ index }) => {
	const dispatch = useDispatch();
	const { windowInfo } = useSelector(selectSettings);
	const { isAutoBetCount } = windowInfo[index];

	const togglePopup = () => {
		dispatch(setPopupType(POPUP_TYPE.AutoBet));
		dispatch(setPopupIndex(index));
	};

	return (
		<>
			{!!isAutoBetCount && (
				<span className="absolute -left-5 cursor-pointer text-[18px] p-2" onClick={togglePopup}>
					⋮
				</span>
			)}
			{!!isAutoBetCount && isAutoBetCount < 101 && !!(isAutoBetCount - 1) && (
				<div className="flex justify-center items-center w-5 h-5 rounded-full bg-black/50 absolute -top-3 right-10">
					<span className="font-[600] text-[10px]">{isAutoBetCount - 1}</span>
				</div>
			)}
			<Switch index={index} />
		</>
	);
};

export default AutoBet;
