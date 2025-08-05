import { ChipState } from "../types/ChipState";

export function determineStatus(values: number[]) {
  const total = values.length;

  if (values.length === 0) {
    return ChipState.UNKNOWN;
  }

  const miningValues = values.filter((v) => v > 40);

  if (miningValues.length > total * 0.8) {
    return ChipState.WORKING;
  }

  if (values.every((v) => v > 10)) {
    return ChipState.SARTING;
  }

  if (values.every((v) => v === 0)) {
    return ChipState.ENDING;
  }

  return ChipState.UNKNOWN;
}


