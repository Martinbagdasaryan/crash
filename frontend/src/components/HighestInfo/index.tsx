import { useSelector } from "react-redux";
import { useT } from "../../lang";
import { selectSettings } from "../../redux/selector";
import { cn, dataFormater } from "../../utils/helper"
import TableHeader from "../TableHeader";

const HighestInfo = () => {
    const { t } = useT();
    const { isMobile } = useSelector(selectSettings);

    const highestData = [
        { createdAt: new Date(), odds: '2.50' },
        { createdAt: new Date(), odds: '3.12' },
        { createdAt: new Date(), odds: '1.85' },
        { createdAt: new Date(), odds: '4.20' },
        { createdAt: new Date(), odds: '2.10' },
    ];

    return (
        <div
            className={cn(
                'absolute top-0 left-0 z-20 w-[28%] flex flex-col items-center gap-3 p-3 h-[calc(100%-30px)]',
                'bg-[#050a09]/80 backdrop-blur-md border-r border-emerald-500/10', // Прозрачный темный фон
                { 'mob:hidden': isMobile }
            )}
        >
            {/* Заголовок секции */}
            <div className="flex justify-around items-center w-full h-11 bg-emerald-500/5 border border-emerald-500/20 rounded-xl shadow-[inset_0_0_15px_rgba(16,185,129,0.1)]">
                <div className="flex justify-center items-center h-full w-full font-black uppercase tracking-widest text-[12px] text-emerald-500">
                    {t('highest')}
                </div>
            </div>

            {/* Контейнер таблицы */}
            <div className="flex flex-col w-full flex-1 overflow-hidden bg-emerald-950/20 rounded-2xl border border-emerald-500/10 p-1">
                <div className="flex flex-col items-center w-full h-full rounded-xl overflow-hidden">

                    <TableHeader headers={['data', 'coefficient']} />

                    <div className="w-full overflow-y-auto h-full flex gap-1.5 p-1 flex-col custom-scrollbar">
                        {highestData.map((bet, index) => (
                            <div
                                key={index}
                                className={cn(
                                    'flex w-full min-h-[40px] rounded-lg transition-all duration-200',
                                    'bg-emerald-500/5 border border-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/20',
                                    'group items-center justify-between px-3'
                                )}
                            >
                                {/* Дата (Приглушенная) */}
                                <div className="flex justify-start items-center w-[60%]">
                                    <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-300 transition-colors">
                                        {dataFormater(bet.createdAt)}
                                    </span>
                                </div>

                                {/* Коэффициент (Яркий) */}
                                <div className="flex justify-end items-center w-[40%]">
                                    <span className="font-black text-emerald-400 text-[14px] drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                                        {bet.odds ? `x${bet.odds}` : '-'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HighestInfo