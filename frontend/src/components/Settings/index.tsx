import { useT } from '../../lang/index';
import { useDispatch, useSelector } from 'react-redux';
import { setGameVolume, setMusicVolume, setOverallState, setSoundVolume } from '../../redux/selects/settings';
import Volume from './volume';
import styles from './style.module.css';
import { selectSettings } from '../../redux/selector';

const Settings = () => {
    const { t, setLang } = useT();
    const dispatch = useDispatch();
    const { musicVolume, gameVolume, soundVolume, overall } = useSelector(selectSettings);
    const languages = ['hy', 'en', 'ru'];

    // Обработчики теперь чище
    const handleSetVolume = (action: any) => (value: number) => dispatch(action(value));

    return (
        <div className="flex flex-col gap-6 px-6 w-full items-center mt-6 animate-fadeIn">
            {/* Секция громкости */}
            <div className="w-full flex flex-col gap-4">
                <Volume text={t('overall_volume')} setVolume={handleSetVolume(setOverallState)} maxValue={1} value={overall} />
                <div className="grid grid-cols-1 gap-4 w-full opacity-80">
                    <Volume text={t('music')} setVolume={handleSetVolume(setMusicVolume)} maxValue={1} value={musicVolume} />
                    <Volume text={t('game_sounds')} setVolume={handleSetVolume(setGameVolume)} maxValue={1} value={gameVolume} />
                    <Volume text={t('sound_effects')} setVolume={handleSetVolume(setSoundVolume)} maxValue={1} value={soundVolume} />
                </div>
            </div>

            {/* Разделитель (электрическая линия) */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

            {/* Секция выбора языка */}
            <div className="relative flex justify-between items-center w-full bg-[#050a09] border border-emerald-500/10 p-4 rounded-xl shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] group">
                <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                    {t('language')}
                </p>

                <div className="relative">
                    <select
                        className={`${styles.select} appearance-none bg-transparent text-white font-mono text-sm font-bold focus:outline-none cursor-pointer pr-6`}
                        name="lang"
                        value={localStorage.getItem('i18nextLng') || 'en'}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLang(e.target.value)}
                    >
                        {languages.map((i) => (
                            <option key={i} value={i} className="bg-[#050a09] text-white">
                                {i.toUpperCase()}
                            </option>
                        ))}
                    </select>
                    {/* Кастомная стрелочка для select */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500/50">
                        ▼
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;