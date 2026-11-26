import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Payment {
  id: string;
  amount: number;
  date: string;
  note?: string;
  createdAt: string;
}

export interface Loan {
  id: string;
  title: string;
  initialAmount: number;
  type: 'loan' | 'chit' | 'other';
  personId: string;
  startDate: string;
  dueDate?: string;
  isPaid: boolean;
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}

interface LoanState {
  loans: Loan[];
  isHydrated: boolean;
  
  // Actions
  addLoan: (loan: Omit<Loan, 'id' | 'createdAt' | 'updatedAt' | 'payments'>) => string;
  updateLoan: (id: string, loan: Partial<Loan>) => void;
  deleteLoan: (id: string) => void;
  getLoan: (id: string) => Loan | undefined;
  addPayment: (loanId: string, payment: Omit<Payment, 'id' | 'createdAt'>) => void;
  deletePayment: (loanId: string, paymentId: string) => void;
  settleLoan: (id: string) => void;
  setLoans: (loans: Loan[]) => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useLoanStore = create<LoanState>()(
  persist(
    (set, get) => ({
      loans: [],
      isHydrated: false,
      
      addLoan: (loan) => {
        try {
          const newLoan: Loan = {
            ...loan,
            id: uuidv4(),
            payments: [],
            isPaid: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set((state) => ({ loans: [...state.loans, newLoan] }));
          return newLoan.id;
        } catch (error) {
          console.error('Error adding loan:', error);
          throw new Error('Failed to add loan');
        }
      },
      
      updateLoan: (id, updatedFields) => {
        set((state) => ({
          loans: state.loans.map((loan) =>
            loan.id === id
              ? { ...loan, ...updatedFields, updatedAt: new Date().toISOString() }
              : loan
          ),
        }));
      },
      
      deleteLoan: (id) => {
        set((state) => ({
          loans: state.loans.filter((loan) => loan.id !== id),
        }));
      },
      
      getLoan: (id) => {
        return get().loans.find((loan) => loan.id === id);
      },
      
      addPayment: (loanId, payment) => {
        set((state) => ({
          loans: state.loans.map((loan) => {
            if (loan.id !== loanId) return loan;
            
            const newPayment: Payment = {
              ...payment,
              id: uuidv4(),
              createdAt: new Date().toISOString(),
            };
            
            const totalPaid = loan.payments.reduce((sum, p) => sum + p.amount, 0) + payment.amount;
            const isPaid = totalPaid >= loan.initialAmount;
            
            return {
              ...loan,
              payments: [...loan.payments, newPayment],
              isPaid,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },
      
      deletePayment: (loanId, paymentId) => {
        set((state) => ({
          loans: state.loans.map((loan) => {
            if (loan.id !== loanId) return loan;
            
            const updatedPayments = loan.payments.filter((p) => p.id !== paymentId);
            const totalPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
            const isPaid = totalPaid >= loan.initialAmount;
            
            return {
              ...loan,
              payments: updatedPayments,
              isPaid,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },
      
      settleLoan: (id) => {
        set((state) => ({
          loans: state.loans.map((loan) =>
            loan.id === id
              ? { ...loan, isPaid: true, updatedAt: new Date().toISOString() }
              : loan
          ),
        }));
      },
      
      setLoans: (loans) => {
        set({ loans });
      },
      
      setHydrated: (hydrated) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: 'pocket-finances-loans',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
