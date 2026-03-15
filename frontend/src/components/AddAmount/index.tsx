import AutoBet from '../AutoBet';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { cn, cutAmount, NumberFormatter } from '../../utils/helper';
import { useDispatch, useSelector } from 'react-redux';
import { selectPlayer, selectSettings } from '../../redux/selector';
import { setisKeybordOpen, setWindowInfo } from '../../redux/selects/settings';
import { KEYBORD_TYPE } from '../../redux/selects/types';
import { useT } from '../../lang';

interface AddAmountProps {
	setBetAmount: (amount: number) => void;
	index: number;
}

const AddAmount: React.FC<AddAmountProps> = ({ setBetAmount, index }) => {
	const { t } = useT();

	const [cashOutValue, setCashOutValue] = useState<string>();
	const inputRef = useRef<HTMLInputElement>(null);

	const dispatch = useDispatch();
	const { isMobile, windowInfo } = useSelector(selectSettings);
	const { amount: betAmount, cashOut, isAutoBetCount } = windowInfo[index];
	const { minBet, maxBet } = useSelector(selectPlayer);

	const amounts = [
		minBet,
		+cutAmount(cutAmount(maxBet, 3), 2).toFixed(0),
		+cutAmount(maxBet, 3).toFixed(0),
		+cutAmount(maxBet, 2).toFixed(0),
		maxBet,
	];

	const setCashOut = (cashOutNumber: number) => {
		dispatch(
			setWindowInfo({
				index,
				cashOut: cashOutNumber,
				isKeybordOpen: false,
				type: null,
			}),
		);
	};

	const handleInputClick = () => {
		if (isMobile) {
			dispatch(setisKeybordOpen(true));
			dispatch(
				setWindowInfo({
					index: index,
					isKeybordOpen: true,
					type: KEYBORD_TYPE.Cashout,
					cashOut: +(cashOut || 0),
				}),
			);
		}
	};

	const validateValue = (e: ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value;

		if (!/^\d*\.?\d*$/.test(value)) return;

		if (value.startsWith('0') && value[1] !== '.') {
			value = value.replace(/^0+/, '') || '1';
		}

		if (value.includes('.')) {
			const [intPart, decPart] = value.split('.');
			if (decPart.length > 2) return;
			if (!intPart) return;
		}

		const numericValue = Number(value);
		if (!isNaN(numericValue) && numericValue <= 9999.99) {
			setCashOutValue(value);
			setCashOut(+numericValue.toFixed(2));
		}
	};

	useEffect(() => {
		setCashOutValue(String(!!cashOut ? cashOut : ''));
	}, [cashOut]);
	return (
		<div className="flex justify-around items-center w-full flex-col-reverse mob:gap-1 short:flex-row">
			{/* Сетка кнопок с суммами (быстрый добор ставки) */}
			<div className="flex justify-around items-center w-full h-full mob:w-full gap-1">
				{amounts.map((amount) => (
					<button
						key={amount}
						className={cn(
							"w-10 h-10 rounded-full text-center transition-all duration-200 font-black text-[11px] mob:w-8 mob:h-8",
							"bg-emerald-950/40 border border-emerald-500/20 text-emerald-400", // Наш новый стиль
							"shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:bg-emerald-500 hover:text-black hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]",
							"active:scale-90"
						)}
						onClick={() => {
							setBetAmount(Math.min((((betAmount * 1000) + (amount * 1000)) / 1000), maxBet))
						}}
					>
						{NumberFormatter(amount)}
					</button>
				))}
			</div>

			{/* Блок Авто-выплаты (Cashout) и Авто-беттинга */}
			<div className="flex justify-around items-center w-full py-1 px-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10 mb-2 short:mb-0">
				{!!isAutoBetCount ? (
					<>
						{isMobile ? (
							<span
								onClick={handleInputClick}
								className={cn(
									'w-1/2 text-center font-black text-emerald-400 cursor-pointer text-lg tracking-tighter',
									{
										'text-emerald-900': !cashOutValue,
									},
								)}
							>
								{cashOutValue ? `${cashOutValue}x` : '0.00x'}
							</span>
						) : (
							<div
								onClick={() => inputRef.current?.focus()}
								className="flex justify-center items-center w-1/2 h-8"
							>
								<input
									onBlur={() => {
										if (+(cashOutValue ?? '') === 1) {
											setCashOutValue('1.01');
											setCashOut(1.01);
										}
									}}
									ref={inputRef}
									id="cashOut"
									value={cashOutValue}
									placeholder="0.00x"
									onChange={validateValue}
									inputMode="none"
									style={{
										width: `min(${(cashOutValue || '1.01x').toString().length}ch, 100%)`,
									}}
									className="h-full text-end font-black bg-transparent p-0 text-emerald-400 text-lg outline-none cursor-pointer"
								/>
								{!!cashOutValue && <span className="font-black text-emerald-400 ml-0.5 text-lg">x</span>}
							</div>
						)}
					</>
				) : (
					<span className="font-black text-[10px] uppercase tracking-widest text-emerald-500/50 text-center text-nowrap mob:text-left short:text-wrap">
						{t('autoplay')}
					</span>
				)}

				<div className="relative flex justify-end items-center h-8 ml-2">
					<AutoBet index={index} />
				</div>
			</div>
		</div>
	);
};

export default AddAmount;
