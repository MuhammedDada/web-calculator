/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Calculator } from "../../src/ui/Calculator";

describe("User Story 1 accessibility: history toggle and entry rows", () => {
  it("the history toggle is a labelled, keyboard-focusable button", () => {
    render(<Calculator />);
    const toggle = screen.getByRole("button", { name: "History" });
    expect(toggle.tagName).toBe("BUTTON");
    toggle.focus();
    expect(document.activeElement).toBe(toggle);
  });

  it("history entry rows are real, labelled buttons reachable via keyboard", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole("button", { name: "5" }));
    await user.click(screen.getByRole("button", { name: "Add" }));
    await user.click(screen.getByRole("button", { name: "3" }));
    await user.click(screen.getByRole("button", { name: "Equals" }));
    await user.click(screen.getByRole("button", { name: "History" }));

    const row = screen.getByRole("button", { name: "Reuse 5 + 3 = 8" });
    expect(row.tagName).toBe("BUTTON");
    row.focus();
    expect(document.activeElement).toBe(row);
  });

  it("focused history controls receive a visible focus style (not suppressed)", async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    await user.click(screen.getByRole("button", { name: "History" }));
    const clearButton = screen.getByRole("button", { name: "Clear history" });
    clearButton.focus();
    expect(getComputedStyle(clearButton).outline).not.toBe("none");
  });
});
