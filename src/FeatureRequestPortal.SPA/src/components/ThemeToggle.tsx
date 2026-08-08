import { useEffect, useState } from 'react';
import { useTranslation } from '../i18n';
import './ThemeToggle.css';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'frp.theme';

function getStoredTheme(): Theme | null {
  const value = localStorage.getItem(STORAGE_KEY);
  return value === 'light' || value === 'dark' ? value : null;
}

function getSystemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeToggle() {
  const { t } = useTranslation();
  const [explicitTheme, setExplicitTheme] = useState<Theme | null>(() => getStoredTheme());
  const [systemDark, setSystemDark] = useState<boolean>(() => getSystemPrefersDark());

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (explicitTheme) {
      document.documentElement.setAttribute('data-theme', explicitTheme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [explicitTheme]);

  const isDark = explicitTheme ? explicitTheme === 'dark' : systemDark;

  const toggle = () => {
    const next: Theme = isDark ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    setExplicitTheme(next);
  };

  const switchLabel = t(isDark ? 'theme.switchToLight' : 'theme.switchToDark');

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label={switchLabel}
      title={switchLabel}
    >
      <span aria-hidden="true" className="theme-toggle__icon">
        {isDark ? '🌙' : '☀️'}
      </span>
      <span className="theme-toggle__label">{t(isDark ? 'theme.dark' : 'theme.light')}</span>
    </button>
  );
}
