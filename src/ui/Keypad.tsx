import type { Digit, Operator } from "../domain/calculator.types";
import { Button } from "./Button";

interface KeypadProps {
  onDigit: (digit: Digit) => void;
  onDecimalPoint: () => void;
  onOperator: (operator: Operator) => void;
  onPercent: () => void;
  onSignToggle: () => void;
  onClearEntry: () => void;
  onClearAll: () => void;
  onDelete: () => void;
  onEquals: () => void;
}

const DIGIT_ROWS: readonly Digit[][] = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
];

export function Keypad(props: KeypadProps) {
  const {
    onDigit,
    onDecimalPoint,
    onOperator,
    onPercent,
    onSignToggle,
    onClearEntry,
    onClearAll,
    onDelete,
    onEquals,
  } = props;

  return (
    <div className="keypad">
      <Button variant="action" onClick={onClearAll} aria-label="Clear all">
        AC
      </Button>
      <Button variant="action" onClick={onClearEntry} aria-label="Clear entry">
        CE
      </Button>
      <Button variant="action" onClick={onDelete} aria-label="Delete last digit">
        ⌫
      </Button>
      <Button variant="operator" onClick={() => onOperator("/")} aria-label="Divide">
        ÷
      </Button>

      {DIGIT_ROWS.slice(0, 1).flatMap((row) =>
        row.map((digit) => (
          <Button key={digit} onClick={() => onDigit(digit)}>
            {digit}
          </Button>
        )),
      )}
      <Button variant="operator" onClick={() => onOperator("*")} aria-label="Multiply">
        ×
      </Button>

      {DIGIT_ROWS.slice(1, 2).flatMap((row) =>
        row.map((digit) => (
          <Button key={digit} onClick={() => onDigit(digit)}>
            {digit}
          </Button>
        )),
      )}
      <Button variant="operator" onClick={() => onOperator("-")} aria-label="Subtract">
        −
      </Button>

      {DIGIT_ROWS.slice(2, 3).flatMap((row) =>
        row.map((digit) => (
          <Button key={digit} onClick={() => onDigit(digit)}>
            {digit}
          </Button>
        )),
      )}
      <Button variant="operator" onClick={() => onOperator("+")} aria-label="Add">
        +
      </Button>

      <Button variant="action" onClick={onSignToggle} aria-label="Toggle sign">
        +/−
      </Button>
      <Button onClick={() => onDigit("0")}>0</Button>
      <Button onClick={onDecimalPoint} aria-label="Decimal point">
        .
      </Button>
      <Button variant="operator" onClick={onPercent} aria-label="Percent">
        %
      </Button>

      <Button variant="equals" onClick={onEquals} className="btn-equals-wide" aria-label="Equals">
        =
      </Button>
    </div>
  );
}
