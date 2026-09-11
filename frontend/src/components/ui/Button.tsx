"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type Variant = "primary" | "success" | "warning" | "danger" | "ghost";
const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "btn-primary",
  success: "btn-success",
  warning: "btn-warning",
  danger: "btn-danger",
  ghost: "btn-ghost",
};
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: Variant; }
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant="primary", disabled, ...props }, ref) => (
  <button ref={ref} disabled={disabled} className={clsx("btn-base", VARIANT_CLASSES[variant], "disabled:cursor-not-allowed disabled:opacity-40", className)} {...props} />
));
Button.displayName = "Button";
