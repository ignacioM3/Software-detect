import { ChipState } from "../types/ChipState";

export function determineChips(values: number[]) {
  const total = values.length;

  if (values.length === 0) {
    return ChipState.ENDING;
  }

  if (values.every((v) => v < 10)) {
    return ChipState.SARTING;
  }
  const miningValues = values.filter((v) => v > 10);
  
  if (miningValues.length > total * 0.8) {
    return ChipState.MINING;
  }
}
