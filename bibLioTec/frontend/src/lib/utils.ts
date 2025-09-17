import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function calculateDueDate(loanDate: Date, days: number = 14): Date {
  const dueDate = new Date(loanDate);
  dueDate.setDate(dueDate.getDate() + days);
  return dueDate;
}

export function isOverdue(dueDate: Date | string): boolean {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const today = new Date();
  return due < today;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}