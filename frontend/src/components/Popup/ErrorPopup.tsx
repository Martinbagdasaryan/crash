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
	}, [error.code, dispatch]);

	if (!error.code) return null;

	return (
		/* Анимация появления сверху */
		<div className="absolute top-4 left-0 flex justify-center w-full h-fit z-[100] pointer-events-none animate-slideDown">
			<div className="relative px-4 py-3 rounded-xl border border-red-500/30 bg-[#0a0505]/95 backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.2)] w-[350px] min-h-[80px] flex flex-col justify-center pointer-events-auto mob:w-[90%]">

				{/* Декоративная красная линия сбоку */}
				<div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-red-600 rounded-r-full shadow-[0_0_10px_rgba(220,38,38,0.8)]" />

				<div className="flex items-center gap-2 mb-1">
					{/* Иконка предупреждения (SVG) */}
					<svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
					<h2 className="text-sm text-red-500 font-black uppercase tracking-[0.2em]">
						System Error
					</h2>
				</div>

				<p className="text-gray-300 text-xs font-bold leading-relaxed">
					{error.messages}
				</p>

				{/* Полоса прогресса исчезновения (Таймер) */}
				<div className="absolute bottom-0 left-0 h-[2px] bg-red-500/40 animate-errorProgress" />
			</div>
		</div>
	);
};

export default ErrorPopup;
