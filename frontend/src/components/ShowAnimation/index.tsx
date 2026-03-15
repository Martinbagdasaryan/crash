import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCoeficient } from "../../redux/selector";
import CrashGrid from "../CrashGrid";

// --- Основной компонент анимации ---
const CrashAnimation: React.FC = () => {
    const { coeficient } = useSelector(selectCoeficient);


    // Используем единые константы для обоих SVG
    const width = 600;
    const height = 400;

    const paddingLeft = 66;
    const paddingBottom = 60;
    const paddingTop = 40;
    const paddingRight = 40;
    const { linePath, areaPath, endPoint } = useMemo(() => {
        const plotWidth = width - paddingLeft - paddingRight;
        const plotHeight = height - paddingTop - paddingBottom;
        const startX = paddingLeft;
        const startY = height - paddingBottom;

        if (!coeficient || coeficient < 1) {
            return { linePath: `M ${startX},${startY}`, areaPath: "", endPoint: { x: startX, y: startY } };
        }

        const points: [number, number][] = [];
        const steps = 60;

        // ВАЖНО: этот максимум должен быть ТАКИМ ЖЕ как в CrashGrid
        const currentYScaleMax = Math.max(2.0, coeficient);

        // Прогресс по горизонтали (насколько график заполнил экран)
        const xScaleProgress = Math.min(1.0, (coeficient - 1) / (currentYScaleMax - 1));

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const currentX = startX + t * plotWidth * xScaleProgress;

            // 1. Считаем значение в этой точке (от 1 до coeficient)
            // Используем Math.pow(t, 1.5) для легкого изгиба, но в конце пути t=1, значит val = coeficient
            const currentVal = 1 + (coeficient - 1) * Math.pow(t, 1.5);

            // 2. Считаем позицию Y относительно шкалы от 1 до currentYScaleMax
            const yPercent = (currentVal - 1) / (currentYScaleMax - 1);
            const currentY = startY - (yPercent * plotHeight);

            points.push([currentX, currentY]);
        }

        const [lastX, lastY] = points[points.length - 1];
        const lPath = `M ${points.map(p => p.join(',')).join(" L ")}`;
        const aPath = `${lPath} L ${lastX},${startY} L ${startX},${startY} Z`;

        return { linePath: lPath, areaPath: aPath, endPoint: { x: lastX, y: lastY } };
    }, [coeficient]);

    return (
        <div className="flex justify-center items-center z-0 h-full w-full absolute top-0 left-0 pb-[100px] mob:pb-0">
            <div className="relative overflow-hidden flex justify-center items-center h-[450px] w-[580px] rounded-[2rem] border border-emerald-500/10 bg-[#050a09] shadow-[0_0_80px_rgba(0,0,0,0.8)] mob:rounded-none mob:w-full mob:h-full">

                <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                {!!coeficient && (
                    <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                        <div className="text-center -translate-y-4">
                            <h1 className="text-[80px] mob:text-[60px] font-[1000] italic tracking-tighter text-white drop-shadow-[0_0_35px_rgba(16,185,129,0.7)]">
                                <span className="text-emerald-500 mr-2 text-[40px]">x</span>
                                {coeficient.toFixed(2)}
                            </h1>
                        </div>
                    </div>
                )}

                {/* Сетка - теперь передаем ей те же размеры */}
                <CrashGrid
                    coeficient={coeficient || 1}
                    width={width}
                    height={height}
                    paddingLeft={paddingLeft}
                    paddingBottom={paddingBottom}
                />

                {/* График */}
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    preserveAspectRatio="xMidYMid meet"
                    className="w-full h-full z-10 overflow-visible absolute inset-0"
                >
                    <defs>
                        <linearGradient id="electricGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                        <filter id="neonGlow" x="-25%" y="-25%" width="150%" height="150%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <path d={areaPath} fill="url(#electricGrad)" className="transition-all duration-100 ease-linear" />
                    <path d={linePath} fill="none" stroke="#10b981" strokeWidth="4" filter="url(#neonGlow)" className="transition-all duration-100 ease-linear" />

                    <g className="transition-all duration-100 ease-linear">
                        <circle cx={endPoint.x} cy={endPoint.y} r="12" className="fill-emerald-500/20 animate-ping" />
                        <circle cx={endPoint.x} cy={endPoint.y} r="6" className="fill-white shadow-[0_0_15px_#10b981]" />
                    </g>
                </svg>

                <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px]" />
            </div>
        </div>
    );
};


export default CrashAnimation;