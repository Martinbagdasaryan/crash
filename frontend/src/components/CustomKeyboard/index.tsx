import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSettings } from '../../redux/selector';
import { setisKeybordOpen, setWindowInfo } from '../../redux/selects/settings';
import { KEYBORD_TYPE } from '../../redux/selects/types';

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', '←'];

const CustomKeyboard: React.FC = () => {
	const { windowInfo } = useSelector(selectSettings);
	const dispatch = useDispatch();

	const playerWindowInfo = windowInfo.find((info) => info.isKeybordOpen);
	const amount = playerWindowInfo?.amount.toString() || '';
	const cashOut = playerWindowInfo?.cashOut.toString() || '';
	const [amountKey, setAmountKey] = useState(amount.toString());
	const [cashOutKey, setCashOutKey] = useState(cashOut.toString());

	const onChange = playerWindowInfo?.type === KEYBORD_TYPE.Cashout ? setCashOutKey : setAmountKey;

	const currentValue = playerWindowInfo?.type === KEYBORD_TYPE.Cashout ? cashOutKey : amountKey;

	const onClose = () => {
		dispatch(setisKeybordOpen(false));
		const changeElements =
			playerWindowInfo?.type === KEYBORD_TYPE.Cashout
				? {
						cashOut: +(cashOutKey === '1' ? '1.01' : cashOutKey),
					}
				: { amount: +amountKey };
		dispatch(
			setWindowInfo({
				index: playerWindowInfo?.index ?? 0,
				...changeElements,
				isKeybordOpen: false,
				type: null,
			}),
		);
	};

	const handleKeyPress = (key: string) => {
		if (key === '←') {
			const value = currentValue.slice(0, -1);
			onChange(value);
		} else if (key === 'OK') {
			onClose();
		} else if (key === '.') {
			if (!currentValue.includes('.')) {
				if (currentValue === '0' || !currentValue) {
					onChange(playerWindowInfo?.type === KEYBORD_TYPE.Cashout ? '1.' : '0.');
				} else {
					onChange(currentValue + '.');
				}
			}
		} else {
			const currentValueWithNewKey = currentValue + key;

			if (currentValueWithNewKey.includes('.')) {
				const [intPart, decPart] = currentValueWithNewKey.split('.');
				if (decPart.length > 2) return;
			}

			const numericValue = Number(currentValueWithNewKey);

			if (!isNaN(numericValue) && numericValue <= 9999.99) {
				const minChange = playerWindowInfo?.type === KEYBORD_TYPE.Cashout ? '1.01' : '0.01';
				const minCashout =
					playerWindowInfo?.type === KEYBORD_TYPE.Cashout && currentValueWithNewKey === '1'
						? '1.01'
						: currentValueWithNewKey;
				onChange(currentValueWithNewKey === '0.0' ? minChange : minCashout);
			}
		}
	};

	return (
		<div className="absolute bottom-0 left-0 w-full bg-gray-800 p-4 flex flex-col z-50 short:h-full items-center justify-center">
			<div className="w-full text-center mb-4 font-bold">{currentValue || '0'}</div>
			<div className="flex flex-col gap-2 items-center justify-center w-full">
				<div className="grid grid-cols-3 gap-2 w-full max-w-sm short:grid-cols-6">
					{keys.map((key) => (
						<button
							key={key}
							className="bg-blue-600 rounded-lg py-4 text-xl font-bold hover:bg-blue-700 active:scale-95 transition"
							onClick={() => handleKeyPress(key)}
						>
							{key}
						</button>
					))}
				</div>

				<button
					className={`bg-green-600 rounded-lg py-4 text-xl font-bold hover:opacity-90 active:scale-95 transition w-full`}
					onClick={() => handleKeyPress('OK')}
				>
					ok
				</button>
			</div>
		</div>
	);
};

export default CustomKeyboard;
