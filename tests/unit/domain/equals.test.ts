import { describe, expect, it } from "vitest";
import { createInitialState, reduce } from "../../../src/domain/calculator";
import type { CalculatorState, Operator } from "../../../src/domain/calculator.types";
import type { Digit } from "../../../src/domain/calculator.types";

function typeDigits(state: CalculatorState, digits: string): CalculatorState {
  for (const char of digits) {
    state = reduce(state, { type: "DIGIT", digit: char as Digit });
  }
  return state;
}

function calculate(a: string, op: Operator, b: string): CalculatorState {
  let state = createInitialState();
  state = typeDigits(state, a);
  state = reduce(state, { type: "OPERATOR", operator: op });
  state = typeDigits(state, b);
  return reduce(state, { type: "EQUALS" });
}

describe("equals evaluation", () => {
  it("adds", () => {
    expect(calculate("12", "+", "7").currentEntry).toBe("19");
  });

  it("subtracts", () => {
    expect(calculate("12", "-", "7").currentEntry).toBe("5");
  });

  it("multiplies", () => {
    expect(calculate("6", "*", "7").currentEntry).toBe("42");
  });

  it("divides", () => {
    expect(calculate("20", "/", "4").currentEntry).toBe("5");
  });

  it("rounds the result to at most 10 significant digits", () => {
    expect(calculate("1", "/", "3").currentEntry).toBe("0.3333333333");
  });

  it("clears the pending operator and marks justEvaluated after equals", () => {
    const state = calculate("5", "+", "3");
    expect(state.pendingOperator).toBeNull();
    expect(state.previousOperand).toBeNull();
    expect(state.justEvaluated).toBe(true);
  });

  it("is a no-op when equals is pressed again with no new input (no repeat operation)", () => {
    const evaluated = calculate("5", "+", "3");
    const again = reduce(evaluated, { type: "EQUALS" });
    expect(again).toEqual(evaluated);
  });

  it("is a strict no-op when equals is pressed with no second operand ever entered (premature equals)", () => {
    let state = createInitialState();
    state = typeDigits(state, "7");
    state = reduce(state, { type: "OPERATOR", operator: "+" });
    const beforeEquals = state;
    state = reduce(state, { type: "EQUALS" });
    expect(state).toEqual(beforeEquals);
  });
});
