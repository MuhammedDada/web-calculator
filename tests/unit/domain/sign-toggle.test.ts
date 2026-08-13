import { describe, expect, it } from "vitest";
import { createInitialState, reduce } from "../../../src/domain/calculator";

describe("sign-toggle", () => {
  it("flips a positive entry to negative", () => {
    let state = createInitialState();
    state = reduce(state, { type: "DIGIT", digit: "5" });
    state = reduce(state, { type: "SIGN_TOGGLE" });
    expect(state.currentEntry).toBe("-5");
  });

  it("flips back to positive on a second press", () => {
    let state = createInitialState();
    state = reduce(state, { type: "DIGIT", digit: "5" });
    state = reduce(state, { type: "SIGN_TOGGLE" });
    state = reduce(state, { type: "SIGN_TOGGLE" });
    expect(state.currentEntry).toBe("5");
  });

  it("leaves a fresh 0 entry unchanged (no negative zero)", () => {
    const state = reduce(createInitialState(), { type: "SIGN_TOGGLE" });
    expect(state.currentEntry).toBe("0");
  });

  it("does not disturb a pending operator or previous operand", () => {
    let state = createInitialState();
    state = reduce(state, { type: "DIGIT", digit: "7" });
    state = reduce(state, { type: "OPERATOR", operator: "+" });
    state = reduce(state, { type: "SIGN_TOGGLE" });
    expect(state.currentEntry).toBe("-7");
    expect(state.pendingOperator).toBe("+");
    expect(state.previousOperand).toBe(7);
  });
});
