import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface CreditBill {
  id: string;
  cardName: string;
  currentAmount: number;
  dueDate: string; // ISO string
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreditBillState {
  bills: CreditBill[];
  isHydrated: boolean;
  
  // Actions
  addBill: (bill: Omit<CreditBill, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBill: (id: string, bill: Partial<CreditBill>) => void;
  deleteBill: (id: string) => void;
  getBill: (id: string) => CreditBill | undefined;
  settleBill: (id: string) => void;
  getDueBills: () => CreditBill[];
  getOverdueBills: () => CreditBill[];
  setHydrated: (hydrated: boolean) => void;
}

export const useCreditBillStore = create<CreditBillState>()(
  persist(
    (set, get) => ({
      bills: [],
      isHydrated: false,
      
      addBill: (bill) => {
        try {
          const newBill: CreditBill = {
            ...bill,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set((state) => ({ bills: [...state.bills, newBill] }));
        } catch (error) {
          console.error('Error adding bill:', error);
          throw new Error('Failed to add bill');
        }
      },
      
      updateBill: (id, updatedFields) => {
        set((state) => ({
          bills: state.bills.map((bill) =>
            bill.id === id
              ? { ...bill, ...updatedFields, updatedAt: new Date().toISOString() }
              : bill
          ),
        }));
      },
      
      deleteBill: (id) => {
        set((state) => ({
          bills: state.bills.filter((bill) => bill.id !== id),
        }));
      },
      
      getBill: (id) => {
        return get().bills.find((bill) => bill.id === id);
      },
      
      settleBill: (id) => {
        set((state) => ({
          bills: state.bills.map((bill) =>
            bill.id === id
              ? { 
                  ...bill, 
                  currentAmount: 0, 
                  isPaid: true, 
                  updatedAt: new Date().toISOString() 
                }
              : bill
          ),
        }));
      },
      
      getDueBills: () => {
        const today = new Date();
        const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        return get().bills.filter((bill) => {
          if (bill.isPaid) return false;
          const dueDate = new Date(bill.dueDate);
          return dueDate >= today && dueDate <= sevenDaysFromNow;
        });
      },
      
      getOverdueBills: () => {
        const today = new Date();
        return get().bills.filter((bill) => {
          if (bill.isPaid) return false;
          const dueDate = new Date(bill.dueDate);
          return dueDate < today;
        });
      },
      
      setHydrated: (hydrated) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: 'pocket-finances-bills',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
