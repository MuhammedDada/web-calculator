import { describe, expect, it } from "vitest";
import { createInitialState, reduce } from "../../../src/domain/calculator";

describe("percent", () => {
  it("computes previousOperand plus that percentage when a calculation is pending (200 + 10% = 220)", () => {
    let state = createInitialState();
    state = reduce(state, { type: "DIGIT", digit: "2" });
    state = reduce(state, { type: "DIGIT", digit: "0" });
    state = reduce(state, { type: "DIGIT", digit: "0" });
    state = reduce(state, { type: "OPERATOR", operator: "+" });
    state = reduce(state, { type: "DIGIT", digit: "1" });
    state = reduce(state, { type: "DIGIT", digit: "0" });
    state = reduce(state, { type: "PERCENT" });

    expect(state.currentEntry).toBe("220");
  });

  it("divides the current entry by 100 when no calculation is pending (50% = 0.5)", () => {
    let state = createInitialState();
    state = reduce(state, { type: "DIGIT", digit: "5" });
    state = reduce(state, { type: "DIGIT", digit: "0" });
    state = reduce(state, { type: "PERCENT" });

    expect(state.currentEntry).toBe("0.5");
  });

  it("does not crash when percent is pressed with no number ever entered", () => {
    const state = reduce(createInitialState(), { type: "PERCENT" });
    expect(state.currentEntry).toBe("0");
  });
});
