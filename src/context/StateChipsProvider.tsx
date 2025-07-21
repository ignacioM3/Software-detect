import React, { createContext, useState } from "react";
import { ChipStateType } from "../types/ChipState";
interface StateChipsContextType {
    chipState: ChipStateType | '';
    setChipState: React.Dispatch<React.SetStateAction<ChipStateType |''> >
}


const StateChipsContext = createContext<StateChipsContextType>({
    setChipState: () => {},
    chipState: ''
})

const StateChipsProvider = ({children}: {children: React.ReactNode}) => {
   const [chipState, setChipState] = useState<ChipStateType | ''>('');
    return (
        <StateChipsContext.Provider
            value={
                {
                    chipState,
                    setChipState
                    
                }
            }
        >

        </StateChipsContext.Provider>
    )
}

export {
    StateChipsProvider
}

export default StateChipsContext