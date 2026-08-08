import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '../components/TextField';
import { TextAreaField } from '../components/TextAreaField';
import { createFeatureRequest } from '../api/featureRequests';
import { ApiError } from '../api/http';
import { useToast } from '../components/ToastProvider';
import { useTranslation } from '../i18n';
import './CreatePage.css';

const TITLE_MIN = 10;
const TITLE_MAX = 200;
const DESCRIPTION_MAX = 2000;

export function CreatePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleTouched, setTitleTouched] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmedTitleLength = title.trim().length;
  const titleError = !titleTouched
    ? null
    : trimmedTitleLength === 0
      ? t('create.field.titleRequired')
      : trimmedTitleLength < TITLE_MIN
        ? t('create.field.titleTooShort', { min: TITLE_MIN, length: trimmedTitleLength })
        : null;

  const isValid = trimmedTitleLength >= TITLE_MIN && title.length <= TITLE_MAX && description.length <= DESCRIPTION_MAX;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTitleTouched(true);
    if (!isValid) return;
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const created = await createFeatureRequest({ title: title.trim(), description: description.trim() });
      showToast(t('create.toast.submitted'), 'success');
      navigate(`/requests/${created.id}`);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : t('create.error.generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-page">
      <h1>{t('create.title')}</h1>
      <p className="create-page__intro">{t('create.intro')}</p>
      <form onSubmit={handleSubmit} noValidate className="create-page__form">
        <TextField
          label={t('create.field.title')}
          value={title}
          onChange={setTitle}
          onBlur={() => setTitleTouched(true)}
          minLength={TITLE_MIN}
          maxLength={TITLE_MAX}
          required
          error={titleError}
          hint={t('create.field.titleHint', { min: TITLE_MIN, max: TITLE_MAX })}
          disabled={isSubmitting}
          placeholder={t('create.field.titlePlaceholder')}
        />
        <TextAreaField
          label={t('create.field.description')}
          value={description}
          onChange={setDescription}
          maxLength={DESCRIPTION_MAX}
          hint={t('create.field.descriptionHint', { max: DESCRIPTION_MAX })}
          disabled={isSubmitting}
          rows={8}
          placeholder={t('create.field.descriptionPlaceholder')}
        />
        {submitError && (
          <p className="create-page__error" role="alert">
            {submitError}
          </p>
        )}
        <div className="create-page__actions">
          <button type="submit" className="button button--primary" disabled={isSubmitting || !isValid}>
            {isSubmitting ? t('create.submitting') : t('create.submit')}
          </button>
        </div>
      </form>
    </div>
  );
}
