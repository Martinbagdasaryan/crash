
// --- Вспомогательный компонент сетки ---
const CrashGrid = ({ coeficient, width, height, paddingLeft, paddingBottom }: any) => {
    const yMax = Math.max(2.0, coeficient);
    const yTicks = Array.from({ length: 5 }, (_, i) => (1.0 + (i * (yMax - 1) / 4)).toFixed(1) + "x");

    const xMax = Math.max(6, Math.floor(coeficient * 2));
    const xTicks = Array.from({ length: 6 }, (_, i) => Math.floor((i + 1) * (xMax / 6)));

    const plotWidth = width - paddingLeft - 40;

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
        >
            {/* Y-Axis Ticks */}
            <g transform={`translate(${paddingLeft}, ${height - paddingBottom})`} fontSize="11" fill="#10b981" opacity="0.3">
                {yTicks.map((v, i) => (
                    <g key={i} className="transition-all duration-300" transform={`translate(0, ${-(i * (height - paddingBottom - 40) / 4)})`}>
                        <line x1="0" y1="0" x2={plotWidth} y2="0" stroke="#10b981" strokeOpacity="0.1" strokeDasharray="3 3" />
                        <text x="-10" dy="0.32em" textAnchor="end" className="font-mono font-bold">{v}</text>
                    </g>
                ))}
            </g>

            {/* X-Axis Ticks */}
            <g transform={`translate(${paddingLeft}, ${height - paddingBottom})`} fontSize="11" fill="#10b981" opacity="0.3">
                <line x1="0" y1="0" x2={plotWidth} y2="0" stroke="#10b981" strokeOpacity="0.2" />
                {xTicks.map((v, i) => (
                    <g key={i} className="transition-all duration-300" transform={`translate(${(i + 1) * (plotWidth / 6)}, 0)`}>
                        <text y="20" textAnchor="middle" className="font-mono font-bold">{v}s</text>
                    </g>
                ))}
            </g>
        </svg>
    );
};

export default CrashGrid;