import React, { useEffect, useState } from 'react';
import { selectSettings } from '../../redux/selector';
import { useSelector } from 'react-redux';

const OrientationLock: React.FC = () => {
    const [isPortrait, setIsPortrait] = useState(false);
    const { isMobile } = useSelector(selectSettings);

    useEffect(() => {
        const checkOrientation = () => {
            setIsPortrait(window.innerHeight < window.innerWidth);
        };

        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        return () => window.removeEventListener('resize', checkOrientation);
    }, []);

    if (isMobile ? !isPortrait && isMobile : !isMobile) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#050a09] px-10 text-center">
            {/* Фоновое свечение */}
            <div className="absolute w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />

            <div className="relative flex flex-col items-center gap-6">
                {/* Анимированная иконка телефона */}
                <div className="relative w-20 h-36 border-4 border-emerald-500/20 rounded-[2.5rem] flex items-center justify-center animate-rotateDevice">
                    <div className="w-12 h-1 bg-emerald-500/20 rounded-full absolute top-4" />
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    >
                        <path
                            d="M12 4V2L15 5L12 8V6C8.13 6 5 9.13 5 13C5 14.38 5.39 15.68 6.06 16.78L4.61 18.23C3.61 16.71 3 14.92 3 13C3 8.03 7.03 4 12 4ZM12 20C15.87 20 19 16.87 19 13C19 11.62 18.61 10.32 17.94 9.22L19.39 7.77C20.39 9.29 21 11.08 21 13C21 17.97 16.97 22 12 22V24L9 21L12 18V20Z"
                            fill="currentColor"
                        />
                    </svg>
                    <div className="w-2 h-2 bg-emerald-500/20 rounded-full absolute bottom-4" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-emerald-500 font-black uppercase tracking-[0.3em] text-xl">
                        Electric Crash
                    </h2>
                    <p className="text-white/60 font-mono text-xs leading-relaxed uppercase tracking-widest">
                        Please rotate your device <br /> to landscape mode
                    </p>
                </div>

                {/* Декоративная линия пульса */}
                <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent animate-pulse" />
            </div>
        </div>
    );
};

export default OrientationLock;