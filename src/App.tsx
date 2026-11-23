import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer, useToast } from './components/Toast';
import AuthGuard from './features/auth/AuthGuard';
import Home from './features/Home';
import FinanceList from './features/finance/FinanceList';
import FinanceForm from './features/finance/FinanceForm';
import DebtList from './features/debt/DebtList';
import DebtForm from './features/debt/DebtForm';
import DebtContactDetail from './features/debt/DebtContactDetail';
import ContactsList from './features/contacts/ContactsList';
import ContactsForm from './features/contacts/ContactsForm';
import CreditBillsList from './features/credit-bills/CreditBillsList';
import CreditBillsForm from './features/credit-bills/CreditBillsForm';
import Backup from './features/backup/Backup';
import Settings from './features/settings/Settings';

function App() {
  const { toasts, removeToast } = useToast();

  return (
    <ErrorBoundary>
      <AuthGuard>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/finance" element={<FinanceList />} />
            <Route path="/finance/form" element={<FinanceForm />} />
            <Route path="/debt" element={<DebtList />} />
            <Route path="/debt/form" element={<DebtForm />} />
            <Route path="/debt/contact/:contactId" element={<DebtContactDetail />} />
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
    </ErrorBoundary>
  );
}

export default App;
