import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface FinanceEntry {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  note?: string;
  isRecurring: boolean; // Whether this entry repeats every month
  paidMonths: string[]; // Array of month keys like "2024-01", "2024-02"
  createdAt: string;
  updatedAt: string;
}

interface FinanceState {
  entries: FinanceEntry[];
  isHydrated: boolean;
  
  // Actions
  addEntry: (entry: Omit<FinanceEntry, 'id' | 'paidMonths' | 'createdAt' | 'updatedAt'>) => void;
  updateEntry: (id: string, entry: Partial<FinanceEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntry: (id: string) => FinanceEntry | undefined;
  togglePayment: (id: string, monthKey: string) => void;
  isPaidThisMonth: (id: string, monthKey: string) => boolean;
  getTotalAmount: () => number;
  getPaidAmount: (monthKey: string) => number;
  getUnpaidAmount: (monthKey: string) => number;
  getRecurringEntries: () => FinanceEntry[];
  getEntriesForMonth: (monthKey: string) => FinanceEntry[];
  setHydrated: (hydrated: boolean) => void;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      entries: [],
      isHydrated: false,
      
      addEntry: (entry) => {
        try {
          if (!entry.title || entry.title.trim() === '') {
            throw new Error('Title is required');
          }
          if (entry.amount <= 0) {
            throw new Error('Amount must be greater than 0');
          }
          const newEntry: FinanceEntry = {
            ...entry,
            id: uuidv4(),
            isRecurring: entry.isRecurring || false,
            paidMonths: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set((state) => ({ entries: [...state.entries, newEntry] }));
        } catch (error) {
          console.error('Error adding entry:', error);
          throw error;
        }
      },
      
      updateEntry: (id, updatedFields) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id
              ? { ...entry, ...updatedFields, updatedAt: new Date().toISOString() }
              : entry
          ),
        }));
      },
      
      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }));
      },
      
      getEntry: (id) => {
        return get().entries.find((entry) => entry.id === id);
      },
      
      togglePayment: (id, monthKey) => {
        set((state) => ({
          entries: state.entries.map((entry) => {
            if (entry.id !== id) return entry;
            
            const isPaid = entry.paidMonths.includes(monthKey);
            const newPaidMonths = isPaid
              ? entry.paidMonths.filter((m) => m !== monthKey)
              : [...entry.paidMonths, monthKey];
            
            return {
              ...entry,
              paidMonths: newPaidMonths,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },
      
      isPaidThisMonth: (id, monthKey) => {
        const entry = get().entries.find((e) => e.id === id);
        return entry ? entry.paidMonths.includes(monthKey) : false;
      },
      
      getTotalAmount: () => {
        return get().entries.reduce((sum, entry) => sum + entry.amount, 0);
      },
      
      getPaidAmount: (monthKey) => {
        return get().entries
          .filter((entry) => entry.paidMonths.includes(monthKey))
          .reduce((sum, entry) => sum + entry.amount, 0);
      },
      
      getUnpaidAmount: (monthKey) => {
        return get().entries
          .filter((entry) => !entry.paidMonths.includes(monthKey))
          .reduce((sum, entry) => sum + entry.amount, 0);
      },
      
      getRecurringEntries: () => {
        return get().entries.filter((entry) => entry.isRecurring);
      },
      
      getEntriesForMonth: (monthKey) => {
        return get().entries.filter((entry) => {
          const entryDate = new Date(entry.date);
          const entryMonthKey = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}`;
          return entryMonthKey === monthKey;
        });
      },
      
      setHydrated: (hydrated) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: 'pocket-finances-finance',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
