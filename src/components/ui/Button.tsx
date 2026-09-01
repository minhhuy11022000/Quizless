import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";
import { buttonBaseClasses, buttonVariantClasses, type ButtonVariant } from "./buttonStyles";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonBaseClasses, buttonVariantClasses[variant], className)}
      {...props}
    />
  );
}
