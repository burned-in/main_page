import { useEffect, useState } from 'react';
import { layoutStyles as s } from './styles';

type Theme = 'dark' | 'light';

const storageKey = 'bunin-theme';

const normalizeTheme = (theme: string | null | undefined): Theme | null =>
  theme === 'dark' || theme === 'light' ? theme : null;

const getPreferredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark';

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const readStoredTheme = (): Theme | null => {
  try {
    return normalizeTheme(window.localStorage.getItem(storageKey));
  } catch {
    return null;
  }
};

const readDocumentTheme = (): Theme => {
  if (typeof document === 'undefined') return 'dark';

  return normalizeTheme(document.documentElement.dataset.theme) ?? readStoredTheme() ?? getPreferredTheme();
};

const persistTheme = (theme: Theme) => {
  try {
    window.localStorage.setItem(storageKey, theme);
  } catch {
    // Some in-app browsers can block localStorage. The DOM theme still updates.
  }
};

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');

  const applyTheme = (nextTheme: Theme, shouldPersist = true) => {
    const root = document.documentElement;

    root.dataset.theme = nextTheme;
    root.style.colorScheme = nextTheme;
    if (shouldPersist) persistTheme(nextTheme);
    setTheme(nextTheme);
    window.dispatchEvent(new CustomEvent('bunin-theme-change', { detail: { theme: nextTheme } }));
  };

  useEffect(() => {
    applyTheme(readDocumentTheme(), false);

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) return;

      applyTheme(normalizeTheme(event.newValue) ?? getPreferredTheme(), false);
    };

    window.addEventListener('storage', handleStorage);

    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleClick = () => {
    const currentTheme = readDocumentTheme();
    applyTheme(currentTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      className={s.themeToggle}
      type="button"
      aria-pressed={theme === 'dark'}
      aria-label="다크/라이트 테마 전환"
      onClick={handleClick}
    >
      <span aria-hidden="true" className={s.themeToggleOrb} />
      <span suppressHydrationWarning>{theme === 'light' ? 'Light' : 'Dark'}</span>
    </button>
  );
}
