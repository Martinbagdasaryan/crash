import { useSelector } from 'react-redux';
import { selectCoeficient } from '../../redux/selector';
import { memo } from 'react';

const ShowCoeficient: React.FC = () => {
	return (
		<div className="absolute bottom-44 w-[70%] flex justify-center items-center h-[150px] z-10 mob:h-[100px] mob:w-full mob:bottom-48 short:bottom-28 short:h-[100px] short:w-[75%] short:mob:bottom-24">
			<div className="flex items-center h-full w-full justify-center">
				<Number />
			</div>
		</div>
	);
};

export default memo(ShowCoeficient);

const Number = () => {
	const { coeficient } = useSelector(selectCoeficient);

	if (!coeficient) return null;

	return <h2 className="text-lg text-[100px] mob:text-[60px]">{coeficient}x</h2>;
};
