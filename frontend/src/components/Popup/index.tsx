import React, { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPopupType } from '../../redux/selects/settings';
import { POPUP_TYPE } from '../../redux/selects/types';
import { selectSettings } from '../../redux/selector';
import AutoBetPopup from './AutoBet';

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
		<div className="fixed top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center z-50">
			<button className="fixed top-4 right-4 w-10 h-10" onClick={closePopup}>
				<img src={`/icons/close.svg`} className={`w-6 h-6`} />
			</button>
			<div className="bg-blue-950/80 p-5 shadow-[5px_5px_48px_-5px] shadow-white/50 w-[400px] h-[300px] mob:w-full mob:h-[250px] short:h-full short:w-[400px] rounded-xl">
				{switchPopup(popupType)}
			</div>
		</div>
	);
};
export default Popup;
