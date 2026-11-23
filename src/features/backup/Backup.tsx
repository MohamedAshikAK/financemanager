import { useState } from 'react';
import { Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useFinanceStore } from '../../store/financeStore';
import { useDebtStore } from '../../store/debtStore';
import { useCreditBillStore } from '../../store/creditBillStore';
import { useContactStore } from '../../store/contactStore';
import { useSettingsStore } from '../../store/settingsStore';

export default function Backup() {
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [importData, setImportData] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const financeStore = useFinanceStore((state) => state.entries);
  const debtStore = useDebtStore((state) => state.debts);
  const creditBillStore = useCreditBillStore((state) => state.bills);
  const contactStore = useContactStore((state) => state.contacts);
  const currency = useSettingsStore((state) => state.currency);
  const pin = useSettingsStore((state) => state.pin);

  const handleExport = () => {
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      finance: financeStore,
      debts: debtStore,
      creditBills: creditBillStore,
      contacts: contactStore,
      settings: {
        currency,
        pin,
      },
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
      localStorage.setItem('pocket-finances-finance', JSON.stringify(importData.finance));
      localStorage.setItem('pocket-finances-debts', JSON.stringify(importData.debts));
      localStorage.setItem('pocket-finances-bills', JSON.stringify(importData.creditBills));
      localStorage.setItem('pocket-finances-contacts', JSON.stringify(importData.contacts));
      localStorage.setItem('pocket-finances-settings', JSON.stringify(importData.settings));

      setMessage({ type: 'success', text: 'Backup imported successfully! Reloading...' });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to import backup' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Backup & Restore
      </h1>

      {message && (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
        <h2 className="font-medium text-gray-800 mb-2">Export Data</h2>
        <p className="text-sm text-gray-600 mb-4">
          Download all your data as a JSON file for backup.
        </p>
        <button
          onClick={handleExport}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Download size={20} />
          Export Backup
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h2 className="font-medium text-gray-800 mb-2">Import Data</h2>
        <p className="text-sm text-gray-600 mb-4">
          Restore your data from a backup file. This will replace all current data.
        </p>
        <label className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer">
          <Upload size={20} />
          Import Backup
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>

        {showImportConfirm && importData && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-start gap-2 mb-3">
              <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600">
                This will replace all your current data with the backup from {new Date(importData.exportDate).toLocaleDateString()}.
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowImportConfirm(false);
                  setImportData(null);
                }}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmImport}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Import
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
