import { describe, expect, it } from "vitest";
import { createInitialState } from "../../../src/domain/calculator";

describe("createInitialState", () => {
  it("returns the documented Initial state", () => {
    expect(createInitialState()).toEqual({
      currentEntry: "0",
      previousOperand: null,
      pendingOperator: null,
      overwriteOnNextDigit: true,
      isError: false,
      justEvaluated: false,
    });
  });

  it("returns a fresh object each call (no shared mutable state)", () => {
    const a = createInitialState();
    const b = createInitialState();
    expect(a).not.toBe(b);
  });
});
