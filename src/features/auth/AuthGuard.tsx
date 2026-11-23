import { useEffect, useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import PinEntry from './PinEntry';
import { CONFIG } from '../../config/constants';

const AUTO_LOCK_TIME = CONFIG.PIN.AUTO_LOCK_MINUTES * 60 * 1000;

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pin = useSettingsStore((state) => state.pin);
  const isHydrated = useSettingsStore((state) => state.isHydrated);

  useEffect(() => {
    if (!isHydrated) return;

    // If no PIN is set, allow access without PIN
    if (!pin) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false); // Require PIN entry
    }
  }, [isHydrated, pin]);

  // Auto-lock after inactivity (only if PIN is set)
  useEffect(() => {
    if (!isAuthenticated || !pin) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsAuthenticated(false);
      }, AUTO_LOCK_TIME);
    };

    // Track user activity
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer(); // Start timer on mount

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated, pin]);

  const handlePinSuccess = () => {
    setIsAuthenticated(true);
  };

  // Show loading while store hydrates
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // If no PIN is set, show app content directly
  if (!pin) {
    return <>{children}</>;
  }

  // Show PIN entry if not authenticated
  if (!isAuthenticated) {
    return <PinEntry onSuccess={handlePinSuccess} />;
  }

  // Show app content if authenticated
  return <>{children}</>;
}
