import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSettings } from '../../redux/selector';
import { setisKeybordOpen, setWindowInfo } from '../../redux/selects/settings';
import { KEYBORD_TYPE } from '../../redux/selects/types';

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '←'];

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
                ? { cashOut: +(cashOutKey === '' ? '1.01' : cashOutKey) }
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
            onChange(currentValue.slice(0, -1));
        } else if (key === '.') {
            if (!currentValue.includes('.')) {
                onChange(currentValue === '' ? '0.' : currentValue + '.');
            }
        } else {
            const nextValue = currentValue + key;
            // Валидация: не более 2 знаков после запятой и лимит
            if (nextValue.includes('.') && nextValue.split('.')[1].length > 2) return;
            if (Number(nextValue) <= 9999.99) onChange(nextValue);
        }
    };

    return (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-end bg-black/80 backdrop-blur-sm pb-6 px-4">
            {/* Контейнер клавиатуры */}
            <div className="w-full max-w-md bg-[#0a1210] border border-[#1a2c26] rounded-[32px] p-6 shadow-2xl">
                
                {/* Дисплей ввода */}
                <div className="w-full text-center mb-6 py-4 border-b border-[#1a2c26]">
                    <span className="text-[#00e691] text-4xl font-black tracking-wider">
                        {currentValue || '0'}
                        <span className="animate-pulse ml-1">_</span>
                    </span>
                </div>

                {/* Сетка кнопок */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    {keys.map((key) => (
                        <button
                            key={key}
                            onClick={() => handleKeyPress(key)}
                            className="h-16 flex items-center justify-center rounded-full bg-[#111d1a] border border-[#1f362f] text-gray-200 text-2xl font-bold hover:bg-[#1a2c26] active:scale-90 active:border-[#00e691] transition-all"
                        >
                            {key}
                        </button>
                    ))}
                </div>

                {/* Кнопка подтверждения в стиле "CASH OUT" */}
                <button
                    onClick={onClose}
                    className="w-full h-16 rounded-full bg-gradient-to-r from-[#cc00ff] to-[#7000ff] text-white text-xl font-black uppercase italic tracking-widest shadow-[0_0_20px_rgba(204,0,255,0.4)] active:scale-95 transition-transform"
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default CustomKeyboard;