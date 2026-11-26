import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/Toast';
import ThemeProvider from './components/ThemeProvider';
import { WebVitals } from './components/WebVitals';
import AuthGuard from './features/auth/AuthGuard';
import Home from './features/Home';
import FinanceList from './features/finance/FinanceList';
import FinanceForm from './features/finance/FinanceForm';
import LoansList from './features/loans/LoansList';
import LoanForm from './features/loans/LoanForm';
import LoanDetail from './features/loans/LoanDetail';
import PaymentForm from './features/loans/PaymentForm';
import MonthlyDebtList from './features/monthly-debt/MonthlyDebtList';
import MonthlyDebtForm from './features/monthly-debt/MonthlyDebtForm';
import MonthlyDebtContactDetail from './features/monthly-debt/MonthlyDebtContactDetail';
import ContactsList from './features/contacts/ContactsList';
import ContactsForm from './features/contacts/ContactsForm';
import CreditBillsList from './features/credit-bills/CreditBillsList';
import CreditBillsForm from './features/credit-bills/CreditBillsForm';
import Backup from './features/backup/Backup';
import Settings from './features/settings/Settings';
import { useToastStore } from './store/toastStore';

function App() {
  const { toasts, removeToast } = useToastStore();

  return (
    <ErrorBoundary>
      <WebVitals />
      <ThemeProvider>
        <AuthGuard>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/finance" element={<FinanceList />} />
              <Route path="/finance/form" element={<FinanceForm />} />
              <Route path="/loans" element={<LoansList />} />
              <Route path="/loans/form" element={<LoanForm />} />
              <Route path="/loans/:id" element={<LoanDetail />} />
              <Route path="/loans/:id/payment" element={<PaymentForm />} />
              <Route path="/monthly-debt" element={<MonthlyDebtList />} />
              <Route path="/monthly-debt/form" element={<MonthlyDebtForm />} />
              <Route path="/monthly-debt/contact/:contactId" element={<MonthlyDebtContactDetail />} />
              <Route path="/contacts" element={<ContactsList />} />
              <Route path="/contacts/form" element={<ContactsForm />} />
              <Route path="/bills" element={<CreditBillsList />} />
              <Route path="/bills/form" element={<CreditBillsForm />} />
              <Route path="/backup" element={<Backup />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
          <ToastContainer toasts={toasts} onRemove={removeToast} />
        </AuthGuard>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
