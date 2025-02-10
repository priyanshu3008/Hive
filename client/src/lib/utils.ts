import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMessageTime(date: Date): string {
  return new Date(date).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}
