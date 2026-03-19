import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// This utility merges Tailwind classes safely.
// Without it, conflicting classes like "p-4 p-6"
// would both exist in the DOM — twMerge resolves conflicts.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}