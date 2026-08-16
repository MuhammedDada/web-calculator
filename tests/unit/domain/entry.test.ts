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

describe("digit and decimal-point entry", () => {
  it("appends successive digits", () => {
    let state = createInitialState();
    state = typeDigits(state, "12");
    expect(state.currentEntry).toBe("12");
  });

  it("does not build a leading zero (0 then 5 becomes 5, not 05)", () => {
    let state = createInitialState();
    state = typeDigits(state, "05");
    expect(state.currentEntry).toBe("5");
  });

  it("replaces the current entry instead of appending when overwriteOnNextDigit is true", () => {
    let state = createInitialState();
    state = typeDigits(state, "12");
    state = reduce(state, { type: "OPERATOR", operator: "+" });
    expect(state.overwriteOnNextDigit).toBe(true);
    state = reduce(state, { type: "DIGIT", digit: "7" });
    expect(state.currentEntry).toBe("7");
  });

  it("starts a decimal entry with a leading zero (0.)", () => {
    let state = createInitialState();
    state = reduce(state, { type: "DECIMAL_POINT" });
    expect(state.currentEntry).toBe("0.");
    state = reduce(state, { type: "DIGIT", digit: "5" });
    expect(state.currentEntry).toBe("0.5");
  });

  it("ignores a second decimal point in the same number — first one wins", () => {
    let state = createInitialState();
    state = typeDigits(state, "1");
    state = reduce(state, { type: "DECIMAL_POINT" });
    state = typeDigits(state, "2");
    state = reduce(state, { type: "DECIMAL_POINT" });
    state = typeDigits(state, "3");
    expect(state.currentEntry).toBe("1.23");
  });

  it("caps currentEntry at 12 characters, ignoring further digit presses", () => {
    let state = createInitialState();
    state = typeDigits(state, "123456789012345");
    expect(state.currentEntry).toHaveLength(12);
    expect(state.currentEntry).toBe("123456789012");
  });
});
