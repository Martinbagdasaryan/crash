import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCoeficient } from "../../redux/selector";
import CrashGrid from "../CrashGrid";

// --- Основной компонент анимации ---
const CrashAnimation: React.FC = () => {
    // Получаем коэффициент из Redux
    const { coeficient } = useSelector(selectCoeficient);

    // Размеры рабочего поля SVG
    const width = 600;
    const height = 400;
    
    // Отступы для меток осей
    const paddingLeft = 66;
    const paddingBottom = 64;
    const paddingTop = 40;
    const paddingRight = 40;

    // Оптимизированный расчет путей через useMemo
    const { linePath, areaPath, endPoint } = useMemo(() => {
        const plotWidth = width - paddingLeft - paddingRight;
        const plotHeight = height - paddingTop - paddingBottom;
        const startX = paddingLeft;
        const startY = height - paddingBottom;

        // Если игры нет, рисуем начальную точку на оси
        if (!coeficient || coeficient < 1) {
            return { 
                line: `M ${startX},${startY}`, 
                area: "", 
                endPoint: { x: startX, y: startY } 
            };
        }

        const points: [number, number][] = [];
        const steps = 60; // Количество точек для плавности кривой
        
        // Максимальный коэффициент, который мы сейчас показываем (для масштаба)
        // Если коэффициент маленький (до 3х), используем фиксированный масштаб
        const currentYScaleMax = Math.max(3.0, coeficient);
        
        // Как быстро график уходит вправо (чем больше коэф, тем больше plotWidth заполняем)
        const xScaleProgress = Math.min(1.0, (coeficient - 1) / (currentYScaleMax - 1));

        for (let i = 0; i <= steps; i++) {
            const t = i / steps; // Прогресс шага от 0 до 1
            
            // X рассчитываем так, чтобы график рос вправо по мере роста коэффициента
            const currentX = startX + t * plotWidth * xScaleProgress;
            
            // Y рассчитываем по параболической траектории, нормализованной под текущий масштаб
            const normalizedVal = (Math.pow(1.2, t * 7 * xScaleProgress) - 1) / (Math.pow(1.2, 7) - 1);
            const currentY = startY - normalizedVal * plotHeight;
            
            // Защита от выхода за границы
            const safeY = Math.max(paddingTop, currentY);
            points.push([currentX, safeY]);
        }

        const [lastX, lastY] = points[points.length - 1];
        
        const lPath = `M ${points.map(p => p.join(',')).join(" L ")}`;
        const aPath = `${lPath} L ${lastX},${startY} L ${startX},${startY} Z`;

        return { 
            linePath: lPath, 
            areaPath: aPath, 
            endPoint: { x: lastX, y: lastY } 
        };
    }, [coeficient]);

    return (
        <div className="flex justify-center items-center z-0 h-full w-full absolute top-0 left-0 pb-[100px] mob:pb-0">
            {/* Контейнер монитора */}
            <div className="relative overflow-hidden flex justify-center items-center h-[450px] w-[580px] rounded-[2rem] border border-emerald-500/10 bg-[#050a09] shadow-[0_0_80px_rgba(0,0,0,0.8)] mob:rounded-none mob:w-full mob:h-full">
                
                {/* Цифровой фон (Шум) */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                {/* Главный коэффициент */}
                {!!coeficient && (
                    <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                        <div className="text-center translate-y-[-10px]">
                            <h1 className="text-[90px] font-[1000] italic tracking-tighter text-white drop-shadow-[0_0_35px_rgba(16,185,129,0.7)] animate-numberPulsate leading-none">
                                <span className="text-emerald-500 mr-2 text-[50px]">x</span>
                                {coeficient.toFixed(2)}
                            </h1>
                            <p className="text-emerald-500/40 font-mono text-[10px] uppercase tracking-[0.5em]">
                                Voltage Output
                            </p>
                        </div>
                    </div>
                )}

                {/* Сетка */}
                <CrashGrid coeficient={coeficient || 1} />

                {/* SVG Графика */}
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full z-10 overflow-visible">
                    <defs>
                        {/* Градиент под линией */}
                        <linearGradient id="electricGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>

                        {/* Неоновое свечение */}
                        <filter id="neonGlow" x="-25%" y="-25%" width="150%" height="150%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Заливка под графиком */}
                    <path
                        d={areaPath}
                        fill="url(#electricGrad)"
                        className="transition-all duration-100 ease-linear"
                    />

                    {/* Основная линия (Разряд) */}
                    <path
                        d={linePath}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                        filter="url(#neonGlow)"
                        className="transition-all duration-100 ease-linear"
                    />

                    {/* Точка контакта (Курсор) */}
                    <g className="transition-all duration-100 ease-linear">
                        <circle
                            cx={endPoint.x}
                            cy={endPoint.y}
                            r="14"
                            className="fill-emerald-500/15 animate-ping"
                        />
                        <circle
                            cx={endPoint.x}
                            cy={endPoint.y}
                            r="7"
                            className="fill-white shadow-[0_0_15px_#10b981]"
                        />
                    </g>
                </svg>

                {/* Эффект сканирующих линий (Scanlines) */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px]" />
            </div>
        </div>
    );
};

export default CrashAnimation;