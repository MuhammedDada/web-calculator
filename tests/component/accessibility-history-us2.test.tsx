/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Calculator } from "../../src/ui/Calculator";

function display() {
  return screen.getByRole("status");
}

describe("User Story 2 accessibility: history entry rows are keyboard-activatable", () => {
  it("a history row can be activated with Space, not just a click", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole("button", { name: "9" }));
    await user.click(screen.getByRole("button", { name: "Add" }));
    await user.click(screen.getByRole("button", { name: "1" }));
    await user.click(screen.getByRole("button", { name: "Equals" }));
    await user.click(screen.getByRole("button", { name: "History" }));

    const row = screen.getByRole("button", { name: "Reuse 9 + 1 = 10" });
    row.focus();
    await user.keyboard(" ");

    expect(display().textContent).toBe("10");
  });
});
