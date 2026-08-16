/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Calculator } from "../../src/ui/Calculator";

function display() {
  return screen.getByRole("status");
}

describe("basic calculation (User Story 1)", () => {
  it("computes 12 + 7 = 19 via on-screen buttons, then chains + 3 = 22", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    expect(display().textContent).toBe("0");

    await user.click(screen.getByRole("button", { name: "1" }));
    expect(display().textContent).not.toBe("");
    await user.click(screen.getByRole("button", { name: "2" }));
    await user.click(screen.getByRole("button", { name: "Add" }));
    expect(display().textContent).not.toBe("");
    await user.click(screen.getByRole("button", { name: "7" }));
    await user.click(screen.getByRole("button", { name: "Equals" }));

    expect(display().textContent).toBe("19");

    await user.click(screen.getByRole("button", { name: "Add" }));
    await user.click(screen.getByRole("button", { name: "3" }));
    await user.click(screen.getByRole("button", { name: "Equals" }));

    expect(display().textContent).toBe("22");
  });

  it("never leaves the display blank or undefined during entry", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    for (const name of ["4", "2"]) {
      await user.click(screen.getByRole("button", { name }));
      const text = display().textContent;
      expect(text).not.toBe("");
      expect(text).not.toBeUndefined();
    }
  });
});
