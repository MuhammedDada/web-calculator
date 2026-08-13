import { useReducer } from "react";
import { createInitialState, reduce } from "../domain/calculator";
import { Display } from "./Display";
import { Keypad } from "./Keypad";
import { useKeyboard } from "./useKeyboard";

export function Calculator() {
  const [state, dispatch] = useReducer(reduce, undefined, createInitialState);
  useKeyboard(dispatch);

  return (
    <div className="calculator">
      <Display value={state.currentEntry} isError={state.isError} />
      <Keypad
        onDigit={(digit) => dispatch({ type: "DIGIT", digit })}
        onDecimalPoint={() => dispatch({ type: "DECIMAL_POINT" })}
        onOperator={(operator) => dispatch({ type: "OPERATOR", operator })}
        onPercent={() => dispatch({ type: "PERCENT" })}
        onSignToggle={() => dispatch({ type: "SIGN_TOGGLE" })}
        onClearEntry={() => dispatch({ type: "CLEAR_ENTRY" })}
        onClearAll={() => dispatch({ type: "CLEAR_ALL" })}
        onDelete={() => dispatch({ type: "DELETE" })}
        onEquals={() => dispatch({ type: "EQUALS" })}
      />
    </div>
  );
}
