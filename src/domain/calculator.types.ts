export type Operator = "+" | "-" | "*" | "/";

export type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export type CalculatorAction =
  | { type: "DIGIT"; digit: Digit }
  | { type: "DECIMAL_POINT" }
  | { type: "OPERATOR"; operator: Operator }
  | { type: "PERCENT" }
  | { type: "SIGN_TOGGLE" }
  | { type: "CLEAR_ENTRY" }
  | { type: "CLEAR_ALL" }
  | { type: "DELETE" }
  | { type: "EQUALS" };

export interface CalculatorState {
  currentEntry: string;
  previousOperand: number | null;
  pendingOperator: Operator | null;
  overwriteOnNextDigit: boolean;
  isError: boolean;
  justEvaluated: boolean;
}
