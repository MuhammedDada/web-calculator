import { describe, expect, it } from "vitest";
import { createInitialState, reduce } from "../../../src/domain/calculator";
import type { CalculatorState } from "../../../src/domain/calculator.types";
import type { Digit } from "../../../src/domain/calculator.types";

function typeDigits(state: CalculatorState, digits: string): CalculatorState {
  for (const char of digits) {
    state = reduce(state, { type: "DIGIT", digit: char as Digit });
  }
  return state;
}

function divideByZero(): CalculatorState {
  let state = createInitialState();
  state = typeDigits(state, "5");
  state = reduce(state, { type: "OPERATOR", operator: "/" });
  state = typeDigits(state, "0");
  return reduce(state, { type: "EQUALS" });
}

describe("divide-by-zero and error recovery", () => {
  it("sets an error state instead of crashing or showing Infinity/NaN", () => {
    const state = divideByZero();
    expect(state.isError).toBe(true);
    expect(state.currentEntry).not.toBe("Infinity");
    expect(state.currentEntry).not.toBe("NaN");
  });

  it("clears the error and starts a fresh entry when a digit is pressed next", () => {
    const errored = divideByZero();
    const next = reduce(errored, { type: "DIGIT", digit: "7" });
    expect(next.isError).toBe(false);
    expect(next.currentEntry).toBe("7");
  });

  it("clears the error and applies an operator press as if from Initial state", () => {
    const errored = divideByZero();
    const next = reduce(errored, { type: "OPERATOR", operator: "+" });
    expect(next.isError).toBe(false);
    expect(next.previousOperand).toBe(0);
    expect(next.pendingOperator).toBe("+");
  });

  it("clears the error when clear-all is pressed", () => {
    const errored = divideByZero();
    const next = reduce(errored, { type: "CLEAR_ALL" });
    expect(next).toEqual(createInitialState());
  });
});
