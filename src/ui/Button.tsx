import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "digit" | "operator" | "action" | "equals";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

export function Button({ children, variant = "digit", className, ...rest }: ButtonProps) {
  const classes = ["btn", `btn-${variant}`, className].filter(Boolean).join(" ");
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
