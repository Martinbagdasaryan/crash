
// --- Вспомогательный компонент сетки ---
const CrashGrid = ({ coeficient }: { coeficient: number }) => {
    // Делаем сетку чуть шире, чем SVG графика
    const viewBoxWidth = 690;
    const viewBoxHeight = 450;
    
    const yMax = Math.max(2.0, coeficient );
    
    const yTicks = Array.from({ length: 5 }, (_, i) => {
        const val = 1.0 + (i * (yMax - 1) / 4);
        return val.toFixed(1) + "x";
    });

    const xMax = Math.max(6, Math.floor(coeficient * 2));
    const xTicks = Array.from({ length: 6 }, (_, i) => Math.floor((i + 1) * (xMax / 6)));


    return (
        <svg
            preserveAspectRatio="xMinYMin meet"
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
            className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-300"
        >
            {/* Горизонтальные линии и Y-ось */}
            <g transform="translate(66, 410)" fontSize="11" fontWeight="700" fill="#10b981" opacity="0.25">
                {yTicks.map((v, i) => (
                    <g key={i} className="transition-all duration-300" transform={`translate(0, ${-74 * i})`}>
                        <line x1="0" y1="0" x2="612" y2="0" stroke="#10b981" strokeOpacity="0.1" strokeDasharray="3 3" />
                        <text x="-5" dy="0.32em" textAnchor="end" className="font-mono">{v}</text>
                    </g>
                ))}
            </g>

            {/* Вертикальные линии и X-ось */}
            <g transform="translate(66, 412)" fontSize="11" fontWeight="700" fill="#10b981" opacity="0.25">
                <path stroke="#10b981" strokeOpacity="0.1" d="M0.5,0.5H612.5" />
                {xTicks.map((v, i) => (
                    <g key={i} className="transition-all duration-300" transform={`translate(${(i + 1) * 102},0)`}>
                        <text y="20" textAnchor="middle" className="font-mono">{v}</text>
                    </g>
                ))}
            </g>
        </svg>
    );
};

export default CrashGrid;