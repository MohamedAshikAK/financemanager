import { useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useSettingsStore((state) => state.darkMode);

  useEffect(() => {
    const body = document.body;
    if (darkMode) {
      body.classList.remove('light');
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
      body.classList.add('light');
    }
  }, [darkMode]);

  return <>{children}</>;
}
