import './style.css';
import { useSelector } from 'react-redux';
import { selectGame, selectSettings } from '../../redux/selector';
import { useEffect, useRef, useState } from 'react';

const BettingTime = () => {
	const soundRef = useRef<HTMLAudioElement | null>(null);
	const [time, setTime] = useState(0);
	const { bettingTime } = useSelector(selectGame);
	const { soundVolume, overall } = useSelector(selectSettings);

	useEffect(() => {
		setTime(bettingTime);
	}, [bettingTime]);

	useEffect(() => {
		if (time <= 0) return;
		const interval = setInterval(() => {
			setTime((prev) => prev - 1);
		}, 1000);
		return () => clearInterval(interval);
	}, [time]);

	// Логика звука остается прежней...
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (!soundRef.current) return;
			if (document.hidden) {
				soundRef.current.volume = 0;
			} else {
				soundRef.current.volume = soundVolume * overall;
				if (time > 0) soundRef.current.play().catch(() => { });
			}
		};
		handleVisibilityChange();
		document.addEventListener('visibilitychange', handleVisibilityChange);
		return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
	}, [soundVolume, overall, time]);

	return time <= 0 ? null : (
		<div className="absolute inset-0 z-[30] flex items-center justify-center bg-radial-gradient from-transparent via-[#050a09]/30 to-[#050a09]/70 backdrop-blur-[2px] h-[55%] w-[44%] top-[80px] left-[28%] pt-20 mob:w-full mob:left-0">
			<audio ref={soundRef} src="/audio/timer.wav" preload="auto" loop />

			<div className="relative flex flex-col items-center justify-center">

				<span className="absolute -top-12 text-emerald-500/50 font-black uppercase tracking-[0.4em] text-[12px] animate-pulse">
					Waiting for bets
				</span>

				<div className="relative flex items-center justify-center w-[160px] h-[160px]">

					<div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)] animate-ping opacity-20" />

					<div className="absolute inset-0 rounded-full border-[6px] border-emerald-950/50 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
						<div
							className="animationElement w-full h-full rounded-full border-[6px] border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
							style={{
								animation: `timer-spin ${bettingTime}s linear forwards`,
								clipPath: 'polygon(50% 50%, -50% -50%, 150% -50%, 150% 150%, -50% 150%, -50% -50%)'
							}}
						/>
					</div>

					<div className="relative z-10 flex flex-col items-center">
						<span
							key={time}
							className="text-[64px] font-[1000] italic text-white leading-none drop-shadow-[0_0_20px_rgba(16,185,129,0.6)] animate-numberPulsate"
						>
							{time}
						</span>
					</div>
				</div>

				<div className="mt-8 flex gap-2">
					{[...Array(3)].map((_, i) => (
						<div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
					))}
				</div>
			</div>
		</div>
	);
};

export default BettingTime;
