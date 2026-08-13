import { describe, expect, it } from "vitest";
import { createInitialState, reduce } from "../../../src/domain/calculator";

describe("clear-entry (CE)", () => {
  it("resets only currentEntry to 0, preserving pendingOperator and previousOperand", () => {
    let state = createInitialState();
    state = reduce(state, { type: "DIGIT", digit: "5" });
    state = reduce(state, { type: "DIGIT", digit: "0" });
    state = reduce(state, { type: "OPERATOR", operator: "+" });
    state = reduce(state, { type: "DIGIT", digit: "3" });
    state = reduce(state, { type: "CLEAR_ENTRY" });

    expect(state.currentEntry).toBe("0");
    expect(state.pendingOperator).toBe("+");
    expect(state.previousOperand).toBe(50);
  });

  it("allows completing the calculation after clear-entry with a new operand", () => {
    let state = createInitialState();
    state = reduce(state, { type: "DIGIT", digit: "5" });
    state = reduce(state, { type: "DIGIT", digit: "0" });
    state = reduce(state, { type: "OPERATOR", operator: "+" });
    state = reduce(state, { type: "DIGIT", digit: "3" });
    state = reduce(state, { type: "CLEAR_ENTRY" });
    state = reduce(state, { type: "DIGIT", digit: "4" });
    state = reduce(state, { type: "EQUALS" });

    expect(state.currentEntry).toBe("54");
  });
});
