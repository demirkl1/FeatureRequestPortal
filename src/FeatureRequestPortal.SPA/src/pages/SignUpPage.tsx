import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { registerAccount } from '../api/accountRegistration';
import { ApiError } from '../api/http';
import { TextField } from '../components/TextField';
import { useTranslation } from '../i18n';
import './SignUpPage.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignUpPage() {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ username: false, email: false, password: false });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoading && currentUser.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const usernameError = touched.username && username.trim().length === 0 ? t('signup.field.usernameRequired') : null;
  const emailError = !touched.email
    ? null
    : email.trim().length === 0
      ? t('signup.field.emailRequired')
      : !EMAIL_PATTERN.test(email.trim())
        ? t('signup.field.emailInvalid')
        : null;
  const passwordError = touched.password && password.length === 0 ? t('signup.field.passwordRequired') : null;

  const isValid = username.trim().length > 0 && EMAIL_PATTERN.test(email.trim()) && password.length > 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ username: true, email: true, password: true });
    if (!isValid) return;
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const result = await registerAccount({
        userName: username.trim(),
        email: email.trim(),
        password,
      });
      navigate(`/verify-email/${result.userId}`, { state: { email: email.trim() } });
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : t('signup.error.generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1>{t('signup.title')}</h1>
        <p className="signup-card__subtitle">{t('signup.subtitle')}</p>
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label={t('signup.field.username')}
            value={username}
            onChange={setUsername}
            onBlur={() => setTouched((prev) => ({ ...prev, username: true }))}
            required
            error={usernameError}
            disabled={isSubmitting}
            autoComplete="username"
          />
          <TextField
            label={t('signup.field.email')}
            value={email}
            onChange={setEmail}
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            required
            error={emailError}
            disabled={isSubmitting}
            type="email"
            autoComplete="email"
          />
          <TextField
            label={t('signup.field.password')}
            value={password}
            onChange={setPassword}
            onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
            required
            error={passwordError}
            disabled={isSubmitting}
            type="password"
            autoComplete="new-password"
          />
          {submitError && (
            <p className="signup-card__error" role="alert">
              {submitError}
            </p>
          )}
          <button type="submit" className="button button--primary button--block" disabled={isSubmitting}>
            {isSubmitting ? t('signup.submitting') : t('signup.submit')}
          </button>
        </form>
        <p className="signup-card__hint">
          {t('signup.haveAccount')} <Link to="/login">{t('common.signIn')}</Link>
        </p>
      </div>
    </div>
  );
}
