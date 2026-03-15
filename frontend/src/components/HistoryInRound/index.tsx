import { useSelector } from 'react-redux';
import { selectGame } from '../../redux/selector';
import { cn, maskNumber } from '../../utils/helper';
import { useT } from '../../lang';
import TableHeader from '../TableHeader';

const HistoryInRound: React.FC = () => {
	const { t } = useT();
	const { allBets } = useSelector(selectGame);

	return (
		<>
			<TableHeader headers={['player_id', 'bets', 'coefficient', 'win']} />
			<div className="w-full overflow-y-scroll h-full flex gap-[5px] p-1 short:gap-0.5 flex-col">
				{allBets.length > 0 ? (
					allBets.map((bet, index) => {
						const isWin = !!bet.win ? +bet.win : 0;

						return (
							<div
								key={index}
								className={cn(
									'flex w-full h-10 bg-gray-800 rounded-lg font-semibold border-transparent border short:p-0.5 short:text-3.5 short:h-[30px] justify-center items-center',
									{
										'border-green-500': !!isWin,
									},
								)}
							>
								<div className="flex justify-center items-center rounded-lg p-4 w-[30%] h-full short:p-0.5">
									{maskNumber(bet.playerId)}
								</div>
								<div className="flex justify-center items-center rounded-lg p-4 w-[30%] h-full short:p-0.5">
									{bet.amount}
								</div>
								<div className="rounded-lg p-4 w-[30%] h-full flex justify-center items-center short:p-0.5">
									{bet.profit ? bet.profit : '-'}
								</div>
								<div className="rounded-lg p-4 w-[30%] h-full flex justify-center items-center short:p-0.5">
									{bet.win || '-'}
								</div>
							</div>
						);
					})
				) : (
					<div className="flex w-full h-10rounded-lg font-semibold border-transparent justify-center items-center">
						<span className="overflow-hidden text-ellipsis text-left">{t('no_bets_placed')}</span>
					</div>
				)}
			</div>
		</>
	);
};

export default HistoryInRound;
