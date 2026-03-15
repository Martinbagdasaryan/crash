import { useT } from '../../lang';

interface TableHeaderProps {
	headers: string[];
}

const TableHeader: React.FC<TableHeaderProps> = ({ headers }) => {
	const { t } = useT();
	return (
		<div className="flex w-full h-10 bg-transparent rounded-lg font-semibold p-1 short:h-7 short:p-0 justify-center items-center">
			{headers.map((i) => (
				<div
					key={i}
					className="flex justify-center p-1 h-full text-nowrap short:p-0.5 short:text-3.5"
					style={{ width: `${100 / headers.length}%` }}
				>
					<span className="overflow-hidden text-ellipsis text-left">{t(i)}</span>
				</div>
			))}
		</div>
	);
};

export default TableHeader;
