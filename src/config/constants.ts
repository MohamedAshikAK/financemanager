export const CONFIG = {
  PIN: {
    LENGTH: 4,
    MAX_ATTEMPTS: 3,
    AUTO_LOCK_MINUTES: 5,
  },
  CURRENCY: {
    DEFAULT: 'INR',
  },
  STORAGE: {
    KEYS: {
      FINANCE: 'pocket-finances-finance',
      LOANS: 'pocket-finances-loans',
      BILLS: 'pocket-finances-bills',
      CONTACTS: 'pocket-finances-contacts',
      SETTINGS: 'pocket-finances-settings',
    },
  },
} as const;
