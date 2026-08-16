import type { CalculatorAction, CalculatorState, Digit, Operator } from "./calculator.types";
import { formatResult } from "./format";

const MAX_ENTRY_LENGTH = 12;
const DIVIDE_BY_ZERO = Symbol("DIVIDE_BY_ZERO");

export function createInitialState(): CalculatorState {
  return {
    currentEntry: "0",
    previousOperand: null,
    pendingOperator: null,
    overwriteOnNextDigit: true,
    isError: false,
    justEvaluated: false,
  };
}

export function reduce(state: CalculatorState, action: CalculatorAction): CalculatorState {
  if (state.isError) {
    state = createInitialState();
  }

  switch (action.type) {
    case "DIGIT":
      return handleDigit(state, action.digit);
    case "DECIMAL_POINT":
      return handleDecimalPoint(state);
    case "OPERATOR":
      return handleOperator(state, action.operator);
    case "PERCENT":
      return handlePercent(state);
    case "SIGN_TOGGLE":
      return handleSignToggle(state);
    case "CLEAR_ENTRY":
      return handleClearEntry(state);
    case "CLEAR_ALL":
      return createInitialState();
    case "DELETE":
      return handleDelete(state);
    case "EQUALS":
      return handleEquals(state);
  }
}

function handleDigit(state: CalculatorState, digit: Digit): CalculatorState {
  if (state.overwriteOnNextDigit) {
    return { ...state, currentEntry: digit, overwriteOnNextDigit: false, justEvaluated: false };
  }
  if (state.currentEntry === "0") {
    return { ...state, currentEntry: digit, justEvaluated: false };
  }
  if (state.currentEntry.length >= MAX_ENTRY_LENGTH) {
    return state;
  }
  return { ...state, currentEntry: state.currentEntry + digit, justEvaluated: false };
}

function handleDecimalPoint(state: CalculatorState): CalculatorState {
  if (state.overwriteOnNextDigit) {
    return { ...state, currentEntry: "0.", overwriteOnNextDigit: false, justEvaluated: false };
  }
  if (state.currentEntry.includes(".") || state.currentEntry.length >= MAX_ENTRY_LENGTH) {
    return state;
  }
  return { ...state, currentEntry: state.currentEntry + ".", justEvaluated: false };
}

function handleOperator(state: CalculatorState, operator: Operator): CalculatorState {
  if (state.pendingOperator && state.overwriteOnNextDigit) {
    // Newest operator replaces the previous one (no second operand typed yet).
    return { ...state, pendingOperator: operator, justEvaluated: false };
  }

  const currentValue = Number(state.currentEntry);

  if (state.pendingOperator !== null && state.previousOperand !== null) {
    const result = applyOperator(state.previousOperand, state.pendingOperator, currentValue);
    if (result === DIVIDE_BY_ZERO) {
      return toErrorState(state);
    }
    const rounded = formatResult(result);
    return {
      ...state,
      currentEntry: rounded,
      previousOperand: Number(rounded),
      pendingOperator: operator,
      overwriteOnNextDigit: true,
      justEvaluated: false,
    };
  }

  return {
    ...state,
    previousOperand: currentValue,
    pendingOperator: operator,
    overwriteOnNextDigit: true,
    justEvaluated: false,
  };
}

function handlePercent(state: CalculatorState): CalculatorState {
  const currentValue = Number(state.currentEntry);

  if (state.pendingOperator !== null && state.previousOperand !== null) {
    const percentageOfPrevious = state.previousOperand * (currentValue / 100);
    const result = applyOperator(state.previousOperand, state.pendingOperator, percentageOfPrevious);
    if (result === DIVIDE_BY_ZERO) {
      return toErrorState(state);
    }
    return {
      ...state,
      currentEntry: formatResult(result),
      previousOperand: null,
      pendingOperator: null,
      overwriteOnNextDigit: true,
      justEvaluated: true,
    };
  }

  return {
    ...state,
    currentEntry: formatResult(currentValue / 100),
    overwriteOnNextDigit: true,
    justEvaluated: false,
  };
}

function handleSignToggle(state: CalculatorState): CalculatorState {
  if (state.currentEntry === "0") {
    return state;
  }
  const flipped = state.currentEntry.startsWith("-")
    ? state.currentEntry.slice(1)
    : `-${state.currentEntry}`;
  return { ...state, currentEntry: flipped };
}

function handleClearEntry(state: CalculatorState): CalculatorState {
  return { ...state, currentEntry: "0", overwriteOnNextDigit: true, justEvaluated: false };
}

function handleDelete(state: CalculatorState): CalculatorState {
  if (state.currentEntry.length <= 1) {
    return { ...state, currentEntry: "0", justEvaluated: false };
  }
  const next = state.currentEntry.slice(0, -1);
  const cleaned = next === "-" ? "0" : next;
  return { ...state, currentEntry: cleaned, justEvaluated: false };
}

function handleEquals(state: CalculatorState): CalculatorState {
  if (state.justEvaluated) {
    return state;
  }
  if (state.pendingOperator === null) {
    return state;
  }
  if (state.overwriteOnNextDigit) {
    // Premature equals: operator selected but no second operand ever entered — no-op.
    return state;
  }

  const a = state.previousOperand ?? 0;
  const b = Number(state.currentEntry);
  const result = applyOperator(a, state.pendingOperator, b);
  if (result === DIVIDE_BY_ZERO) {
    return toErrorState(state);
  }

  return {
    ...state,
    currentEntry: formatResult(result),
    previousOperand: null,
    pendingOperator: null,
    overwriteOnNextDigit: true,
    justEvaluated: true,
  };
}

function applyOperator(a: number, operator: Operator, b: number): number | typeof DIVIDE_BY_ZERO {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? DIVIDE_BY_ZERO : a / b;
  }
}

function toErrorState(state: CalculatorState): CalculatorState {
  return { ...state, currentEntry: "Error", isError: true };
}
