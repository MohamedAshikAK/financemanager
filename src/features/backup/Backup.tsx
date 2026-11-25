import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Upload, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useFinanceStore } from '../../store/financeStore';
import { useDebtStore } from '../../store/debtStore';
import { useMonthlyDebtStore } from '../../store/monthlyDebtStore';
import { useCreditBillStore } from '../../store/creditBillStore';
import { useContactStore } from '../../store/contactStore';
import { useSettingsStore } from '../../store/settingsStore';

export default function Backup() {
  const navigate = useNavigate();
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [importData, setImportData] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const financeEntries = useFinanceStore((state) => state.entries);
  const debtEntries = useDebtStore((state) => state.debts);
  const monthlyDebtEntries = useMonthlyDebtStore((state) => state.monthlyDebts);
  const creditBills = useCreditBillStore((state) => state.bills);
  const contacts = useContactStore((state) => state.contacts);
  const currency = useSettingsStore((state) => state.currency);
  const pin = useSettingsStore((state) => state.pin);

  const setFinanceEntries = useFinanceStore((state) => state.setEntries);
  const setDebtEntries = useDebtStore((state) => state.setDebts);
  const setMonthlyDebtEntries = useMonthlyDebtStore((state) => state.setMonthlyDebts);
  const setCreditBills = useCreditBillStore((state) => state.setBills);
  const setContacts = useContactStore((state) => state.setContacts);
  const setCurrency = useSettingsStore((state) => state.setCurrency);
  const setPinStore = useSettingsStore((state) => state.setPin);

  const handleExport = () => {
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      finance: financeEntries,
      debts: debtEntries,
      monthlyDebts: monthlyDebtEntries,
      creditBills: creditBills,
      contacts: contacts,
      settings: { currency, pin },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pocket-finances-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setMessage({ type: 'success', text: 'Backup exported successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!data.finance || !data.debts || !data.creditBills || !data.contacts || !data.settings) {
          setMessage({ type: 'error', text: 'Invalid backup file format' });
          setTimeout(() => setMessage(null), 3000);
          return;
        }
        setImportData(data);
        setShowImportConfirm(true);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to parse backup file' });
        setTimeout(() => setMessage(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  const confirmImport = () => {
    if (!importData) return;

    try {
      setFinanceEntries(importData.finance || []);
      setDebtEntries(importData.debts || []);
      setMonthlyDebtEntries(importData.monthlyDebts || []);
      setCreditBills(importData.creditBills || []);
      setContacts(importData.contacts || []);
      
      if (importData.settings?.currency) {
        setCurrency(importData.settings.currency);
      }
      if (importData.settings?.pin !== undefined) {
        setPinStore(importData.settings.pin);
      }

      setMessage({ type: 'success', text: 'Backup imported successfully! Reloading...' });
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to import backup' });
      setTimeout(() => setMessage(null), 3000);
    }
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
        <h1 className="text-xl font-bold text-slate-800">Backup & Restore</h1>
      </div>

      {message && (
        <div className={`p-3 rounded-xl flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="card p-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Download size={18} className="text-blue-600" />
          </div>
          <h2 className="font-semibold text-slate-800">Export Data</h2>
        </div>
        <p className="text-sm text-slate-600 mb-4">Download all your data as a JSON file for backup.</p>
        <button onClick={handleExport} className="w-full btn-primary flex items-center justify-center gap-2">
          <Download size={18} />
          Export Backup
        </button>
      </div>

      <div className="card p-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Upload size={18} className="text-purple-600" />
          </div>
          <h2 className="font-semibold text-slate-800">Import Data</h2>
        </div>
        <p className="text-sm text-slate-600 mb-4">Restore your data from a backup file. This will replace all current data.</p>
        <label className="w-full btn-secondary flex items-center justify-center gap-2 cursor-pointer">
          <Upload size={18} />
          Import Backup
          <input type="file" accept=".json" onChange={handleImport} className="hidden" />
        </label>

        {showImportConfirm && importData && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-start gap-2 mb-3">
              <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-600">
                This will replace all your current data with the backup from {new Date(importData.exportDate).toLocaleDateString()}. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setShowImportConfirm(false); setImportData(null); }} className="flex-1 btn-secondary">Cancel</button>
              <button onClick={confirmImport} className="flex-1 btn-danger">Import</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
