import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectSettings } from '../../redux/selector';

const GameLoading: React.FC = () => {
	const { isSocketConnected } = useSelector(selectSettings);
	const [isOpenGame, setIsOpenGame] = useState(false);

	useEffect(() => {
		const i = setTimeout(() => {
			setIsOpenGame(true);
		}, 3000);
		return () => clearTimeout(i);
	}, []);

	return isSocketConnected && isOpenGame ? null : (
		<div className="fixed inset-0 flex flex-col items-center justify-center bg-[#050a09] z-[200] overflow-hidden">
			<div className="absolute w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

			<div className="relative flex flex-col items-center animate-pulseScale">
				<svg width="200" height="200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="12" cy="12" r="9" stroke="#10b981" stroke-width="1" stroke-dasharray="4 4" />
					<path d="M12 6L17.2 9V15L12 18L6.8 15V9L12 6Z" fill="#10b981" fill-opacity="0.2" stroke="#10b981" stroke-width="2" />
					<path d="M13 8L9 13H12L11 16L15 11H12L13 8Z" fill="#10b981">
						<animate attributeName="opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" />
					</path>
				</svg>
				<div className="mb-4 flex flex-col items-center gap-1">
					<span className="text-emerald-500 font-black uppercase tracking-[0.5em] text-xs">
						System Initializing
					</span>
					<span className="text-emerald-500/40 text-[10px] font-mono animate-pulse">
						establishing socket connection...
					</span>
				</div>

				<div className="w-64 h-2 bg-emerald-950/50 rounded-full border border-emerald-500/10 overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]">
					<div
						className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)] transition-all duration-200 animate-lineAnimat"
					/>
				</div>
			</div>

			<div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-emerald-500/20 rounded-tl-3xl" />
			<div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-emerald-500/20 rounded-br-3xl" />
		</div>
	);
};

export default GameLoading;
