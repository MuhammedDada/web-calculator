/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Calculator } from "../../src/ui/Calculator";

describe("User Story 3 accessibility (keyboard listener does not break native navigation)", () => {
  it("Tab still moves focus between buttons (the global keydown listener does not trap focus)", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    const buttons = screen.getAllByRole("button");
    buttons[0].focus();
    expect(document.activeElement).toBe(buttons[0]);

    await user.tab();
    expect(document.activeElement).toBe(buttons[1]);
  });

  it("unmapped keys do not call preventDefault or otherwise interfere", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.keyboard("q");
    expect(screen.getByRole("status").textContent).toBe("0");
  });
});
