/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Calculator } from "../../src/ui/Calculator";

function openHistory(user: ReturnType<typeof userEvent.setup>) {
  return user.click(screen.getByRole("button", { name: "History" }));
}

describe("view recent calculation history (User Story 1)", () => {
  it("shows an empty state before any calculation has been completed", async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    await openHistory(user);
    const emptyMessage = screen.getByText(/no calculations yet/i);
    expect(emptyMessage.textContent).toMatch(/no calculations yet/i);
  });

  it("records completed calculations, most-recent-first", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole("button", { name: "1" }));
    await user.click(screen.getByRole("button", { name: "2" }));
    await user.click(screen.getByRole("button", { name: "Add" }));
    await user.click(screen.getByRole("button", { name: "7" }));
    await user.click(screen.getByRole("button", { name: "Equals" }));

    await user.click(screen.getByRole("button", { name: "6" }));
    await user.click(screen.getByRole("button", { name: "Multiply" }));
    await user.click(screen.getByRole("button", { name: "7" }));
    await user.click(screen.getByRole("button", { name: "Equals" }));

    await openHistory(user);

    const rows = screen.getAllByRole("button", { name: /^Reuse/ });
    expect(rows).toHaveLength(2);
    expect(rows[0].getAttribute("aria-label")).toBe("Reuse 6 * 7 = 42");
    expect(rows[1].getAttribute("aria-label")).toBe("Reuse 12 + 7 = 19");
  });

  it("records a percent-against-a-pending-operation calculation too", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole("button", { name: "2" }));
    await user.click(screen.getByRole("button", { name: "0" }));
    await user.click(screen.getByRole("button", { name: "0" }));
    await user.click(screen.getByRole("button", { name: "Add" }));
    await user.click(screen.getByRole("button", { name: "1" }));
    await user.click(screen.getByRole("button", { name: "0" }));
    await user.click(screen.getByRole("button", { name: "Percent" }));

    await openHistory(user);

    expect(
      screen.getByRole("button", { name: "Reuse 200 + 10% = 220" }),
    ).toBeTruthy();
  });
});
