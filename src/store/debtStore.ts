import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { DebtRecord } from '../types';

interface DebtState {
  debts: DebtRecord[];
  isHydrated: boolean;
  
  // Actions
  addDebt: (debt: Omit<DebtRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDebt: (id: string, debt: Partial<DebtRecord>) => void;
  deleteDebt: (id: string) => void;
  getDebt: (id: string) => DebtRecord | undefined;
  markAsPaid: (id: string) => void;
  settleDebt: (id: string) => void;
  getDebtsByType: (type: 'owed-to-me' | 'owed-by-me') => DebtRecord[];
  getPendingDebts: () => DebtRecord[];
  getSettledDebts: () => DebtRecord[];
  setHydrated: (hydrated: boolean) => void;
}

export const useDebtStore = create<DebtState>()(
  persist(
    (set, get) => ({
      debts: [],
      isHydrated: false,
      
      addDebt: (debt) => {
        try {
          const newDebt: DebtRecord = {
            ...debt,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set((state) => ({ debts: [...state.debts, newDebt] }));
        } catch (error) {
          console.error('Error adding debt:', error);
          throw new Error('Failed to add debt');
        }
      },
      
      updateDebt: (id, updatedFields) => {
        set((state) => ({
          debts: state.debts.map((debt) =>
            debt.id === id
              ? { ...debt, ...updatedFields, updatedAt: new Date().toISOString() }
              : debt
          ),
        }));
      },
      
      deleteDebt: (id) => {
        set((state) => ({
          debts: state.debts.filter((debt) => debt.id !== id),
        }));
      },
      
      getDebt: (id) => {
        return get().debts.find((debt) => debt.id === id);
      },
      
      markAsPaid: (id) => {
        set((state) => ({
          debts: state.debts.map((debt) =>
            debt.id === id
              ? { ...debt, isPaid: true, updatedAt: new Date().toISOString() }
              : debt
          ),
        }));
      },
      
      settleDebt: (id) => {
        set((state) => ({
          debts: state.debts.map((debt) =>
            debt.id === id
              ? { ...debt, isPaid: true, settledAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
              : debt
          ),
        }));
      },
      
      getDebtsByType: (type) => {
        return get().debts.filter((debt) => debt.type === type);
      },
      
      getPendingDebts: () => {
        return get().debts.filter((debt) => !debt.isPaid);
      },
      
      getSettledDebts: () => {
        return get().debts.filter((debt) => debt.isPaid && debt.settledAt);
      },
      
      setHydrated: (hydrated) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: 'pocket-finances-debts',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
