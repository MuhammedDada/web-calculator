/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Calculator } from "../../src/ui/Calculator";

async function calculate(user: ReturnType<typeof userEvent.setup>, n: number) {
  for (const char of String(n)) {
    await user.click(screen.getByRole("button", { name: char }));
  }
  await user.click(screen.getByRole("button", { name: "Add" }));
  await user.click(screen.getByRole("button", { name: "0" }));
  await user.click(screen.getByRole("button", { name: "Equals" }));
}

function openHistory(user: ReturnType<typeof userEvent.setup>) {
  return user.click(screen.getByRole("button", { name: "History" }));
}

describe("history cap and error exclusion (User Story 1)", () => {
  it("caps history at 20 entries, dropping the oldest", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    for (let i = 1; i <= 21; i++) {
      await calculate(user, i);
    }

    await openHistory(user);

    const rows = screen.getAllByRole("button", { name: /^Reuse/ });
    expect(rows).toHaveLength(20);
    expect(rows[0].getAttribute("aria-label")).toBe("Reuse 21 + 0 = 21");
    expect(rows.some((row) => row.getAttribute("aria-label") === "Reuse 1 + 0 = 1")).toBe(
      false,
    );
  }, 20000);

  it("never records an errored calculation (e.g., divide by zero)", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole("button", { name: "2" }));
    await user.click(screen.getByRole("button", { name: "Add" }));
    await user.click(screen.getByRole("button", { name: "2" }));
    await user.click(screen.getByRole("button", { name: "Equals" }));

    await user.click(screen.getByRole("button", { name: "5" }));
    await user.click(screen.getByRole("button", { name: "Divide" }));
    await user.click(screen.getByRole("button", { name: "0" }));
    await user.click(screen.getByRole("button", { name: "Equals" }));

    await openHistory(user);

    const rows = screen.getAllByRole("button", { name: /^Reuse/ });
    expect(rows).toHaveLength(1);
    expect(rows[0].getAttribute("aria-label")).toBe("Reuse 2 + 2 = 4");
  });
});
