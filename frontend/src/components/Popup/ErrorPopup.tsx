import { useDispatch, useSelector } from 'react-redux';
import { selectError } from '../../redux/selector';
import { useEffect } from 'react';
import { setError } from '../../redux/selects/error';

const ErrorPopup = () => {
	const error = useSelector(selectError);
	const dispatch = useDispatch();

	useEffect(() => {
		if (!error.code) return;
		const i = setTimeout(() => {
			dispatch(setError({ messages: '', code: 0 }));
		}, 5000);
		return () => clearTimeout(i);
	}, [error.code]);

	return !error.code ? null : (
		<div className="absolute top-2 left-0 flex justify-center w-[70%] h-fit z-50 mob:w-full">
			<div className="bg-[#0012228a] px-2 rounded-lg border-[#b91c1c92] border-2 h-[85px] w-[350px] flex flex-col justify-center mob:w-1/2">
				<h2 className="text-lg text-red-700 font-bold mb-2">Error</h2>
				<p>{error.messages}</p>
			</div>
		</div>
	);
};

export default ErrorPopup;
