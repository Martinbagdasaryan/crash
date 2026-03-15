import { memo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectSettings } from '../../redux/selector';

const Click = () => {
	const soundRef = useRef<HTMLAudioElement | null>(null);
	const { soundVolume, overall } = useSelector(selectSettings);
	if (soundRef.current) {
		soundRef.current.volume = soundVolume * overall;
	}

	useEffect(() => {
		const handleClick = (e: PointerEvent) => {
			const target = e.target as HTMLElement;
			const button = target.closest('button');
			if (!soundRef.current || !button) return;
			soundRef.current.currentTime = 0;
			soundRef.current.play().catch(() => { });
		};

		document.addEventListener('click', handleClick);
		return () => document.removeEventListener('click', handleClick);
	}, []);

	return <audio ref={soundRef} src="/audio/click.wav" preload="auto" />;
};

export default memo(Click);
