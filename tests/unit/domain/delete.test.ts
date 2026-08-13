import { describe, expect, it } from "vitest";
import { createInitialState, reduce } from "../../../src/domain/calculator";

describe("delete", () => {
  it("removes the last character of currentEntry", () => {
    let state = createInitialState();
    state = reduce(state, { type: "DIGIT", digit: "1" });
    state = reduce(state, { type: "DIGIT", digit: "2" });
    state = reduce(state, { type: "DIGIT", digit: "3" });
    state = reduce(state, { type: "DELETE" });
    expect(state.currentEntry).toBe("12");
  });

  it("is a no-op when currentEntry is already 0", () => {
    const state = reduce(createInitialState(), { type: "DELETE" });
    expect(state.currentEntry).toBe("0");
  });

  it("collapses to 0 after deleting the last remaining digit", () => {
    let state = createInitialState();
    state = reduce(state, { type: "DIGIT", digit: "7" });
    state = reduce(state, { type: "DELETE" });
    expect(state.currentEntry).toBe("0");
  });
});
