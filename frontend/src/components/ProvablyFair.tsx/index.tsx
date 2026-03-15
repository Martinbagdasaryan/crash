import { selectSettings } from '../../redux/selector';
import { useSelector } from 'react-redux';
import { useT } from '../../lang';
import Value from './Value';

const ProvablyFair = () => {
	const { t } = useT();
	const { provablyFair } = useSelector(selectSettings);

	return (
		<div className="w-full h-full px-4 pt-5 flex flex-col gap-10">
			<Value text={t('your_next_seed') + ':'} data={provablyFair.playerSeed} />
			<Value text={t('servers_next_hash') + ':'} data={provablyFair.serverHash} />
		</div>
	);
};

export default ProvablyFair;
