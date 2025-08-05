import {
  CaptureEntry,
  ChipAnalysis,
  ChipState,
  ChipStateType,
  ChipStatusType,
} from "../types/ChipState";


const DAMAGE_THRESHOLD_PERCENT = 0.1;
const WARNING_THRESHOLD_PERCENT = 0.3;
const CASCADE_FAILURE_THRESHOLD = 5;
export function analyzeChips(
  currentValues: number[],
  history: CaptureEntry[],
  currentState: ChipStateType
) {
  const chipCount = currentValues.length;
  const analysis: ChipAnalysis[] = [];

  
  const validHistory = history.filter(
    (entry) => entry.values.length === chipCount
  );

  const historicalAverages: number[] = [];
  for (let i = 0; i < chipCount; i++) {
    const chipHistory = validHistory.map((entry) => entry.values[i]);
    historicalAverages[i] =
      chipHistory.length > 0
        ? chipHistory.reduce((sum, val) => sum + val, 0) / chipHistory.length
        : 0;
  }

  // Analizar cada chip individualmente
  for (let i = 0; i < chipCount; i++) {
  const currentValue = currentValues[i];
  const averageValue = historicalAverages[i];
  const issues: string[] = [];
  let status: ChipStatusType = "good";

  if (currentState === ChipState.WORKING && currentValue === 0) {
    issues.push("offline_during_mining");
    status = "damage";
  } 
  else if (currentState === ChipState.WORKING && currentValue > 0) {
    const percentOfAverage = averageValue > 0 ? currentValue / averageValue : 1;

    if (percentOfAverage < DAMAGE_THRESHOLD_PERCENT) {
      issues.push("very_low_performance");
      status = "damage";
    } else if (percentOfAverage < WARNING_THRESHOLD_PERCENT) {
      issues.push("low_performance");
      status = "warning";
    }
  }

  // 👈 Guardar resultado en analysis
  analysis.push({
    index: i,
    currentValue,
    averageValue,
    status,
    issues
  });
}

   detectCascadeFailures(analysis, currentState);

  return analysis;
}


function detectCascadeFailures(analysis: ChipAnalysis[], currentState: ChipStateType) {
  if (currentState !== ChipState.WORKING) return;

  let currentRun = 0;
  let startIndex = -1;

  for (let i = 0; i < analysis.length; i++) {
    if (analysis[i].status === 'damage' && analysis[i].issues.includes('offline_during_mining')) {
      if (currentRun === 0) startIndex = i;
      currentRun++;
    } else {
      if (currentRun >= CASCADE_FAILURE_THRESHOLD) {
        // Marcar todos los chips en esta corrida como falla en cascada
        for (let j = startIndex; j < startIndex + currentRun; j++) {
          if (!analysis[j].issues.includes('cascade_failure')) {
            analysis[j].issues.push('cascade_failure');
          }
        }
      }
      currentRun = 0;
      startIndex = -1;
    }
  }

  // Verificar la última corrida
  if (currentRun >= CASCADE_FAILURE_THRESHOLD) {
    for (let j = startIndex; j < startIndex + currentRun; j++) {
      if (!analysis[j].issues.includes('cascade_failure')) {
        analysis[j].issues.push('cascade_failure');
      }
    }
  }
}