import { useState } from 'react';
import { Lock, Check } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

interface PinSetupProps {
  onComplete: () => void;
}

export default function PinSetup({ onComplete }: PinSetupProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [error, setError] = useState('');
  const setPinStore = useSettingsStore((state) => state.setPin);

  const handlePinChange = (value: string, isConfirm: boolean = false) => {
    if (value.length <= 4) {
      if (isConfirm) {
        setConfirmPin(value);
      } else {
        setPin(value);
      }
      setError('');
    }
  };

  const handleCreateSubmit = () => {
    if (pin.length !== 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }
    setStep('confirm');
  };

  const handleConfirmSubmit = () => {
    if (confirmPin.length !== 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }
    if (pin !== confirmPin) {
      setError('PINs do not match');
      setConfirmPin('');
      return;
    }
    setPinStore(pin);
    onComplete();
  };

  const renderPinDots = (value: string, isError: boolean) => {
    return (
      <div className="flex justify-center gap-3 mb-4">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-semibold ${
              isError
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            {value[index] ? '•' : ''}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <Lock size={48} className="text-blue-600 mb-2" />
          <h1 className="text-xl font-semibold text-gray-800">
            {step === 'create' ? 'Create PIN' : 'Confirm PIN'}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {step === 'create' 
              ? 'Set a 4-digit PIN to secure your app' 
              : 'Enter your PIN again to confirm'}
          </p>
        </div>

        {renderPinDots(step === 'create' ? pin : confirmPin, !!error)}

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={step === 'create' ? pin : confirmPin}
          onChange={(e) => handlePinChange(e.target.value, step === 'confirm')}
          className="opacity-0 absolute"
          autoFocus
        />

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handlePinChange(
                (step === 'create' ? pin : confirmPin) + num.toString(),
                step === 'confirm'
              )}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-2xl font-semibold py-4 rounded-lg transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => {
              if (step === 'confirm') {
                setStep('create');
                setConfirmPin('');
              } else {
                setPin('');
              }
              setError('');
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-lg py-4 rounded-lg transition-colors"
          >
            {step === 'confirm' ? 'Back' : 'Clear'}
          </button>
          <button
            onClick={() => handlePinChange(
              (step === 'create' ? pin : confirmPin) + '0',
              step === 'confirm'
            )}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-2xl font-semibold py-4 rounded-lg transition-colors"
          >
            0
          </button>
          <button
            onClick={step === 'create' ? handleCreateSubmit : handleConfirmSubmit}
            disabled={(step === 'create' ? pin : confirmPin).length !== 4}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-lg py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {step === 'confirm' ? <Check size={20} /> : null}
            {step === 'create' ? 'Next' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
