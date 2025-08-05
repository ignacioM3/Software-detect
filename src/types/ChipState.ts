export const ChipState = {
    ENDING:  'Terminando ciclo',
    SARTING: 'Empezando ciclo',
    UNKNOWN: 'Estado desconocido',
    WORKING: "Analizando"
} as const


export type ChipStateType = (typeof ChipState)[keyof typeof ChipState]

export type ChipStatusType = 'good' | 'warning' | 'damage' | 'offline';


export type ChipAnalysis = {
  index: number;
  currentValue: number;
  averageValue: number;
  status: ChipStatusType;
  issues: string[];
};

export type CaptureEntry = {
  timestamp: number;
  values: number[];
  state: ChipStateType;
  analysis: ChipAnalysis[];
};
