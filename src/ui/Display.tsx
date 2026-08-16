interface DisplayProps {
  value: string;
  isError?: boolean;
}

export function Display({ value, isError = false }: DisplayProps) {
  return (
    <div
      className="display"
      role="status"
      aria-live="polite"
      aria-label={isError ? "Error" : "Display"}
      data-error={isError ? "true" : undefined}
    >
      {value}
    </div>
  );
}
