import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Contact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactState {
  contacts: Contact[];
  isHydrated: boolean;
  
  // Actions
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  getContact: (id: string) => Contact | undefined;
  setHydrated: (hydrated: boolean) => void;
}

export const useContactStore = create<ContactState>()(
  persist(
    (set, get) => ({
      contacts: [],
      isHydrated: false,
      
      addContact: (contact) => {
        const newContact: Contact = {
          ...contact,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ contacts: [...state.contacts, newContact] }));
      },
      
      updateContact: (id, updatedFields) => {
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.id === id
              ? { ...contact, ...updatedFields, updatedAt: new Date().toISOString() }
              : contact
          ),
        }));
      },
      
      deleteContact: (id) => {
        set((state) => ({
          contacts: state.contacts.filter((contact) => contact.id !== id),
        }));
      },
      
      getContact: (id) => {
        return get().contacts.find((contact) => contact.id === id);
      },
      
      setHydrated: (hydrated) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: 'pocket-finances-contacts',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
