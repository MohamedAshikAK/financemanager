import { useState, useEffect, useRef } from 'react';
import { Lock } from 'lucide-react';
import { useSettingsStore, verifyPin } from '../../store/settingsStore';
import { CONFIG } from '../../config/constants';

interface PinEntryProps {
  onSuccess: () => void;
}

export default function PinEntry({ onSuccess }: PinEntryProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);
  const storedPin = useSettingsStore((state) => state.pin);
  const timerRef = useRef<number | null>(null);

  const handlePinChange = (value: string) => {
    if (value.length <= 4) {
      setPin(value);
      setError(false);
    }
  };

  const handleSubmit = () => {
    if (isLocked) return;
    
    if (verifyPin(pin, storedPin)) {
      onSuccess();
      setPin('');
      setError(false);
      setAttempts(0);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError(true);
      setPin('');
      
      if (newAttempts >= CONFIG.PIN.MAX_ATTEMPTS) {
        setIsLocked(true);
        const lockSeconds = 30;
        setLockTime(lockSeconds);
        
        // Clear existing timer if any
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        
        timerRef.current = setInterval(() => {
          setLockTime((prev) => {
            if (prev <= 1) {
              if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
              }
              setIsLocked(false);
              setAttempts(0);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center p-3">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <Lock size={32} className="text-blue-600 mb-2" />
          <h1 className="text-xl font-semibold text-slate-800">Enter PIN</h1>
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-8 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-semibold ${
                error
                  ? 'border-red-500 bg-red-50'
                  : 'border-slate-300 bg-slate-50'
              }`}
            >
              {pin[index] ? '•' : ''}
            </div>
          ))}
        </div>

        {isLocked && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-center">
            <p className="text-red-600 font-semibold">Too many attempts</p>
            <p className="text-red-500 text-sm">Try again in {lockTime} seconds</p>
          </div>
        )}
        
        {error && !isLocked && (
          <p className="text-red-500 text-sm text-center mb-4">
            Incorrect PIN. {CONFIG.PIN.MAX_ATTEMPTS - attempts} attempts remaining.
          </p>
        )}

        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={pin}
          onChange={(e) => handlePinChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && pin.length === 4) {
              handleSubmit();
            }
          }}
          className="opacity-0 absolute"
          autoFocus
        />

        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handlePinChange(pin + num.toString())}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xl font-semibold py-2 rounded-lg transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handlePinChange('')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-lg py-2 rounded-lg transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => handlePinChange(pin + '0')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xl font-semibold py-2 rounded-lg transition-colors"
          >
            0
          </button>
          <button
            onClick={handleSubmit}
            disabled={pin.length !== 4}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-lg py-2 rounded-lg transition-colors"
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  );
}
