import styles from './styles.module.css';
import { selectSettings } from '../../../redux/selector';
import { useSelector } from 'react-redux';
import { useT } from '../../../lang';

interface props {
	text: string;
	data: string;
}

const Value = ({ text, data }: props) => {
	return (
		<div className="w-full h-14 bg-[#000f2e] font-bold flex justify-start items-center rounded-t-2xl rounded-b-md px-3 overflow-auto text-nowrap gap-2.5">
			<p>{text}</p> <p>{data}</p>
		</div>
	);
};

export default Value;
