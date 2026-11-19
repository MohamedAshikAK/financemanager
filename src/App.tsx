import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AuthGuard from './features/auth/AuthGuard';
import Home from './features/Home';
import FinanceList from './features/finance/FinanceList';
import FinanceForm from './features/finance/FinanceForm';

// Placeholder components - we'll build these in later steps
const Debt = () => <div className="p-4">Debt - Coming Soon</div>;
const Bills = () => <div className="p-4">Credit Bills - Coming Soon</div>;
const Groups = () => <div className="p-4">Groups - Coming Soon</div>;
const Contacts = () => <div className="p-4">Contacts - Coming Soon</div>;
const Backup = () => <div className="p-4">Backup - Coming Soon</div>;
const Settings = () => <div className="p-4">Settings - Coming Soon</div>;

function App() {
  return (
    <AuthGuard>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/finance" element={<FinanceList />} />
          <Route path="/finance/form" element={<FinanceForm />} />
          <Route path="/debt" element={<Debt />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/backup" element={<Backup />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </AuthGuard>
  );
}

export default App;
