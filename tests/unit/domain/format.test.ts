import { describe, expect, it } from "vitest";
import { formatResult } from "../../../src/domain/format";

describe("formatResult", () => {
  it("rounds 1/3 to at most 10 significant digits", () => {
    expect(formatResult(1 / 3)).toBe("0.3333333333");
  });

  it("avoids floating-point artifacts for 0.1 + 0.2", () => {
    expect(formatResult(0.1 + 0.2)).toBe("0.3");
  });

  it("rounds 200/3 to 10 significant digits", () => {
    expect(formatResult(200 / 3)).toBe("66.66666667");
  });

  it("returns whole numbers without a trailing decimal point", () => {
    expect(formatResult(42)).toBe("42");
  });

  it("preserves negative numbers", () => {
    expect(formatResult(-19)).toBe("-19");
  });
});
