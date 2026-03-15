import { useEffect } from 'react';
import { setIsLandscept, setIsMobile } from '../redux/selects/settings';
import { useDispatch } from 'react-redux';

const useSizes = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		const handleResize = () => {
			const mobile = window.innerWidth < 768 || window.innerHeight < 492;
			dispatch(setIsMobile(mobile));
			dispatch(setIsLandscept(window.innerHeight < 492));
		};

		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);
};

export default useSizes;
