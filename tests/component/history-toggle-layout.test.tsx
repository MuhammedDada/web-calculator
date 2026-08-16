/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Calculator } from "../../src/ui/Calculator";

describe("history toggle replaces the keypad in place (User Story 1)", () => {
  it("swaps between keypad and history panel; display and toggle stay visible throughout", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    expect(screen.getByRole("button", { name: "1" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Clear history" })).toBeNull();
    expect(screen.getByRole("status")).toBeTruthy();
    expect(screen.getByRole("button", { name: "History" })).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "History" }));

    expect(screen.queryByRole("button", { name: "1" })).toBeNull();
    expect(screen.getByRole("button", { name: "Clear history" })).toBeTruthy();
    expect(screen.getByRole("status")).toBeTruthy();
    expect(screen.getByRole("button", { name: "History" })).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "History" }));

    expect(screen.getByRole("button", { name: "1" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Clear history" })).toBeNull();
  });
});
