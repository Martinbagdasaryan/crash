import React, { useEffect, useState } from "react";
import CrashGrid from "../CrashGrid";
import { useSelector } from "react-redux";
import { selectCoeficient } from "../../redux/selector";

const CrashAnimation: React.FC = () => {
    const { coeficient } = useSelector(selectCoeficient);

    const width = 600;
    const height = 400;
    const padding = 40;

    const getPoints = () => {
        const points = [];
        const steps = 50;
        for (let i = 0; i <= steps; i++) {
            const x = (i / steps) * (width - padding);
            // Улучшенная формула кривой для более плавного взлета
            const val = Math.pow(Math.E, (i / steps) * Math.log(coeficient));
            const y = (height - padding) - ((val - 1) / (coeficient - 0.5)) * (height - 100);
            points.push(`${x + padding},${y}`);
        }
        return points;
    };

    const linePoints = getPoints();
    const linePath = `M ${linePoints.join(" L ")}`;
    // Заливка под графиком
    const areaPath = `${linePath} L ${linePoints[linePoints.length - 1].split(',')[0]},${height - padding} L ${padding},${height - padding} Z`;

    return (
        <div className="flex justify-center items-center z-0 h-full w-full absolute top-0 left-0 pb-[182px]">
            {/* ГЛАВНЫЙ КОНТЕЙНЕР: Глубокий черный с зеленым отливом */}
            <div className="relative overflow-hidden flex justify-center items-center p-4 h-[450px] w-[580px] rounded-[2rem] border border-emerald-500/10 bg-[#050a09] shadow-[0_0_50px_rgba(0,0,0,0.5)] mob:rounded-none mob:w-full mob:h-full">

                {/* Центровка коэффициента */}
                {!!coeficient && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <div className="text-center">
                            <h1 className="text-[72px] font-[1000] italic tracking-tighter text-white drop-shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-numberPulsate">
                                <span className="text-emerald-500 mr-1">x</span>
                                {coeficient.toFixed(2)}
                            </h1>
                        </div>
                    </div>
                )}

                <CrashGrid coeficient={coeficient} />

                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full z-10 overflow-visible">
                    <defs>
                        {/* Градиент заливки: От изумрудного к прозрачному */}
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>

                        {/* Свечение для линии (Filter Glow) */}
                        <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Заливка под графиком */}
                    <path
                        d={areaPath}
                        fill="url(#areaGrad)"
                        className="transition-all duration-100 linear"
                    />

                    {/* Основная линия графика: Чистый изумруд */}
                    <path
                        d={linePath}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#lineGlow)"
                        className="transition-all duration-100 linear"
                    />

                    {/* Точка на конце линии (Курсор графика) */}
                    {linePoints.length > 0 && (
                        <circle
                            cx={linePoints[linePoints.length - 1].split(',')[0]}
                            cy={linePoints[linePoints.length - 1].split(',')[1]}
                            r="6"
                            fill="#fff"
                            className="shadow-lg shadow-emerald-500"
                        />
                    )}
                </svg>
            </div>
        </div>
    );
};
export default CrashAnimation;
