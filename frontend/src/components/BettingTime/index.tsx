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

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (!soundRef.current) return;

			if (document.hidden) {
				soundRef.current.volume = 0;
			} else {
				soundRef.current.volume = soundVolume * overall;
				if (time > 0) {
					soundRef.current.play().catch(() => { });
				}
			}
		};

		handleVisibilityChange();

		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, [soundVolume, overall, time]);

	return time <= 0 ? null : (
		<div className="bg-black opacity-95 w-full h-full z-10 absolute top-0">
			<audio ref={soundRef} src="/audio/timer.wav" preload="auto" loop />
			<div className="relative top-0 left-0 flex justify-center items-center pointer-events-none w-full h-full">
				<div
					key={bettingTime}
					className="h-[120px] w-[120px] shadow-[inset_-7px_-20px_39px_rgba(0,0,0,1)] rounded-full"
				>
					<div className="animationElement flex justify-center items-center w-[120px] h-[120px]">
						<div className="timer-section" style={{ animationDuration: `${bettingTime}s` }} />
					</div>
				</div>
				<div className="timer-number-section flex justify-center text-[45px] font-semibold absolute">
					<div>
						<p key={time}>{time}</p>
					</div>
				</div>
			</div>
		</div>
	);
};
export default BettingTime;
