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
			<div className='absolute top-0 left-0 w-full h-fit flex justify-center rounded-none z-20'>
				<div
					className='w-[44%] flex flex-col items-center gap-2 p-2 h-fit bg-gray-950/60 mob:w-full rounded-none'
				>
					<div className="flex justify-around items-center w-full h-11 overflow-hidden bg-sky-950/40 shadow-[inset_0_0_20px_rgba(23,100,250,0.3)] rounded-lg">
						<div
							className='flex justify-end items-center h-full text-left px-1 w-full rounded-lg font-[500]'
						>

							<div className="bg-transparent flex items-center gap-1 w-fit">
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
						</div>
					</div>
				</div>
			</div>
			{isMobileMenu && <InfoComponentsMenu />}
		</>
	);
};

export default Balance;
