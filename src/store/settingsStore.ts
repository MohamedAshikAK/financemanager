import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  pin: string | null;
  currency: string;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  isHydrated: boolean;
  
  // Actions
  setPin: (pin: string | null) => void;
  setCurrency: (currency: string) => void;
  setDarkMode: (darkMode: boolean) => void;
  setFontSize: (fontSize: 'small' | 'medium' | 'large') => void;
  clearPin: () => void;
  setHydrated: (hydrated: boolean) => void;
}

// Simple encryption using XOR with a key (better than Base64)
const ENCRYPTION_KEY = import.meta.env.VITE_PIN_ENCRYPTION_KEY || 'pocket-finances-secret-key-2024';

const encrypt = (text: string): string => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(
      text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
    );
  }
  return btoa(result);
};

const decrypt = (encoded: string): string => {
  try {
    const decoded = atob(encoded);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(
        decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
      );
    }
    return result;
  } catch {
    return '';
  }
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      pin: null,
      currency: 'INR',
      darkMode: false,
      fontSize: 'medium',
      isHydrated: false,
      
      setPin: (pin) => {
        try {
          set({ pin: pin ? encrypt(pin) : null });
        } catch (error) {
          console.error('Error saving PIN:', error);
          if (error instanceof Error && error.name === 'QuotaExceededError') {
            throw new Error('Storage is full. Please clear some data.');
          }
          throw new Error('Failed to save PIN');
        }
      },
      
      setCurrency: (currency) => {
        set({ currency });
      },
      
      setDarkMode: (darkMode) => {
        set({ darkMode });
      },
      
      setFontSize: (fontSize) => {
        set({ fontSize });
      },
      
      clearPin: () => {
        set({ pin: null });
      },
      
      setHydrated: (hydrated) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: 'pocket-finances-settings',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

// Helper to verify PIN
export const verifyPin = (inputPin: string, storedPin: string | null): boolean => {
  if (!storedPin) return true; // No PIN set
  try {
    const decrypted = decrypt(storedPin);
    return inputPin === decrypted;
  } catch {
    return false;
  }
};
