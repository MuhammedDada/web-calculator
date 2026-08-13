/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Calculator } from "../../src/ui/Calculator";

describe("User Story 2 accessibility (keyboard operability, labelling)", () => {
  it.each(["Clear all", "Clear entry", "Delete last digit"])(
    "%s is a labelled, keyboard-activatable control",
    async (name) => {
      const user = userEvent.setup();
      render(<Calculator />);

      const button = screen.getByRole("button", { name });
      expect(button.tagName).toBe("BUTTON");

      button.focus();
      expect(document.activeElement).toBe(button);

      await user.keyboard("{Enter}");
      // No crash / no thrown error is the assertion here — clicking these controls
      // from a fresh state (already Initial) should safely no-op or reset.
      expect(screen.getByRole("status").textContent).toBe("0");
    },
  );
});
