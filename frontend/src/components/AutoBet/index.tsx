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
		<div className="relative flex items-center">
			{!!isAutoBetCount && (
				<button
					onClick={togglePopup}
					className="absolute -left-7 w-6 h-6 flex items-center justify-center rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all duration-200"
				>
					<span className="text-[14px] leading-none text-center">⚙</span>
				</button>
			)}

			{!!isAutoBetCount && isAutoBetCount < 101 && !!(isAutoBetCount - 1) && (
				<div className="absolute -top-3 right-[46px] z-10 flex justify-center items-center px-1.5 min-w-[18px] h-[18px] rounded-full bg-emerald-500 border border-white/20 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-fadeIn">
					<span className="font-black text-[9px] text-black">
						{isAutoBetCount - 1}
					</span>
				</div>
			)}

			<div className="relative z-0">
				<Switch index={index} />
			</div>
		</div>
	);
};

export default AutoBet;
