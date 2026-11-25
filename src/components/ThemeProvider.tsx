import { useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useSettingsStore((state) => state.darkMode);
  const fontSize = useSettingsStore((state) => state.fontSize);

  useEffect(() => {
    const body = document.body;
    
    // Apply dark mode
    if (darkMode) {
      body.classList.remove('light');
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
      body.classList.add('light');
    }
    
    // Apply font size
    body.classList.remove('font-small', 'font-medium', 'font-large');
    body.classList.add(`font-${fontSize}`);
  }, [darkMode, fontSize]);

  return <>{children}</>;
}
