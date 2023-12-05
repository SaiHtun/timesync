import { twMerge } from "tailwind-merge";
import { clsx, ClassValue } from "clsx";

export function cn(...classList: ClassValue[]) {
  return twMerge(clsx(classList));
}
