import { useRef } from "react";
import useResize from "../../hooks/useResize";
import Click from "../Click";
import ErrorPopup from "../Popup/ErrorPopup";
import Canvas from "../Canvas";
import HighestInfo from "../HighestInfo";
import ShowAnimation from "../ShowAnimation";
import BetsContainer from "../BetsContainer";
import InfoComponents from "../InfoComponents";
import HistoryInfo from "../HistoryInfo";
import Balance from "../Balance";
import BettingTime from "../BettingTime";
import Popup from "../Popup";
import WinPopup from "../Popup/WinPopup";

const Desktop = () => {

    const wrapperRef = useRef<HTMLDivElement>(null);
    const wrapperContentRef = useRef<HTMLDivElement>(null);
    useResize(wrapperRef, wrapperContentRef);

    return (

        <div ref={wrapperRef} className='w-full h-full relative overflow-hidden'>

            <div className='bg-blue-800 w-[1366px] h-[768px] absolute top-1/2 left-1/2 overflow-hidden' ref={wrapperContentRef} >
                <Click />
                <ErrorPopup />
                <Canvas />
                <HighestInfo />
                <ShowAnimation />
                <BetsContainer />
                <InfoComponents />
                <HistoryInfo />
                <Balance />
                <BettingTime />
                <Popup />
                <WinPopup />
            </div>
        </div>
    )
}

export default Desktop;