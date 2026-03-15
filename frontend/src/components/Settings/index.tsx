import { useT } from '../../lang/index';
import { useDispatch, useSelector } from 'react-redux';
import { setGameVolume, setMusicVolume, setOverallState, setSoundVolume } from '../../redux/selects/settings';
import { useState } from 'react';
import Volume from './volume';
import styles from './style.module.css';
import { selectSettings } from '../../redux/selector';

const Settings = () => {
	const { t, setLang } = useT();
	const dispatch = useDispatch();
	const { musicVolume, gameVolume, soundVolume , overall} = useSelector(selectSettings);
	const languages = ['hy', 'en', 'ru'];

	const setOverall = (value: number) => {
		dispatch(setOverallState(value));
	};

	const setMusic = (value: number) => {
		dispatch(setMusicVolume(value));
	};

	const setGame = (value: number) => {
		dispatch(setGameVolume(value));
	};

	const setSound = (value: number) => {
		dispatch(setSoundVolume(value));
	};

	return (
		<div className="flex flex-col gap-5 px-4 w-full items-center mt-5 short:p-1">
			<Volume text={t('overall_volume')} setVolume={setOverall} maxValue={1} value={overall} />
			<Volume text={t('music')} setVolume={setMusic} maxValue={1} value={musicVolume} />
			<Volume text={t('game_sounds')} setVolume={setGame} maxValue={1} value={gameVolume} />
			<Volume text={t('sound_effects')} setVolume={setSound} maxValue={1} value={soundVolume} />
			<div className="flex justify-between items-center w-[80%]">
				<p className=" left-1 font-[700] w-[calc(100%-120px)] short:short:left-0.5 short:w-[calc(100%-80px)] overflow-hidden text-ellipsis text-left">
					{t('language')}
				</p>
				<select
					className={styles.select}
					name="lang"
					value={localStorage.getItem('i18nextLng') || 'en'}
					onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLang(e.target.value)}
				>
					{languages.map((i) => {
						return (
							<option key={i} value={i}>
								{i}
							</option>
						);
					})}
				</select>
			</div>
		</div>
	);
};

export default Settings;
