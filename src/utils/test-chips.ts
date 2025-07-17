export function determineChips(values: number[]) {
  const total = values.length;

  if (values.length === 0) {
    return "ENDING_CYCLE";
  }

  if (values.every((v) => v < 0.1)) {
    return "STARTING_CYCLE";
  }
  const miningValues = values.filter((v) => v > 10);
  if (miningValues.length > total * 0.8) {
    return "MINING";
  }
}
