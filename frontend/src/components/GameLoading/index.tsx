import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectSettings } from '../../redux/selector';

const GameLoading: React.FC = () => {
	const { isSocketConnected } = useSelector(selectSettings);
	const [isOpenGame, setIsOpenGame] = useState(false);

	useEffect(() => {
		const i = setTimeout(() => {
			setIsOpenGame(true);
		}, 2000);
		return () => clearTimeout(i);
	}, []);

	return isSocketConnected && isOpenGame ? null : (
		<div className="sticky flex flex-col items-center justify-center h-screen bg-sky-950 z-50">
			<img
				src="/icons/Airplane.svg"
				alt="Game Logo"
				className="w-[200px] h-[150px] mb-4 animate-spin-slow"
			/>
			<div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
				<div className="h-full bg-gray-100 transition-all duration-200 animate-lineAnimat" />
			</div>
		</div>
	);
};

export default GameLoading;
