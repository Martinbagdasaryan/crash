import { useSelector } from 'react-redux';
import { useT } from '../../lang';
import { selectSeader } from '../../redux/selector';
import { dataFormater } from '../../utils/helper';
import TableHeader from '../TableHeader';

const HighestBets: React.FC = () => {
	const { t } = useT();
	const { leaderBard } = useSelector(selectSeader);

	return (
		<>
			<TableHeader headers={['data', 'coefficient']} />
			<div className="w-full overflow-y-scroll h-full flex gap-1 p-1 short:gap-0.5 flex-col">
				{leaderBard.map((bet, index) => (
					<div
						key={index}
						className={
							'flex w-full h-10 bg-gray-800 rounded-lg font-semibold border-transparent border shadow-[inset_0_0_4px_black] justify-between short:p-0.5 short:text-3.5 short:h-7'
						}
					>
						<div className="flex justify-center items-center rounded-lg p-4 w-[60%] h-full short:p-0.5 ">
							<span className="overflow-hidden text-ellipsis text-left">
								{dataFormater(bet.createdAt)}
							</span>
						</div>
						<div className="rounded-lg p-4 w-[40%] h-full flex justify-center items-center short:p-0.5">
							<span className="overflow-hidden text-ellipsis text-left">
								{bet.odds ? bet.odds : '-'}
							</span>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default HighestBets;
