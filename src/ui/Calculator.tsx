import { useState, useReducer } from "react";
import { createInitialState, reduce } from "../domain/calculator";
import { formatResult } from "../domain/format";
import type { CalculatorAction } from "../domain/calculator.types";
import { Display } from "./Display";
import { Keypad } from "./Keypad";
import { useKeyboard } from "./useKeyboard";
import { useHistory } from "./useHistory";
import type { HistoryEntry } from "./useHistory";
import { HistoryPanel } from "./HistoryPanel";
import { Button } from "./Button";
import type { Digit } from "../domain/calculator.types";

export function Calculator() {
  const [state, dispatch] = useReducer(reduce, undefined, createInitialState);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const history = useHistory();

  function captureIfEvaluated(action: CalculatorAction, suffix = "") {
    const nextState = reduce(state, action);
    if (!state.justEvaluated && nextState.justEvaluated && !nextState.isError) {
      const expression = `${formatResult(state.previousOperand ?? 0)} ${state.pendingOperator} ${state.currentEntry}${suffix}`;
      history.addEntry(expression, nextState.currentEntry);
    }
  }

  function handleEquals() {
    captureIfEvaluated({ type: "EQUALS" });
    dispatch({ type: "EQUALS" });
  }

  function handlePercent() {
    captureIfEvaluated({ type: "PERCENT" }, "%");
    dispatch({ type: "PERCENT" });
  }

  function handleReuse(entry: HistoryEntry) {
    dispatch({ type: "CLEAR_ALL" });
    const isNegative = entry.result.startsWith("-");
    const digits = isNegative ? entry.result.slice(1) : entry.result;
    for (const char of digits) {
      if (char === ".") {
        dispatch({ type: "DECIMAL_POINT" });
      } else {
        dispatch({ type: "DIGIT", digit: char as Digit });
      }
    }
    if (isNegative) {
      dispatch({ type: "SIGN_TOGGLE" });
    }
    setIsHistoryOpen(false);
  }

  useKeyboard((action) => {
    if (action.type === "EQUALS") {
      handleEquals();
      return;
    }
    if (action.type === "PERCENT") {
      handlePercent();
      return;
    }
    dispatch(action);
  });

  return (
    <div className="calculator">
      <Display value={state.currentEntry} isError={state.isError} />
      <div className="toolbar">
        <Button
          variant="action"
          onClick={() => setIsHistoryOpen((open) => !open)}
          aria-pressed={isHistoryOpen}
        >
          History
        </Button>
      </div>
      {isHistoryOpen ? (
        <HistoryPanel
          entries={history.entries}
          onSelect={handleReuse}
          onClear={history.clear}
        />
      ) : (
        <Keypad
          onDigit={(digit) => dispatch({ type: "DIGIT", digit })}
          onDecimalPoint={() => dispatch({ type: "DECIMAL_POINT" })}
          onOperator={(operator) => dispatch({ type: "OPERATOR", operator })}
          onPercent={handlePercent}
          onSignToggle={() => dispatch({ type: "SIGN_TOGGLE" })}
          onClearEntry={() => dispatch({ type: "CLEAR_ENTRY" })}
          onClearAll={() => dispatch({ type: "CLEAR_ALL" })}
          onDelete={() => dispatch({ type: "DELETE" })}
          onEquals={handleEquals}
        />
      )}
    </div>
  );
}
