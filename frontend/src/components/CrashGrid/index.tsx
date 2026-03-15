
const CrashGrid = ({ coeficient }: { coeficient: number }) => {
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
            viewBox="0 0 690 450"
            className="absolute transition-all duration-500 ease-linear"
        >
            <g
                className="column-axis"
                transform="translate(66, 412)"
                fontSize="13"
                fontFamily="'Lato', sans-serif"
                fill="#4f46e5"
            >
                <path stroke="currentColor" d="M0.5,0.5H612.5" />
                {xTicks.map((v, i) => (
                    <g
                        key={i}
                        className="tick transition-transform duration-500"
                        transform={`translate(${i * 122},0)`}
                    >
                        <text fill="currentColor" y="20" textAnchor="middle">
                            {v}
                        </text>
                    </g>
                ))}
            </g>

            <g
                className="odd-axis"
                transform="translate(12, 386)"
                fontSize="13"
                fontFamily="'Lato', sans-serif"
                fill="#4f46e5"
            >
                <path stroke="currentColor" d="M0.5,0.5V-297.5" />
                {yTicks.map((v, i) => (
                    <g
                        key={i}
                        className="tick transition-all duration-500"
                        transform={`translate(0,${-74 * i})`}
                    >
                        <text fill="currentColor" x="5" dy="0.32em">
                            {v}
                        </text>
                    </g>
                ))}
            </g>

            <g transform="translate(66, 392)" fill="none">
                <path
                    stroke="currentColor"
                    strokeOpacity="0.2"
                    d="M0.5,-300V0.5H612.5V-300"
                />
                {[0, 122.4, 244.8, 367.2, 489.6, 612].map((v, i) => (
                    <line
                        key={i}
                        stroke="white"
                        strokeOpacity="0.05"
                        x1={v} y1="0" x2={v} y2="-300"
                    />
                ))}
            </g>
        </svg>
    );
};

export default CrashGrid;