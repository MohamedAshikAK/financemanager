import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface MonthlyDebtRecord {
  id: string;
  amount: number;
  type: 'owed-to-me' | 'owed-by-me';
  personId: string;
  isPaid: boolean;
  settledAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface MonthlyDebtState {
  monthlyDebts: MonthlyDebtRecord[];
  isHydrated: boolean;
  
  // Actions
  addMonthlyDebt: (debt: Omit<MonthlyDebtRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMonthlyDebt: (id: string, debt: Partial<MonthlyDebtRecord>) => void;
  deleteMonthlyDebt: (id: string) => void;
  getMonthlyDebt: (id: string) => MonthlyDebtRecord | undefined;
  markAsPaid: (id: string) => void;
  settleMonthlyDebt: (id: string) => void;
  settleAllMonthlyDebtsForContact: (personId: string) => void;
  getMonthlyDebtsByType: (type: 'owed-to-me' | 'owed-by-me') => MonthlyDebtRecord[];
  getPendingMonthlyDebts: () => MonthlyDebtRecord[];
  getSettledMonthlyDebts: () => MonthlyDebtRecord[];
  setMonthlyDebts: (debts: MonthlyDebtRecord[]) => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useMonthlyDebtStore = create<MonthlyDebtState>()(
  persist(
    (set, get) => ({
      monthlyDebts: [],
      isHydrated: false,
      
      addMonthlyDebt: (debt) => {
        try {
          const newDebt: MonthlyDebtRecord = {
            ...debt,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set((state) => ({ monthlyDebts: [...state.monthlyDebts, newDebt] }));
        } catch (error) {
          console.error('Error adding monthly debt:', error);
          throw new Error('Failed to add monthly debt');
        }
      },
      
      updateMonthlyDebt: (id, updatedFields) => {
        set((state) => ({
          monthlyDebts: state.monthlyDebts.map((debt) =>
            debt.id === id
              ? { ...debt, ...updatedFields, updatedAt: new Date().toISOString() }
              : debt
          ),
        }));
      },
      
      deleteMonthlyDebt: (id) => {
        set((state) => ({
          monthlyDebts: state.monthlyDebts.filter((debt) => debt.id !== id),
        }));
      },
      
      getMonthlyDebt: (id) => {
        return get().monthlyDebts.find((debt) => debt.id === id);
      },
      
      markAsPaid: (id) => {
        set((state) => ({
          monthlyDebts: state.monthlyDebts.map((debt) =>
            debt.id === id
              ? { ...debt, isPaid: true, updatedAt: new Date().toISOString() }
              : debt
          ),
        }));
      },
      
      settleMonthlyDebt: (id) => {
        set((state) => ({
          monthlyDebts: state.monthlyDebts.map((debt) =>
            debt.id === id
              ? { ...debt, isPaid: true, settledAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
              : debt
          ),
        }));
      },
      
      settleAllMonthlyDebtsForContact: (personId) => {
        set((state) => ({
          monthlyDebts: state.monthlyDebts.map((debt) =>
            debt.personId === personId && !debt.isPaid
              ? { ...debt, isPaid: true, settledAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
              : debt
          ),
        }));
      },
      
      getMonthlyDebtsByType: (type) => {
        return get().monthlyDebts.filter((debt) => debt.type === type);
      },
      
      getPendingMonthlyDebts: () => {
        return get().monthlyDebts.filter((debt) => !debt.isPaid);
      },
      
      getSettledMonthlyDebts: () => {
        return get().monthlyDebts.filter((debt) => debt.isPaid && debt.settledAt);
      },
      
      setMonthlyDebts: (debts) => {
        set({ monthlyDebts: debts });
      },
      
      setHydrated: (hydrated) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: 'pocket-finances-monthly-debts',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
