import { useSelector } from "react-redux";
import { useT } from "../../lang";
import { selectSettings } from "../../redux/selector";
import { cn, dataFormater } from "../../utils/helper"
import TableHeader from "../TableHeader";

const HighestInfo = () => {
    const { t } = useT();
    const { isMobile } = useSelector(selectSettings);

    const highestData = [
        { createdAt: new Date(), odds: '2.5' },
        { createdAt: new Date(), odds: '3.0' },
        { createdAt: new Date(), odds: '1.8' },
        { createdAt: new Date(), odds: '4.2' },
        { createdAt: new Date(), odds: '2.1' },
    ];

    return (
        <div
            className={
                cn('absolute top-0 left-0 z-20 w-[28%] flex flex-col items-center gap-2 p-2 h-[calc(100%-30px)] bg-gray-950/60 border-l border-black', { 'mob:hidden': isMobile })
            }
        >
            <div className="flex justify-around items-center w-full h-11 overflow-hidden bg-sky-950/40 shadow-[inset_0_0_20px_rgba(23,100,250,0.3)] rounded-lg">
                <div
                    className={cn(
                        'flex justify-center items-center h-full text-left px-1 w-full rounded-lg font-[500] hover:text-gray-300',

                    )}
                >
                    <span className="overflow-hidden text-ellipsis leading-[1.2rem]">{t('highest')}</span>
                </div>
            </div>
            <div className="flex flex-col w-full flex-1 overflow-hidden bg-sky-950/50 shadow-[inset_0_0_20px_rgba(23,100,250,0.3)] rounded-lg px-2 py-2 gap-2">

                <div className="flex flex-col pr-1 items-center w-full h-full bg-gray-950/40 border border-gray-950/50 rounded-lg overflow-hidden">

                    <TableHeader headers={['data', 'coefficient']} />
                    <div className="w-full overflow-y-scroll h-full flex gap-1 p-1 flex-col">
                        {highestData.map((bet, index) => (
                            <div
                                key={index}
                                className={
                                    'flex w-full h-10 bg-gray-800 rounded-lg font-semibold border-transparent border shadow-[inset_0_0_4px_black] justify-between'
                                }
                            >
                                <div className="flex justify-center items-center rounded-lg p-4 w-[60%] h-full ">
                                    <span className="overflow-hidden text-ellipsis text-left">
                                        {dataFormater(bet.createdAt)}
                                    </span>
                                </div>
                                <div className="rounded-lg p-4 w-[40%] h-full flex justify-center items-center">
                                    <span className="overflow-hidden text-ellipsis text-left">
                                        {bet.odds ? bet.odds : '-'}
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