// Finance Types
export interface FinanceEntry {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  note?: string;
  isRecurring: boolean;
  paidMonths: string[];
  createdAt: string;
  updatedAt: string;
}

// Debt Types
export interface DebtRecord {
  id: string;
  amount: number;
  type: 'owed-to-me' | 'owed-by-me';
  personId: string;
  dueDate?: string;
  note?: string;
  isPaid: boolean;
  settledAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Credit Bill Types
export interface CreditBill {
  id: string;
  cardName: string;
  currentAmount: number;
  dueDate: string;
  isPaid: boolean;
  settledAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Contact Types
export interface Contact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

// Settings Types
export interface Settings {
  pin: string | null;
  currency: string;
  darkMode: boolean;
  createdAt: string;
  updatedAt: string;
}

// Toast Types
export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

// Common Types
export interface BaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
}
