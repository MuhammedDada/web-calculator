/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Calculator } from "../../src/ui/Calculator";

describe("User Story 3 accessibility: clear-history button", () => {
  it("is a labelled, keyboard-activatable button", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole("button", { name: "5" }));
    await user.click(screen.getByRole("button", { name: "Add" }));
    await user.click(screen.getByRole("button", { name: "3" }));
    await user.click(screen.getByRole("button", { name: "Equals" }));
    await user.click(screen.getByRole("button", { name: "History" }));

    const clearButton = screen.getByRole("button", { name: "Clear history" });
    expect(clearButton.tagName).toBe("BUTTON");

    clearButton.focus();
    expect(document.activeElement).toBe(clearButton);

    // Space, not Enter — Enter is globally mapped to "=" by the keyboard contract
    // regardless of focus, so it wouldn't trigger this button's native activation.
    await user.keyboard(" ");
    expect(screen.queryByRole("button", { name: /^Reuse/ })).toBeNull();
  });
});
