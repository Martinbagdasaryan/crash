import { useEffect, useState } from 'react';
import { cn, dataFormater } from '../../utils/helper';
import { useSocket } from '../../socket/SocketContext';
import { GET_ACTIONS, SEND_ACTIONS } from '../../api/connnectionEnum';
import { useUrlParams } from '../../hooks/useUrlParams';
import { useT } from '../../lang';
import TableHeader from '../TableHeader';

interface history {
	createdAt: Date;
	winAmount: number;
	odds: number;
	amount: number;
}

const MyBetsHistory: React.FC = () => {
	const { t } = useT();
	const [history, setHistory] = useState<history[]>([]);

	const socket = useSocket();
	const { playerId } = useUrlParams();

	useEffect(() => {
		if (!playerId || !socket) return;

		socket.emit(SEND_ACTIONS.MyBetsHistory, { playerId });

		const handler = (data: history[]) => setHistory(data);
		socket.on(GET_ACTIONS.MyBetsHistory, handler);

		return () => {
			socket.off(GET_ACTIONS.MyBetsHistory, handler);
		};
	}, [playerId, socket]);

	return (
		<>
			<TableHeader headers={['data', 'bets', 'coefficient', 'win']} />
			<div className="w-full overflow-y-scroll h-full flex gap-[5px] p-1 short:gap-0.5 flex-col">
				{history.length > 0 ? (
					history.map((bet, index) => (
						<div
							key={index}
							className={cn(
								'flex w-full h-10 bg-gray-800 rounded-lg font-semibold border-transparent border short:p-0.5 short:text-3.5 short:h-[30px] justify-center items-center',
								{
									'border-green-500': !!+bet.winAmount,
								},
							)}
						>
							<div className="flex justify-center items-center rounded-lg p-4 w-[30%] h-full short:p-0.5 text-[12px] short:text-[10px]">
								{dataFormater(bet.createdAt)}
							</div>
							<div className="flex justify-center items-center rounded-lg p-4 w-[30%] h-full short:p-0.5">
								{bet.amount}
							</div>
							<div className="rounded-lg p-4 w-[30%] h-full flex justify-center items-center short:p-0.5">
								{bet.odds ? bet.odds : '-'}
							</div>
							<div className="rounded-lg p-4 w-[30%] h-full flex justify-center items-center short:p-0.5">
								{bet.winAmount ? bet.winAmount : '-'}
							</div>
						</div>
					))
				) : (
					<div className="flex w-full h-10rounded-lg font-semibold border-transparent justify-center items-center">
						{t('no_bets_placed')}
					</div>
				)}
			</div>
		</>
	);
};

export default MyBetsHistory;
