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
            const val = Math.pow(Math.E, (i / steps) * Math.log(coeficient));
            const y = (height - padding) - ((val - 1) / (coeficient - 0.5)) * (height - 100);
            points.push(`${x + padding},${y}`);
        }
        return points;
    };

    const linePath = `M ${getPoints().join(" L ")}`;
    const areaPath = `${linePath} L ${width},${height - padding} L ${padding},${height - padding} Z`;

    return (<div className="flex justify-center items-center z-0 h-full w-full absolute top-0 left-0 pb-[147px]">
        <div className="relative overflow-hidden flex justify-center items-center p-4 gap-2 h-[490px] w-[590px] rounded-2xl border border-gray-950/50 bg-blue-950/80 shadow-[inset_0_0_20px_rgba(23,100,250,0.3)] mob:rounded-none mob:w-full mob:h-full mob:pb-0">

            {
                !!coeficient && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <h1 className="text-6xl font-bold text-white tabular-nums">
                            x{coeficient.toFixed(2)}
                        </h1>
                    </div>
                )
            }

            <CrashGrid coeficient={coeficient} />

            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff0080" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#7928ca" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path
                    d={areaPath}
                    fill="url(#grad)"
                    style={{ transition: "all 0.1s linear" }}
                />
                <path
                    d={linePath}
                    fill="none"
                    stroke="#ff0080"
                    strokeWidth="4"
                    style={{ transition: "all 0.1s linear" }}
                />
            </svg>
        </div>
    </div>
    );
};

export default CrashAnimation;
