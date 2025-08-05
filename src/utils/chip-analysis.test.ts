import { CaptureEntry, ChipState, ChipStateType } from "../types/ChipState";
import { analyzeChips } from "./chip-analysis";

describe("Chip Analysis", () => {
  test("Detecta falla en cascada", () => {
    const values = Array(120).fill(100);
    for (let i = 78; i < 120; i++) {
      values[i] = 0;
    }

    const history: CaptureEntry[] = [];
    const state = ChipState.WORKING;
    const analysis = analyzeChips(values, history, state);
    const damagedChips = analysis.filter((chip) => chip.status === "damage");
    expect(damagedChips.length).toBe(42);
    expect(damagedChips[0].issues).toContain("offline_during_mining");
    expect(damagedChips[0].issues).toContain("cascade_failure");
  });
});
