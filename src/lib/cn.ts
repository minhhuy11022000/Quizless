import { clsx, type ClassValue } from "clsx";

/** Joins conditional class names. A thin wrapper so call sites don't import clsx directly. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
