/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Calculator } from "../../src/ui/Calculator";

function display() {
  return screen.getByRole("status");
}

async function calculate(
  user: ReturnType<typeof userEvent.setup>,
  a: string,
  op: string,
  b: string,
) {
  for (const ch of a) {
    await user.click(screen.getByRole("button", { name: ch }));
  }
  await user.click(screen.getByRole("button", { name: op }));
  for (const ch of b) {
    await user.click(screen.getByRole("button", { name: ch }));
  }
  await user.click(screen.getByRole("button", { name: "Equals" }));
}

async function openHistory(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "History" }));
}

describe("reuse a past calculation (User Story 2)", () => {
  it("loads the entry's result as the current entry and closes the panel", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await calculate(user, "12", "Add", "7");
    expect(display().textContent).toBe("19");

    await openHistory(user);
    await user.click(screen.getByRole("button", { name: "Reuse 12 + 7 = 19" }));

    expect(display().textContent).toBe("19");
    expect(screen.getByRole("button", { name: "1" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Clear history" })).toBeNull();
  });

  it("replaces an in-progress calculation when a history entry is selected", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await calculate(user, "12", "Add", "7");

    await user.click(screen.getByRole("button", { name: "5" }));
    await user.click(screen.getByRole("button", { name: "0" }));
    await user.click(screen.getByRole("button", { name: "Add" }));

    await openHistory(user);
    await user.click(screen.getByRole("button", { name: "Reuse 12 + 7 = 19" }));

    expect(display().textContent).toBe("19");
  });

  it("continues calculating normally from the reused value", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await calculate(user, "12", "Add", "7");
    await openHistory(user);
    await user.click(screen.getByRole("button", { name: "Reuse 12 + 7 = 19" }));

    await user.click(screen.getByRole("button", { name: "Add" }));
    await user.click(screen.getByRole("button", { name: "3" }));
    await user.click(screen.getByRole("button", { name: "Equals" }));

    expect(display().textContent).toBe("22");
  });

  it("does not itself add a new history entry when selected (FR-009)", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await calculate(user, "12", "Add", "7");
    await openHistory(user);
    const beforeCount = screen.getAllByRole("button", { name: /^Reuse/ }).length;

    await user.click(screen.getByRole("button", { name: "Reuse 12 + 7 = 19" }));
    await openHistory(user);
    const afterCount = screen.getAllByRole("button", { name: /^Reuse/ }).length;

    expect(afterCount).toBe(beforeCount);
  });
});
