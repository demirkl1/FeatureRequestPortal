import { useTranslation } from '../i18n';
import './LanguageToggle.css';

export function LanguageToggle() {
  const { language, setLanguage, t } = useTranslation();
  const nextLanguage = language === 'en' ? 'tr' : 'en';
  const label = t(nextLanguage === 'tr' ? 'language.switchToTurkish' : 'language.switchToEnglish');

  const toggle = () => {
    setLanguage(nextLanguage);
  };

  return (
    <button
      type="button"
      className="language-toggle"
      onClick={toggle}
      aria-pressed={language === 'tr'}
      aria-label={label}
      title={label}
    >
      <span aria-hidden="true" className="language-toggle__icon">
        🌐
      </span>
      <span className="language-toggle__label">{language.toUpperCase()}</span>
    </button>
  );
}
