/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Calculator } from "../../src/ui/Calculator";

function display() {
  return screen.getByRole("status");
}

describe("quickstart scenarios not otherwise covered at the component level", () => {
  it("scenario 2 — sign toggle via the on-screen button", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole("button", { name: "5" }));
    await user.click(screen.getByRole("button", { name: "Toggle sign" }));

    expect(display().textContent).toBe("-5");
  });

  it("scenario 6 — divide by zero shows an error, and any digit press recovers", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole("button", { name: "5" }));
    await user.click(screen.getByRole("button", { name: "Divide" }));
    await user.click(screen.getByRole("button", { name: "0" }));
    await user.click(screen.getByRole("button", { name: "Equals" }));

    expect(display().getAttribute("data-error")).toBe("true");

    await user.click(screen.getByRole("button", { name: "7" }));
    expect(display().getAttribute("data-error")).toBeNull();
    expect(display().textContent).toBe("7");
  });
});
