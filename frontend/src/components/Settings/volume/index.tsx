interface IVolume {
	text: string;
	setVolume: (val: number) => void;
	maxValue: number;
	value: number;
}

const Volume = ({ text, setVolume, maxValue, value }: IVolume) => {
	return (
		<div className="flex justify-between items-center w-[80%]">
			<p className=" left-1 font-[700] w-[calc(100%-120px)] overflow-hidden text-ellipsis text-left">
				{text}
			</p>
			<input
				onChange={(e) => setVolume(+e.target.value)}
				type="range"
				value={value}
				min={0}
				max={maxValue}
				step={0.001}
				className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
			/>
		</div>
	);
};

export default Volume;
