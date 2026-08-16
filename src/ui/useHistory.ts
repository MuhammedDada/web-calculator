import { useCallback, useState } from "react";

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
}

export interface UseHistoryResult {
  entries: HistoryEntry[];
  addEntry: (expression: string, result: string) => void;
  clear: () => void;
}

const MAX_ENTRIES = 20;

let nextId = 0;

export function useHistory(): UseHistoryResult {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  const addEntry = useCallback((expression: string, result: string) => {
    const entry: HistoryEntry = { id: String(nextId++), expression, result };
    setEntries((prev) => [entry, ...prev].slice(0, MAX_ENTRIES));
  }, []);

  const clear = useCallback(() => {
    setEntries([]);
  }, []);

  return { entries, addEntry, clear };
}
