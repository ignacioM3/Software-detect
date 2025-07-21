import { useContext } from "react";
import StateChipsContext from "../context/StateChipsProvider";



const useChips = () => {
    return useContext(StateChipsContext)
}

export default useChips;