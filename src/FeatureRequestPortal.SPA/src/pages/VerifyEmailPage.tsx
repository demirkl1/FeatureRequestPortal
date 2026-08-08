import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { resendVerificationCode, verifyEmail } from '../api/accountRegistration';
import { ApiError } from '../api/http';
import { TextField } from '../components/TextField';
import { useToast } from '../components/ToastProvider';
import { useTranslation } from '../i18n';
import './VerifyEmailPage.css';

interface VerifyEmailLocationState {
  email?: string;
}

const CODE_PATTERN = /^\d{6}$/;

export function VerifyEmailPage() {
  const { userId } = useParams<{ userId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const [code, setCode] = useState('');
  const [touched, setTouched] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  if (!userId) {
    return <Navigate to="/signup" replace />;
  }

  const email = (location.state as VerifyEmailLocationState | null)?.email;
  const codeError = touched && !CODE_PATTERN.test(code) ? t('verify.field.codeRequired') : null;
  const isCodeValid = CODE_PATTERN.test(code);

  const handleCodeChange = (value: string) => {
    setCode(value.replace(/\D/g, '').slice(0, 6));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    if (!isCodeValid) return;
    setVerifyError(null);
    setIsVerifying(true);
    try {
      await verifyEmail({ userId, code });
      navigate('/pending-approval', { replace: true });
    } catch (err) {
      setVerifyError(err instanceof ApiError ? err.message : t('verify.error.generic'));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await resendVerificationCode(userId);
      showToast(t('verify.toast.resent'), 'success');
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : t('verify.error.resend'), 'error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="verify-page">
      <div className="verify-card">
        <h1>{t('verify.title')}</h1>
        <p className="verify-card__subtitle">{email ? t('verify.subtitle', { email }) : t('verify.subtitle.fallback')}</p>
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label={t('verify.field.code')}
            value={code}
            onChange={handleCodeChange}
            onBlur={() => setTouched(true)}
            required
            error={codeError}
            disabled={isVerifying}
            maxLength={6}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
          />
          {verifyError && (
            <p className="verify-card__error" role="alert">
              {verifyError}
            </p>
          )}
          <div className="verify-card__actions">
            <button type="submit" className="button button--primary" disabled={isVerifying || !isCodeValid}>
              {isVerifying ? t('verify.submitting') : t('verify.submit')}
            </button>
            <button
              type="button"
              className="button button--ghost"
              onClick={() => void handleResend()}
              disabled={isResending || isVerifying}
            >
              {isResending ? t('verify.resending') : t('verify.resend')}
            </button>
          </div>
          <p className="sr-only" aria-live="polite">
            {isVerifying ? t('verify.submitting') : isResending ? t('verify.resending') : ''}
          </p>
        </form>
      </div>
    </div>
  );
}
