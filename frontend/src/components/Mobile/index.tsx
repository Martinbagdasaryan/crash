import { useSelector } from "react-redux"
import Balance from "../Balance"
import BetsContainer from "../BetsContainer"
import BettingTime from "../BettingTime"
import Canvas from "../Canvas"
import Click from "../Click"
import HighestInfo from "../HighestInfo"
import HistoryInfo from "../HistoryInfo"
import InfoComponents from "../InfoComponents"
import Popup from "../Popup"
import ErrorPopup from "../Popup/ErrorPopup"
import WinPopup from "../Popup/WinPopup"
import ShowAnimation from "../ShowAnimation"
import { selectSettings } from "../../redux/selector"
import CustomKeyboard from "../CustomKeyboard"

const Mobile = () => {
    const { isKeybordOpen } = useSelector(selectSettings);

    return (
        <div className="bg-[#050807] w-full h-full">
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
            {isKeybordOpen && <CustomKeyboard />}
        </div>
    )
}

export default Mobile;