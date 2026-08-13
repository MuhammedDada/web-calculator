import { useEffect } from "react";
import type { CalculatorAction, Digit, Operator } from "../domain/calculator.types";

const OPERATOR_KEYS: Record<string, Operator> = {
  "+": "+",
  "-": "-",
  "*": "*",
  "/": "/",
};

function mapKeyToAction(key: string): CalculatorAction | null {
  if (/^[0-9]$/.test(key)) {
    return { type: "DIGIT", digit: key as Digit };
  }
  if (key === ".") {
    return { type: "DECIMAL_POINT" };
  }
  if (key in OPERATOR_KEYS) {
    return { type: "OPERATOR", operator: OPERATOR_KEYS[key] };
  }
  if (key === "%") {
    return { type: "PERCENT" };
  }
  if (key === "Enter" || key === "=") {
    return { type: "EQUALS" };
  }
  if (key === "Backspace") {
    return { type: "DELETE" };
  }
  if (key === "Delete") {
    return { type: "CLEAR_ENTRY" };
  }
  if (key === "Escape") {
    return { type: "CLEAR_ALL" };
  }
  if (key === "F9") {
    return { type: "SIGN_TOGGLE" };
  }
  return null;
}

export function useKeyboard(dispatch: (action: CalculatorAction) => void) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const action = mapKeyToAction(event.key);
      if (action === null) {
        return;
      }
      event.preventDefault();
      dispatch(action);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);
}
