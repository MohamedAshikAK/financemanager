import { useState } from 'react';
import { DollarSign, Lock, LockOpen, Trash2, AlertTriangle } from 'lucide-react';
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
    <div className="p-4">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Settings
      </h1>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign size={20} className="text-blue-600" />
          <h2 className="font-medium text-gray-800">Currency</h2>
        </div>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {currencies.map((curr) => (
            <option key={curr.code} value={curr.code}>
              {curr.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center gap-2 mb-3">
          {pin ? <Lock size={20} className="text-blue-600" /> : <LockOpen size={20} className="text-gray-400" />}
          <h2 className="font-medium text-gray-800">PIN Lock</h2>
        </div>
        {pin ? (
          <div className="space-y-2">
            <button
              onClick={() => setShowPinChange(true)}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              Change PIN
            </button>
            <button
              onClick={() => setShowPinDisable(true)}
              className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors"
            >
              Disable PIN
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowPinEnable(true)}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Enable PIN
          </button>
        )}
      </div>

      {showPinEnable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Enable PIN</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {pinError && (
                <p className="text-red-500 text-sm">{pinError}</p>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setShowPinEnable(false);
                  setNewPin('');
                  setConfirmPin('');
                  setPinError('');
                }}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePinEnable}
                className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Enable
              </button>
            </div>
          </div>
        </div>
      )}

      {showPinChange && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Change PIN</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {pinError && (
                <p className="text-red-500 text-sm">{pinError}</p>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setShowPinChange(false);
                  setCurrentPin('');
                  setNewPin('');
                  setConfirmPin('');
                  setPinError('');
                }}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePinChange}
                className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      )}

      {showPinDisable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Disable PIN</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter PIN to disable</label>
                <input
                  type="password"
                  maxLength={4}
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {pinError && (
                <p className="text-red-500 text-sm">{pinError}</p>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setShowPinDisable(false);
                  setCurrentPin('');
                  setPinError('');
                }}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePinDisable}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Disable
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Trash2 size={20} className="text-red-600" />
          <h2 className="font-medium text-gray-800">Clear All Data</h2>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          This will permanently delete all your data including finance entries, debts, bills, contacts, and settings.
        </p>
        <button
          onClick={() => setShowClearData(true)}
          className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Clear All Data
        </button>
      </div>

      {showClearData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <div className="flex items-start gap-2 mb-4">
              <AlertTriangle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Clear All Data?</h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearData(false)}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
