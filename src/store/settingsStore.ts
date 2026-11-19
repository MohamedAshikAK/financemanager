import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  pin: string | null;
  currency: string;
  isHydrated: boolean;
  
  // Actions
  setPin: (pin: string | null) => void;
  setCurrency: (currency: string) => void;
  clearPin: () => void;
  setHydrated: (hydrated: boolean) => void;
}

// Simple encryption for PIN (not military-grade, but prevents casual access)
const encrypt = (text: string): string => {
  return btoa(text); // Base64 encoding (simple obfuscation)
};

const decrypt = (encoded: string): string => {
  try {
    return atob(encoded);
  } catch {
    return '';
  }
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      pin: null,
      currency: 'INR',
      isHydrated: false,
      
      setPin: (pin) => {
        set({ pin: pin ? encrypt(pin) : null });
      },
      
      setCurrency: (currency) => {
        set({ currency });
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
