import { describe, expect, it } from "vitest";
import { createInitialState, reduce } from "../../../src/domain/calculator";

describe("clear-all (AC)", () => {
  it("resets to exactly the Initial state from mid-calculation", () => {
    let state = createInitialState();
    state = reduce(state, { type: "DIGIT", digit: "5" });
    state = reduce(state, { type: "OPERATOR", operator: "+" });
    state = reduce(state, { type: "DIGIT", digit: "3" });
    state = reduce(state, { type: "CLEAR_ALL" });

    expect(state).toEqual(createInitialState());
  });

  it("resets to Initial state from an error state", () => {
    let state = createInitialState();
    state = reduce(state, { type: "DIGIT", digit: "5" });
    state = reduce(state, { type: "OPERATOR", operator: "/" });
    state = reduce(state, { type: "DIGIT", digit: "0" });
    state = reduce(state, { type: "EQUALS" });
    expect(state.isError).toBe(true);

    state = reduce(state, { type: "CLEAR_ALL" });
    expect(state).toEqual(createInitialState());
  });
});
