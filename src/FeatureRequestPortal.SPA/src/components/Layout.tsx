import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useTranslation } from '../i18n';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import './Layout.css';

export function Layout() {
  const { currentUser, logout, isLoading } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        {t('nav.skipToContent')}
      </a>
      <header className="app-header">
        <div className="app-header__inner">
          <Link to="/" className="app-header__brand">
            {t('nav.brand')}
          </Link>
          <nav className="app-header__nav" aria-label={t('nav.primaryAriaLabel')}>
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
              {t('nav.requests')}
            </NavLink>
            {currentUser.isAuthenticated && (
              <NavLink to="/new" className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
                {t('nav.newRequest')}
              </NavLink>
            )}
          </nav>
          <div className="app-header__actions">
            <LanguageToggle />
            <ThemeToggle />
            {!isLoading &&
              (currentUser.isAuthenticated ? (
                <div className="app-header__user">
                  <span className="app-header__username mono">{currentUser.userName}</span>
                  <button type="button" className="button button--ghost button--sm" onClick={logout}>
                    {t('nav.signOut')}
                  </button>
                </div>
              ) : (
                <Link to="/login" className="button button--primary button--sm">
                  {t('common.signIn')}
                </Link>
              ))}
          </div>
        </div>
      </header>
      <main className="app-main" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>{t('footer.tagline')}</p>
      </footer>
    </div>
  );
}
