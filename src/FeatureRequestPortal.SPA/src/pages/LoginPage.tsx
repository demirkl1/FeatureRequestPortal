import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { AuthError } from '../api/auth';
import { useTranslation } from '../i18n';
import './LoginPage.css';

interface LoginLocationState {
  from?: { pathname: string };
}

export function LoginPage() {
  const { currentUser, login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoading && currentUser.isAuthenticated) {
    const state = location.state as LoginLocationState | null;
    return <Navigate to={state?.from?.pathname ?? '/'} replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(username, password);
      const state = location.state as LoginLocationState | null;
      navigate(state?.from?.pathname ?? '/', { replace: true });
    } catch (err) {
      setError(err instanceof AuthError ? err.message : t('login.error.generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>{t('login.title')}</h1>
        <p className="login-card__subtitle">{t('login.subtitle')}</p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="login-username" className="field__label">
              {t('login.username')}
            </label>
            <input
              id="login-username"
              className="field__input"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
              disabled={isSubmitting}
              aria-describedby={error ? 'login-error' : undefined}
              aria-invalid={error ? true : undefined}
            />
          </div>
          <div className="field">
            <label htmlFor="login-password" className="field__label">
              {t('login.password')}
            </label>
            <input
              id="login-password"
              type="password"
              className="field__input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              disabled={isSubmitting}
              aria-describedby={error ? 'login-error' : undefined}
              aria-invalid={error ? true : undefined}
            />
          </div>
          {error && (
            <p id="login-error" className="login-card__error" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="button button--primary button--block"
            disabled={isSubmitting || !username || !password}
          >
            {isSubmitting ? t('login.submitting') : t('login.submit')}
          </button>
        </form>
        <p className="login-card__hint">
          {t('login.hint')} <span className="mono">admin</span> / <span className="mono">1q2w3E*</span>
        </p>
      </div>
    </div>
  );
}
