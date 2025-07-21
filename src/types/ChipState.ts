export const ChipState = {
    ENDING:  'ENDING_CYCLE',
    SARTING: 'STARTING_CYCLE',
    UNKNOWN: 'UNKNOWN_STATE',
    MINING: 'MINING'
} as const


export type ChipStateType = (typeof ChipState)[keyof typeof ChipState]