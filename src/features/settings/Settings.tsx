import { useState } from 'react';
import { DollarSign, Lock, LockOpen, Trash2, AlertTriangle, Shield, Globe } from 'lucide-react';
import { useSettingsStore, verifyPin } from '../../store/settingsStore';

export default function Settings() {
  const currency = useSettingsStore((state) => state.currency);
  const pin = useSettingsStore((state) => state.pin);
  const setCurrency = useSettingsStore((state) => state.setCurrency);
  const setPinStore = useSettingsStore((state) => state.setPin);
  const clearPin = useSettingsStore((state) => state.clearPin);

  const [showPinChange, setShowPinChange] = useState(false);
  const [showPinEnable, setShowPinEnable] = useState(false);
  const [showPinDisable, setShowPinDisable] = useState(false);
  const [showClearData, setShowClearData] = useState(false);
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
    { code: 'AUD', name: 'Australian Dollar (A$)' },
    { code: 'CAD', name: 'Canadian Dollar (C$)' },
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
    setPinStore(newPin);
    setShowPinEnable(false);
    setNewPin('');
    setConfirmPin('');
    setPinError('');
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
    setPinStore(newPin);
    setShowPinChange(false);
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    setPinError('');
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

  return (
    <div className="p-5 space-y-5">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

      <div className="card p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-emerald-100 rounded-2xl">
            <DollarSign size={20} className="text-emerald-600" />
          </div>
          <h2 className="font-semibold text-gray-800">Currency</h2>
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

      <div className="card p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-3 rounded-2xl ${pin ? 'bg-blue-100' : 'bg-gray-100'}`}>
            {pin ? <Lock size={20} className="text-blue-600" /> : <LockOpen size={20} className="text-gray-400" />}
          </div>
          <h2 className="font-semibold text-gray-800">PIN Lock</h2>
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

      <div className="card p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-red-100 rounded-2xl">
            <Trash2 size={20} className="text-red-600" />
          </div>
          <h2 className="font-semibold text-gray-800">Clear All Data</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">This will permanently delete all your data including finance entries, debts, bills, contacts, and settings.</p>
        <button onClick={() => setShowClearData(true)} className="w-full btn-danger">Clear All Data</button>
      </div>

      {showPinEnable && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Enable PIN</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New PIN</label>
                <input type="password" maxLength={4} value={newPin} onChange={(e) => setNewPin(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm PIN</label>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Change PIN</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current PIN</label>
                <input type="password" maxLength={4} value={currentPin} onChange={(e) => setCurrentPin(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New PIN</label>
                <input type="password" maxLength={4} value={newPin} onChange={(e) => setNewPin(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New PIN</label>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Disable PIN</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Enter PIN to disable</label>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-2xl flex-shrink-0">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Clear All Data?</h3>
                <p className="text-sm text-gray-600">This action cannot be undone. All your data will be permanently deleted.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowClearData(false)} className="flex-1 btn-secondary">Cancel</button>
              <button onClick={handleClearData} className="flex-1 btn-danger">Clear Data</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
