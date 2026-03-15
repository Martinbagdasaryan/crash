import { useDispatch, useSelector } from 'react-redux';
import { selectPlayer, selectSettings } from '../../redux/selector';
import { setIsMobileMenu } from '../../redux/selects/settings';
import InfoComponentsMenu from '../InfoComponentMenu';

const Balance = () => {
	const { balance, currencyId } = useSelector(selectPlayer);

	const { isMobileMenu } = useSelector(selectSettings);
	const dispatch = useDispatch();

	return (
		<>
			<div className="absolute top-5 right-[31%] z-20 bg-transparent flex items-center gap-1 tab:right-[41%] short:tab:right-[41%] mob:right-1">
				<span className="font-bold w-fit h-fit px-1 py-0.5 rounded-3xl bg-purple-500">
					{currencyId}
				</span>
				<span className="font-bold w-fit h-fit">{(+balance).toFixed(2)}</span>
				<button
					onClick={() => dispatch(setIsMobileMenu(true))}
					className="hidden justify-center items-center bg-transparent opacity-70 rounded-lg hover:opacity-100 mob:flex"
				>
					<img src={`/icons/menu.svg`} className={`w-6 h-6`} />
				</button>
			</div>
			{isMobileMenu && <InfoComponentsMenu />}
		</>
	);
};

export default Balance;
