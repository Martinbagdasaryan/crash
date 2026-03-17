import { useDispatch, useSelector } from 'react-redux';
import { selectPlayer, selectSettings } from '../../redux/selector';
import { useEffect, useRef } from 'react';
import { cn } from '../../utils/helper';
import { setWindowInfoWinAmount } from '../../redux/selects/settings';

const WIN_SOUND_URL = '/audio/win.wav';

const WinPopup = () => {
    const { windowInfo } = useSelector(selectSettings);
    const { currencyId } = useSelector(selectPlayer);
    const dispatch = useDispatch();

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const prevWinAmounts = useRef<string>('');

    useEffect(() => {
        audioRef.current = new Audio(WIN_SOUND_URL);
    }, []);

    useEffect(() => {
        const currentAmountsString = windowInfo.map((w) => w.winAmount).join(',');
        
        if (currentAmountsString !== prevWinAmounts.current) {
            windowInfo.forEach((win, index) => {
                const prevArray = prevWinAmounts.current.split(',');
                const wasZero = prevArray[index] === '0' || prevArray[index] === undefined;

                if (win.winAmount > 0 && wasZero) {
                    if (audioRef.current) {
                        audioRef.current.currentTime = 0;
                        audioRef.current.play().catch(err => console.log("Audio play blocked", err));
                    }

                    setTimeout(() => {
                        dispatch(setWindowInfoWinAmount({ index, winAmount: 0 }));
                    }, 5000);
                }
            });
            
            prevWinAmounts.current = currentAmountsString;
        }
    }, [windowInfo, dispatch]);

    return windowInfo
        .filter((info) => info.winAmount > 0)
        .map((info, idx) => (
            <div
                key={info.index}
                className={cn('absolute left-0 flex justify-center w-full h-fit z-[60] animate-winAppear', {
                    'top-4': idx === 0,
                    'top-24': idx === 1,
                })}
            >
                <div className="relative flex flex-col justify-center items-center px-8 py-2 min-w-[280px] rounded-full overflow-hidden bg-emerald-500 border-2 border-white/30 shadow-[0_0_50px_rgba(16,185,129,0.8)] mob:min-w-[220px]">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shine" />
                    <h2 className="text-[14px] text-black font-black uppercase tracking-[0.3em] mb-0.5 drop-shadow-sm">
                        You Win
                    </h2>
                    <div className="flex gap-2 items-center text-black">
                        <span className="font-black text-lg opacity-70">{currencyId}</span>
                        <p className="text-3xl font-[1000] tracking-tighter italic">
                            {info.winAmount.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
        ));
};

export default WinPopup;