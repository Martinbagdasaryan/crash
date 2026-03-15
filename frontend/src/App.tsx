import React, { useEffect } from 'react';
import BetsContainer from './components/BetsContainer';
import InfoComponents from './components/InfoComponents';
import HistoryInfo from './components/HistoryInfo';
import Balance from './components/Balance';
import { useSocketListener } from './hooks/useSocketListener';
import CustomKeyboard from './components/CustomKeyboard';
import { useSelector } from 'react-redux';
import { selectSettings } from './redux/selector';
import Canvas from './components/Canvas';
import ShowCoeficient from './components/ShowCoeficient';
import BettingTime from './components/BettingTime';
import GameLoading from './components/GameLoading';
import useSizes from './hooks/useSizes';
import Popup from './components/Popup';
import ErrorPopup from './components/Popup/ErrorPopup';
import WinPopup from './components/Popup/WinPopup';
import Click from './components/Click';
import { useUrlParams } from './hooks/useUrlParams';
import { useT } from './lang';

const App: React.FC = () => {
	useSocketListener();
	useSizes();
	const { setLang } = useT();
	const { isKeybordOpen } = useSelector(selectSettings);
	const { lang } = useUrlParams();

	useEffect(() => {
		if (lang) setLang(lang);
	}, [lang]);

	return (
		<>
			<Click />
			<GameLoading />
			<ErrorPopup />
			<Canvas />
			<ShowCoeficient />
			<BetsContainer />
			<InfoComponents />
			<HistoryInfo />
			<Balance />
			<BettingTime />
			<Popup />
			<WinPopup />
			{isKeybordOpen && <CustomKeyboard />}
		</>
	);
};

export default App;
