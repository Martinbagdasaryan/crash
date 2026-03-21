import { useSelector } from "react-redux";
import { selectCoeficient, selectGame } from "../../redux/selector";
import { useEffect, useState } from "react";
import { GAME_STATE } from "../../utils/enums";

const GameResult = () => {
    const { coeficient } = useSelector(selectCoeficient);
    const { state } = useSelector(selectGame);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (state === GAME_STATE.RoundEnded) {
            setIsOpen(true);
        } else if (state === GAME_STATE.RoundStart) {
            setIsOpen(false);
        }
    }, [state]);

    if (!isOpen) return;

    return (
        <div id="gameResultPopup" className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-6 animate-fadeIn transition-all duration-300">

            <div className="relative flex items-center justify-center p-2 transform scale-0 opacity-0 animate-popupShow transition-all duration-300">

                <div className="absolute inset-0 rounded-full bg-emerald-950/40 blur-[120px] scale-150"></div>

                <div className="absolute h-[110%] w-[110%] rounded-[45%_55%_60%_40%] bg-teal-900/40 blur-3xl opacity-80 transform-gpu animate-blobSlow1"></div>

                <div className="absolute h-full w-full rounded-[60%_40%_50%_50%] bg-emerald-900/60 blur-2xl opacity-90 transform-gpu animate-blobSlow2"></div>

                <div className="absolute h-4/5 w-4/5 rounded-[55%_45%_40%_60%] bg-emerald-800/70 blur-xl opacity-95 transform-gpu animate-blobSlow3"></div>

                <button onClick={() => setIsOpen(false)} className="absolute -top-4 -right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-900/80 border border-emerald-600 text-emerald-300 backdrop-blur-sm transition-all hover:bg-emerald-500 hover:text-white hover:border-white group">
                    <svg className="h-6 w-6 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="relative z-10 flex flex-col items-center justify-center h-56 w-56 rounded-full bg-[#030605] border-4 border-emerald-700 shadow-[0_0_40px_rgba(16,185,129,0.3)] animate-neonBorderGlow overflow-hidden">

                    <div className="absolute inset-2 rounded-full border border-emerald-900/20">
                        <div className="absolute top-1/2 left-2 h-0.5 w-0.5 rounded-full bg-emerald-400"></div>
                        <div className="absolute top-10 right-10 h-0.5 w-0.5 rounded-full bg-emerald-400"></div>
                        <div className="absolute bottom-5 left-1/4 h-1 w-1 rounded-full bg-teal-400 blur-[0.5px] opacity-80"></div>
                        <div className="absolute top-1/4 right-3 h-0.5 w-0.5 rounded-full bg-emerald-400"></div>
                    </div>

                    <span className="relative z-10 mb-1 text-sm font-black uppercase tracking-[0.3em] text-emerald-200">Result</span>

                    <h1 className="relative z-10 text-[40px] font-black italic tracking-tighter text-[#FFE58F] drop-shadow-[0_0_15px_rgba(255,229,143,0.3)] animate-numberPulsate">
                        <span className="text-emerald-400">x</span>{coeficient.toFixed(2)}
                    </h1>

                </div>
            </div>
        </div>

    );
};

export default GameResult;