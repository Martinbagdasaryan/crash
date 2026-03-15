import React from 'react';
import { useSelector } from 'react-redux';
import { selectSettings } from '../../../redux/selector';
import { useT } from '../../../lang';

interface props {
	text: string;
	data: string;
}

const Value = ({ text, data }: props) => {
	return (
		<div className="relative w-full h-14 bg-[#050a09] border border-emerald-500/20 rounded-xl px-4 flex justify-between items-center overflow-auto group shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">

			<div className="absolute left-0 top-2 bottom-2 w-[2px] bg-emerald-500 shadow-[0_0_8px_#10b981] rounded-full" />

			<p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.2em] font-bold z-10">
				{text}
			</p>

			<p className="text-white font-black font-mono text-lg tracking-tighter drop-shadow-[0_0_12px_rgba(16,185,129,0.4)] z-10">
				{data}
			</p>

			<div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

			{/* Внутреннее мягкое свечение при наведении */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
		</div>
	);
};

export default Value;