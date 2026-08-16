import type { HistoryEntry } from "./useHistory";
import { Button } from "./Button";

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}

export function HistoryPanel({ entries, onSelect, onClear }: HistoryPanelProps) {
  return (
    <div className="history-panel">
      <div className="history-panel-header">
        <Button variant="action" onClick={onClear} aria-label="Clear history">
          Clear history
        </Button>
      </div>
      {entries.length === 0 ? (
        <p className="history-empty">No calculations yet.</p>
      ) : (
        <ul className="history-list">
          {entries.map((entry) => (
            <li key={entry.id}>
              <button
                type="button"
                className="history-entry"
                onClick={() => onSelect(entry)}
                aria-label={`Reuse ${entry.expression} = ${entry.result}`}
              >
                <span className="history-entry-expression">{entry.expression}</span>
                <span className="history-entry-result">{entry.result}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
