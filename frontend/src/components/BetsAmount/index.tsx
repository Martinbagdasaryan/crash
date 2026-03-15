import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setisKeybordOpen, setWindowInfo } from '../../redux/selects/settings';
import { selectPlayer, selectSettings } from '../../redux/selector';
import { KEYBORD_TYPE } from '../../redux/selects/types';
import BetsAmountButton from './BetsAmountButton';
import { cn } from '../../utils/helper';

interface BetsAmountProps {
	index: number;
	setBetAmount: (amount: number) => void;
}

const BetsAmount: React.FC<BetsAmountProps> = ({ index, setBetAmount }) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const [rawValue, setRawValue] = useState('');

	const { isMobile } = useSelector(selectSettings);
	const { balance, maxBet, currencyId } = useSelector(selectPlayer);
	const { amount } = useSelector(selectSettings).windowInfo[index];

	const dispatch = useDispatch();

	const handleInputClick = () => {
		if (isMobile) {
			dispatch(setisKeybordOpen(true));
			dispatch(
				setWindowInfo({
					index: index,
					amount: amount,
					isKeybordOpen: true,
					type: KEYBORD_TYPE.Amount,
				}),
			);
		} else {
			inputRef.current?.focus();
		}
	};

	const validateValue = (e: ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value;

		if (!/^\d*\.?\d*$/.test(value)) return;

		if (value.startsWith('0') && value.length > 1 && value[1] !== '.') {
			value = value.replace(/^0+/, '') || '0.';
		}

		if (value.includes('.')) {
			const [intPart, decPart] = value.split('.');
			if (decPart.length > 2) return;
		}

		if (value.length === 0) {
			value = '0';
		}

		const numericValue = Number(value);
		if (!isNaN(numericValue)) {
			if (numericValue > balance) {
				setRawValue((+balance).toFixed(2));
				setBetAmount(+balance.toFixed(2));
			} else if (numericValue > maxBet) {
				setRawValue(String(maxBet));
				setBetAmount(+maxBet.toFixed(2));
			} else {
				setRawValue(value);
				setBetAmount(+numericValue.toFixed(2));
			}
		}
	};

	useEffect(() => {
		setRawValue(String(amount));
	}, [amount]);

	return (
		<div className="flex items-center justify-center gap-1 w-full mob:flex-col short:mob:flex-row">
			<div
				className="relative flex justify-center items-center h-14 gap-1 w-full rounded-lg cursor-pointer bg-sky-900/40 shadow-[0_0_3px_rgba(0,0,0,0.3)] group mob:h-9 short:h-8"
				onClick={handleInputClick}
			>
				<span
					className={cn(
						'px-1 py-0.5 rounded-full text-center bet-input bg-transparent font-bold bg-purple-500',
						{ 'caret-transparent': isMobile },
					)}
				>
					{currencyId}
				</span>
				<input
					ref={inputRef}
					value={rawValue}
					name={'bet_' + index}
					onClick={handleInputClick}
					onChange={validateValue}
					style={{ width: `min(${String(amount).length}ch, 100%)` }}
					type="text"
					inputMode="decimal"
					min={0}
					readOnly={isMobile}
					max={maxBet}
					step={0.01}
					className={cn(
						'rounded-lg text-center bet-input bg-transparent font-bold text-[18px] cursor-pointer',
						{ 'caret-transparent': isMobile },
					)}
				/>
				<button
					type="button"
					onClick={() => setBetAmount(0)}
					className="absolute right-4 text-[26px] opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-opacity duration-200"
				>
					×
				</button>
			</div>
			<BetsAmountButton index={index} />
		</div>
	);
};

export default BetsAmount;
