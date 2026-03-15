import React, { Suspense, useEffect, useRef } from 'react';
import { useSocketListener } from './hooks/useSocketListener';
import { useSelector } from 'react-redux';
import { selectSettings } from './redux/selector';
import useSizes from './hooks/useSizes';
import { useUrlParams } from './hooks/useUrlParams';
import { useT } from './lang';
import Desktop from './components/Desktop';
import Mobile from './components/Mobile';
import GameLoading from './components/GameLoading';

const App: React.FC = () => {
	useSocketListener();
	useSizes();
	const { setLang } = useT();
	const { lang } = useUrlParams();

	const { isMobile } = useSelector(selectSettings);

	useEffect(() => {
		if (lang) setLang(lang);
	}, [lang]);

	const Device = isMobile ? Mobile : Desktop;

	return (

		<div className='h-full' >
			<GameLoading />

			<Suspense >
				<Device />
			</Suspense>
		</div>
	);
};

export default App;
