/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Calculator } from "../../src/ui/Calculator";

function display() {
  return screen.getByRole("status");
}

describe("clear history (User Story 3)", () => {
  it("empties the list immediately with no confirmation step", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole("button", { name: "5" }));
    await user.click(screen.getByRole("button", { name: "Add" }));
    await user.click(screen.getByRole("button", { name: "3" }));
    await user.click(screen.getByRole("button", { name: "Equals" }));

    await user.click(screen.getByRole("button", { name: "History" }));
    expect(screen.getAllByRole("button", { name: /^Reuse/ })).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "Clear history" }));

    expect(screen.queryByRole("button", { name: /^Reuse/ })).toBeNull();
    expect(screen.getByText(/no calculations yet/i)).toBeTruthy();
  });

  it("does not affect an in-progress calculation on the main display", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole("button", { name: "5" }));
    await user.click(screen.getByRole("button", { name: "Add" }));
    await user.click(screen.getByRole("button", { name: "3" }));
    await user.click(screen.getByRole("button", { name: "Equals" }));

    await user.click(screen.getByRole("button", { name: "5" }));
    await user.click(screen.getByRole("button", { name: "0" }));
    await user.click(screen.getByRole("button", { name: "Add" }));
    // "50 +" pending, currentEntry showing "50"
    expect(display().textContent).toBe("50");

    await user.click(screen.getByRole("button", { name: "History" }));
    await user.click(screen.getByRole("button", { name: "Clear history" }));

    // The display is rendered outside the keypad/panel swap, so it's checkable
    // regardless of which one is currently showing; clearing must not touch it.
    expect(display().textContent).toBe("50");

    // Close the panel to resume calculating, and confirm the pending "50 +" survived.
    await user.click(screen.getByRole("button", { name: "History" }));
    await user.click(screen.getByRole("button", { name: "4" }));
    await user.click(screen.getByRole("button", { name: "Equals" }));
    expect(display().textContent).toBe("54");
  });

  it("is a safe no-op when history is already empty", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole("button", { name: "History" }));
    await user.click(screen.getByRole("button", { name: "Clear history" }));
    await user.click(screen.getByRole("button", { name: "Clear history" }));

    expect(screen.getByText(/no calculations yet/i)).toBeTruthy();
  });
});
