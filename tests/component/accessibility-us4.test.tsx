/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Calculator } from "../../src/ui/Calculator";

describe("User Story 4 accessibility (keyboard operability, labelling)", () => {
  it("the percent control is a labelled, keyboard-focusable button", () => {
    render(<Calculator />);
    const percent = screen.getByRole("button", { name: "Percent" });
    expect(percent.tagName).toBe("BUTTON");

    percent.focus();
    expect(document.activeElement).toBe(percent);
  });
});
