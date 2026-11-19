import { useEffect, useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import PinEntry from './PinEntry';
import PinSetup from './PinSetup';

const AUTO_LOCK_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const pin = useSettingsStore((state) => state.pin);
  const isHydrated = useSettingsStore((state) => state.isHydrated);

  useEffect(() => {
    if (!isHydrated) return;

    // Check if PIN is set
    if (!pin) {
      setShowPinSetup(true);
    } else {
      setIsAuthenticated(false); // Require PIN entry
    }
  }, [isHydrated, pin]);

  // Auto-lock after inactivity
  useEffect(() => {
    if (!isAuthenticated) return;

    let timeoutId: NodeJS.Timeout;

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
  }, [isAuthenticated]);

  const handlePinSuccess = () => {
    setIsAuthenticated(true);
  };

  const handlePinSetupComplete = () => {
    setShowPinSetup(false);
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

  // Show PIN setup if no PIN is set
  if (showPinSetup) {
    return <PinSetup onComplete={handlePinSetupComplete} />;
  }

  // Show PIN entry if not authenticated
  if (!isAuthenticated) {
    return <PinEntry onSuccess={handlePinSuccess} />;
  }

  // Show app content if authenticated
  return <>{children}</>;
}
