import React, { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPopupType } from '../../redux/selects/settings';
import { POPUP_TYPE } from '../../redux/selects/types';
import { selectSettings } from '../../redux/selector';
import AutoBetPopup from './AutoBet';
import { cn } from '../../utils/helper';

const Popup: React.FC = () => {
	const dispatch = useDispatch();
	const { popupType } = useSelector(selectSettings);

	const switchPopup = (type: POPUP_TYPE | null) => {
		switch (type) {
			case POPUP_TYPE.AutoBet:
				return <AutoBetPopup />;
			default:
				return null;
		}
	};

	const closePopup = () => {
		dispatch(setPopupType(null));
	};

	if (popupType === null) return null;

	return (
		<div className="fixed top-0 left-0 w-full h-full bg-black/85 backdrop-blur-sm flex items-center justify-center z-[100] animate-fadeIn">

			<button
				className="fixed top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all duration-200 z-[110]"
				onClick={closePopup}
			>
				<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
					<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<div className={cn(
				"relative p-0 w-[420px] h-[340px] rounded-[2rem] overflow-hidden",
				"bg-[#050a09]/95 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.15)]",
				"mob:w-[92%] mob:h-[320px] short:h-[90vh] short:w-[420px] transition-all transform animate-popupShow"
			)}>

				<div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/10 blur-[60px] pointer-events-none"></div>

				<div className="relative z-10 w-full h-full">
					{switchPopup(popupType)}
				</div>

			</div>
		</div>
	);
};
export default Popup;
