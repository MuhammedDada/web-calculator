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

describe("operator selection and chaining", () => {
  it("evaluates the pending operation immediately when a second operator is chained (5 + 3 +)", () => {
    let state = createInitialState();
    state = typeDigits(state, "5");
    state = reduce(state, { type: "OPERATOR", operator: "+" });
    state = typeDigits(state, "3");
    state = reduce(state, { type: "OPERATOR", operator: "+" });
    expect(state.currentEntry).toBe("8");
    expect(state.pendingOperator).toBe("+");
  });

  it("newest-operator-wins: pressing an operator twice in a row replaces the pending operator", () => {
    let state = createInitialState();
    state = typeDigits(state, "7");
    state = reduce(state, { type: "OPERATOR", operator: "+" });
    state = reduce(state, { type: "OPERATOR", operator: "-" });
    expect(state.pendingOperator).toBe("-");
    expect(state.previousOperand).toBe(7);
    expect(state.currentEntry).toBe("7");
  });

  it("uses a displayed result as the starting value for the next calculation after equals", () => {
    let state = createInitialState();
    state = typeDigits(state, "12");
    state = reduce(state, { type: "OPERATOR", operator: "+" });
    state = typeDigits(state, "7");
    state = reduce(state, { type: "EQUALS" });
    expect(state.currentEntry).toBe("19");

    state = reduce(state, { type: "OPERATOR", operator: "+" });
    state = typeDigits(state, "3");
    state = reduce(state, { type: "EQUALS" });
    expect(state.currentEntry).toBe("22");
  });
});
