import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import './Layout.css';

export function Layout() {
  const { currentUser, logout, isLoading } = useAuth();

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="app-header">
        <div className="app-header__inner">
          <Link to="/" className="app-header__brand">
            Feature Request Portal
          </Link>
          <nav className="app-header__nav" aria-label="Primary">
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
              Requests
            </NavLink>
            {currentUser.isAuthenticated && (
              <NavLink to="/new" className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
                New request
              </NavLink>
            )}
          </nav>
          <div className="app-header__actions">
            <ThemeToggle />
            {!isLoading &&
              (currentUser.isAuthenticated ? (
                <div className="app-header__user">
                  <span className="app-header__username mono">{currentUser.userName}</span>
                  <button type="button" className="button button--ghost button--sm" onClick={logout}>
                    Sign out
                  </button>
                </div>
              ) : (
                <Link to="/login" className="button button--primary button--sm">
                  Sign in
                </Link>
              ))}
          </div>
        </div>
      </header>
      <main className="app-main" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>Feature Request Portal — React, TypeScript &amp; react-router-dom.</p>
      </footer>
    </div>
  );
}
