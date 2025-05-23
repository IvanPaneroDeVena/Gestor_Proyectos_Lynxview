import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  const parts = dateString.split("/")
  if (parts.length !== 3) return dateString

  const [day, month, year] = parts
  return `${day}/${month}/${year}`
}
