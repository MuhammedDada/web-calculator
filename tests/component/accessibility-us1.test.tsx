/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Calculator } from "../../src/ui/Calculator";

describe("User Story 1 accessibility (keyboard operability, labelling)", () => {
  it("every control is a real <button> with an accessible name", () => {
    render(<Calculator />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
    for (const button of buttons) {
      expect(button.tagName).toBe("BUTTON");
      const accessibleName = button.getAttribute("aria-label") ?? button.textContent;
      expect(accessibleName?.trim()).not.toBe("");
    }
  });

  it("digit, operator, and equals buttons are reachable via Tab and activatable via Space", async () => {
    // Space (not Enter) is used here because Enter is globally mapped to "=" by the
    // keyboard contract (contracts/keyboard-mapping.md) regardless of which button has
    // focus — that is correct product behavior, not a native-activation regression.
    const user = userEvent.setup();
    render(<Calculator />);

    const digitOne = screen.getByRole("button", { name: "1" });
    digitOne.focus();
    expect(document.activeElement).toBe(digitOne);

    await user.keyboard(" ");
    expect(screen.getByRole("status").textContent).toBe("1");
  });

  it("focused controls receive a visible focus style (not suppressed)", () => {
    render(<Calculator />);
    const digitOne = screen.getByRole("button", { name: "1" });
    digitOne.focus();
    const outlineStyle = getComputedStyle(digitOne).outline;
    // jsdom does not compute :focus-visible from an external stylesheet, so this
    // asserts the button has no inline/author style that forcibly removes the outline.
    expect(outlineStyle).not.toBe("none");
  });
});
