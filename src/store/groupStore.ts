import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Settlement {
  from: string; // contactId
  to: string; // contactId
  amount: number;
}

export interface GroupExpense {
  id: string;
  title: string;
  amount: number;
  paidBy: string; // contactId
  participants: string[]; // contactIds
  date: string; // ISO string
  note?: string;
  settlements: Settlement[];
  createdAt: string;
  updatedAt: string;
}

interface GroupState {
  expenses: GroupExpense[];
  isHydrated: boolean;
  
  // Actions
  addExpense: (expense: Omit<GroupExpense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExpense: (id: string, expense: Partial<GroupExpense>) => void;
  deleteExpense: (id: string) => void;
  getExpense: (id: string) => GroupExpense | undefined;
  setHydrated: (hydrated: boolean) => void;
}

export const useGroupStore = create<GroupState>()(
  persist(
    (set, get) => ({
      expenses: [],
      isHydrated: false,
      
      addExpense: (expense) => {
        const newExpense: GroupExpense = {
          ...expense,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ expenses: [...state.expenses, newExpense] }));
      },
      
      updateExpense: (id, updatedFields) => {
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id
              ? { ...expense, ...updatedFields, updatedAt: new Date().toISOString() }
              : expense
          ),
        }));
      },
      
      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        }));
      },
      
      getExpense: (id) => {
        return get().expenses.find((expense) => expense.id === id);
      },
      
      setHydrated: (hydrated) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: 'pocket-finances-groups',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
