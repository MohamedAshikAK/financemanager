import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Lock, LockOpen, Trash2, AlertTriangle, ArrowLeft, Database, Moon, Sun, Type } from 'lucide-react';
import { useSettingsStore, verifyPin } from '../../store/settingsStore';
import { useFinanceStore } from '../../store/financeStore';
import { useDebtStore } from '../../store/debtStore';
import { useCreditBillStore } from '../../store/creditBillStore';
import { useContactStore } from '../../store/contactStore';
import { useToastStore } from '../../store/toastStore';

export default function Settings() {
  const navigate = useNavigate();
  const currency = useSettingsStore((state) => state.currency);
  const pin = useSettingsStore((state) => state.pin);
  const darkMode = useSettingsStore((state) => state.darkMode);
  const fontSize = useSettingsStore((state) => state.fontSize);
  const setCurrency = useSettingsStore((state) => state.setCurrency);
  const setPinStore = useSettingsStore((state) => state.setPin);
  const clearPin = useSettingsStore((state) => state.clearPin);
  const setDarkMode = useSettingsStore((state) => state.setDarkMode);
  const setFontSize = useSettingsStore((state) => state.setFontSize);
  const addToast = useToastStore((state) => state.addToast);
  
  const addEntry = useFinanceStore((state) => state.addEntry);
  const addDebt = useDebtStore((state) => state.addDebt);
  const addBill = useCreditBillStore((state) => state.addBill);
  const addContact = useContactStore((state) => state.addContact);

  const [showPinChange, setShowPinChange] = useState(false);
  const [showPinEnable, setShowPinEnable] = useState(false);
  const [showPinDisable, setShowPinDisable] = useState(false);
  const [showClearData, setShowClearData] = useState(false);
  const [showSampleData, setShowSampleData] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');

  const currencies = [
    { code: 'INR', name: 'Indian Rupee (₹)' },
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'GBP', name: 'British Pound (£)' },
    { code: 'JPY', name: 'Japanese Yen (¥)' },
    { code: 'CNY', name: 'Chinese Yuan (¥)' },
    { code: 'AUD', name: 'Australian Dollar (A$)' },
    { code: 'CAD', name: 'Canadian Dollar (C$)' },
    { code: 'CHF', name: 'Swiss Franc (Fr)' },
    { code: 'SGD', name: 'Singapore Dollar (S$)' },
    { code: 'AED', name: 'UAE Dirham (د.إ)' },
    { code: 'SAR', name: 'Saudi Riyal (﷼)' },
    { code: 'MYR', name: 'Malaysian Ringgit (RM)' },
    { code: 'THB', name: 'Thai Baht (฿)' },
    { code: 'KRW', name: 'South Korean Won (₩)' },
    { code: 'HKD', name: 'Hong Kong Dollar (HK$)' },
    { code: 'NZD', name: 'New Zealand Dollar (NZ$)' },
    { code: 'BRL', name: 'Brazilian Real (R$)' },
    { code: 'MXN', name: 'Mexican Peso ($)' },
    { code: 'RUB', name: 'Russian Ruble (₽)' },
    { code: 'ZAR', name: 'South African Rand (R)' },
  ];

  const handlePinEnable = () => {
    if (newPin.length !== 4) {
      setPinError('PIN must be 4 digits');
      return;
    }
    if (newPin !== confirmPin) {
      setPinError('PINs do not match');
      return;
    }
    try {
      setPinStore(newPin);
      setShowPinEnable(false);
      setNewPin('');
      setConfirmPin('');
      setPinError('');
      addToast('success', 'PIN enabled successfully');
    } catch (error) {
      addToast('error', error instanceof Error ? error.message : 'Failed to enable PIN');
    }
  };

  const handlePinChange = () => {
    if (!verifyPin(currentPin, pin)) {
      setPinError('Current PIN is incorrect');
      return;
    }
    if (newPin.length !== 4) {
      setPinError('New PIN must be 4 digits');
      return;
    }
    if (newPin !== confirmPin) {
      setPinError('New PINs do not match');
      return;
    }
    try {
      setPinStore(newPin);
      setShowPinChange(false);
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      setPinError('');
      addToast('success', 'PIN changed successfully');
    } catch (error) {
      addToast('error', error instanceof Error ? error.message : 'Failed to change PIN');
    }
  };

  const handlePinDisable = () => {
    if (!verifyPin(currentPin, pin)) {
      setPinError('PIN is incorrect');
      return;
    }
    clearPin();
    setShowPinDisable(false);
    setCurrentPin('');
    setPinError('');
  };

  const handleClearData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleLoadSampleData = () => {
    // Add sample contacts first
    const sampleContacts = [
      { name: 'John Doe', phone: '+91 98765 43210', email: 'john.doe@example.com' },
      { name: 'Jane Smith', phone: '+91 98765 43211', email: 'jane.smith@example.com' },
      { name: 'Mike Johnson', phone: '+91 98765 43212', email: 'mike.johnson@example.com' },
    ];
    
    const contactIds: string[] = [];
    sampleContacts.forEach(contact => {
      const id = addContact(contact);
      contactIds.push(id);
    });

    // Add sample finance entries
    const sampleFinanceEntries = [
      { title: 'Grocery Shopping', amount: 4500, type: 'expense' as const, category: 'Food', date: new Date().toISOString(), note: 'Weekly groceries from supermarket', isRecurring: false },
      { title: 'Salary', amount: 85000, type: 'income' as const, category: 'Salary', date: new Date().toISOString(), note: 'Monthly salary', isRecurring: false },
      { title: 'Electricity Bill', amount: 2500, type: 'expense' as const, category: 'Utilities', date: new Date().toISOString(), note: 'Monthly electricity bill', isRecurring: true },
      { title: 'Freelance Payment', amount: 15000, type: 'income' as const, category: 'Freelance', date: new Date().toISOString(), note: 'Web development project', isRecurring: false },
      { title: 'Internet Bill', amount: 1200, type: 'expense' as const, category: 'Utilities', date: new Date().toISOString(), note: 'Monthly internet connection', isRecurring: true },
    ];
    
    sampleFinanceEntries.forEach(entry => {
      addEntry(entry);
    });

    // Add sample debts
    const sampleDebts = [
      { amount: 5000, type: 'owed-to-me' as const, personId: contactIds[0], dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), note: 'Loan for emergency', isPaid: false },
      { amount: 2000, type: 'owed-by-me' as const, personId: contactIds[1], dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), note: 'Borrowed for dinner', isPaid: false },
      { amount: 8000, type: 'owed-to-me' as const, personId: contactIds[0], dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), note: 'Shared expenses', isPaid: false },
    ];
    
    sampleDebts.forEach(debt => {
      addDebt(debt);
    });

    // Add sample credit bills
    const sampleBills = [
      { cardName: 'HDFC Credit Card', currentAmount: 15000, dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), isPaid: false },
      { cardName: 'ICICI Amazon Pay', currentAmount: 8500, dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), isPaid: false },
      { cardName: 'SBI Credit Card', currentAmount: 25000, dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), isPaid: false },
    ];
    
    sampleBills.forEach(bill => {
      addBill(bill);
    });

    setShowSampleData(false);
    alert('Sample data loaded successfully!');
  };

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/')}
          className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          aria-label="Go back to home"
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
        <h1 className="text-xl font-bold text-slate-800">Settings</h1>
      </div>

      <div className="card p-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <DollarSign size={18} className="text-emerald-600" />
          </div>
          <h2 className="font-semibold text-slate-800 dark:text-white">Currency</h2>
        </div>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="input-field"
        >
          {currencies.map((curr) => (
            <option key={curr.code} value={curr.code}>{curr.name}</option>
          ))}
        </select>
      </div>

      <div className="card p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-3 rounded-xl ${darkMode ? 'bg-purple-500/20' : 'bg-amber-500/20'}`}>
              {darkMode ? <Moon size={18} className="text-purple-400" /> : <Sun size={18} className="text-amber-500" />}
            </div>
            <h2 className="font-semibold text-slate-800 dark:text-white">Dark Mode</h2>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
              darkMode ? 'bg-[#32d74b]' : 'bg-[#e9e9eb]'
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                darkMode ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="card p-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <Type size={18} className="text-indigo-600" />
          </div>
          <h2 className="font-semibold text-slate-800 dark:text-white">Font Size</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFontSize('small')}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
              fontSize === 'small'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
          >
            Small
          </button>
          <button
            onClick={() => setFontSize('medium')}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
              fontSize === 'medium'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => setFontSize('large')}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
              fontSize === 'large'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
          >
            Large
          </button>
        </div>
      </div>

      <div className="card p-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Database size={18} className="text-blue-600" />
          </div>
          <h2 className="font-semibold text-slate-800 dark:text-white">Sample Data</h2>
        </div>
        <p className="text-sm text-slate-600 mb-3 dark:text-[#8e8e93]">Load sample data to see how the app looks with actual entries.</p>
        <button onClick={() => setShowSampleData(true)} className="w-full btn-primary">Load Sample Data</button>
      </div>

      <div className="card p-3">
        <div className="flex items-center gap-2 mb-3">
          <div className={`p-3 rounded-xl ${pin ? 'bg-blue-100' : 'bg-slate-100'}`}>
            {pin ? <Lock size={18} className="text-blue-600" /> : <LockOpen size={18} className="text-slate-400" />}
          </div>
          <h2 className="font-semibold text-slate-800 dark:text-white">PIN Lock</h2>
        </div>
        {pin ? (
          <div className="space-y-2">
            <button onClick={() => setShowPinChange(true)} className="w-full btn-secondary">Change PIN</button>
            <button onClick={() => setShowPinDisable(true)} className="w-full btn-danger">Disable PIN</button>
          </div>
        ) : (
          <button onClick={() => setShowPinEnable(true)} className="w-full btn-primary">Enable PIN</button>
        )}
      </div>

      <div className="card p-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-3 bg-red-100 rounded-xl">
            <Trash2 size={18} className="text-red-600" />
          </div>
          <h2 className="font-semibold text-slate-800">Clear All Data</h2>
        </div>
        <p className="text-sm text-slate-600 mb-4">This will permanently delete all your data including finance entries, debts, bills, contacts, and settings.</p>
        <button onClick={() => setShowClearData(true)} className="w-full btn-danger">Clear All Data</button>
      </div>

      {showPinEnable && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Enable PIN</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">New PIN</label>
                <input type="password" maxLength={4} value={newPin} onChange={(e) => setNewPin(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm PIN</label>
                <input type="password" maxLength={4} value={confirmPin} onChange={(e) => setConfirmPin(e.target.value)} className="input-field" />
              </div>
              {pinError && <p className="text-red-500 text-sm">{pinError}</p>}
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => { setShowPinEnable(false); setNewPin(''); setConfirmPin(''); setPinError(''); }} className="flex-1 btn-secondary">Cancel</button>
              <button onClick={handlePinEnable} className="flex-1 btn-primary">Enable</button>
            </div>
          </div>
        </div>
      )}

      {showPinChange && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Change PIN</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Current PIN</label>
                <input type="password" maxLength={4} value={currentPin} onChange={(e) => setCurrentPin(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">New PIN</label>
                <input type="password" maxLength={4} value={newPin} onChange={(e) => setNewPin(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New PIN</label>
                <input type="password" maxLength={4} value={confirmPin} onChange={(e) => setConfirmPin(e.target.value)} className="input-field" />
              </div>
              {pinError && <p className="text-red-500 text-sm">{pinError}</p>}
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => { setShowPinChange(false); setCurrentPin(''); setNewPin(''); setConfirmPin(''); setPinError(''); }} className="flex-1 btn-secondary">Cancel</button>
              <button onClick={handlePinChange} className="flex-1 btn-primary">Change</button>
            </div>
          </div>
        </div>
      )}

      {showPinDisable && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Disable PIN</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Enter PIN to disable</label>
                <input type="password" maxLength={4} value={currentPin} onChange={(e) => setCurrentPin(e.target.value)} className="input-field" />
              </div>
              {pinError && <p className="text-red-500 text-sm">{pinError}</p>}
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => { setShowPinDisable(false); setCurrentPin(''); setPinError(''); }} className="flex-1 btn-secondary">Cancel</button>
              <button onClick={handlePinDisable} className="flex-1 btn-danger">Disable</button>
            </div>
          </div>
        </div>
      )}

      {showClearData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-start gap-2 mb-4">
              <div className="p-3 bg-red-100 rounded-xl flex-shrink-0">
                <AlertTriangle size={18} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Clear All Data?</h3>
                <p className="text-sm text-slate-600">This action cannot be undone. All your data will be permanently deleted.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowClearData(false)} className="flex-1 btn-secondary">Cancel</button>
              <button onClick={handleClearData} className="flex-1 btn-danger">Clear Data</button>
            </div>
          </div>
        </div>
      )}

      {showSampleData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-start gap-2 mb-4">
              <div className="p-3 bg-blue-100 rounded-xl flex-shrink-0">
                <Database size={18} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Load Sample Data?</h3>
                <p className="text-sm text-slate-600">This will add sample finance entries, debts, bills, and contacts to your app.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowSampleData(false)} className="flex-1 btn-secondary">Cancel</button>
              <button onClick={handleLoadSampleData} className="flex-1 btn-primary">Load Data</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
