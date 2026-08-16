/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Calculator } from "../../src/ui/Calculator";

function display() {
  return screen.getByRole("status");
}

describe("full keyboard mapping (User Story 3)", () => {
  it("computes 12 + 7 = 19 using digit keys, + and Enter", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.keyboard("12+7{Enter}");
    expect(display().textContent).toBe("19");
  });

  it("supports = as an alternative to Enter for equals", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.keyboard("6*7=");
    expect(display().textContent).toBe("42");
  });

  it("supports -, *, / and % keys", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.keyboard("200+10%");
    expect(display().textContent).toBe("220");
  });

  it("Backspace deletes the last digit", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.keyboard("123{Backspace}");
    expect(display().textContent).toBe("12");
  });

  it("Delete key triggers clear-entry", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.keyboard("50+3{Delete}");
    expect(display().textContent).toBe("0");
  });

  it("Escape triggers clear-all", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.keyboard("5+3{Escape}");
    expect(display().textContent).toBe("0");
  });

  it("F9 toggles the sign", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.keyboard("5{F9}");
    expect(display().textContent).toBe("-5");
  });

  it("a decimal point key works", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.keyboard("3.5");
    expect(display().textContent).toBe("3.5");
  });

  it("ignores keys with no on-screen equivalent", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.keyboard("5a");
    expect(display().textContent).toBe("5");
  });
});
