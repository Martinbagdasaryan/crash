import React from 'react';

interface IVolume {
    text: string;
    setVolume: (val: number) => void;
    maxValue: number;
    value: number;
}

const Volume = ({ text, setVolume, maxValue, value }: IVolume) => {
    // Рассчитываем процент заполнения для градиента
    const progress = (value / maxValue) * 100;

    return (
        <div className="flex justify-between items-center w-full group py-2">
            {/* Название параметра */}
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50 font-bold w-[40%] truncate">
                {text}
            </p>

            <div className="relative flex items-center w-[55%] h-6">
                <input
                    onChange={(e) => setVolume(+e.target.value)}
                    type="range"
                    value={value}
                    min={0}
                    max={maxValue}
                    step={0.01}
                    style={{
                        background: `linear-gradient(to right, #10b981 ${progress}%, #10b98120 ${progress}%)`,
                    }}
                    className="
                        w-full h-[4px] appearance-none cursor-pointer rounded-full outline-none
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-3
                        [&::-webkit-slider-thumb]:h-3
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-white
                        [&::-webkit-slider-thumb]:shadow-[0_0_10px_#10b981]
                        [&::-webkit-slider-thumb]:transition-transform
                        [&::-webkit-slider-thumb]:active:scale-125
                        hover:[&::-webkit-slider-thumb]:scale-110
                    "
                />
                
                {/* Значение в процентах (опционально, для точности) */}
                <span className="absolute -top-4 right-0 font-mono text-[9px] text-emerald-500/60">
                    {Math.round(progress)}%
                </span>
            </div>
        </div>
    );
};

export default Volume;