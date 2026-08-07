import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '../components/TextField';
import { TextAreaField } from '../components/TextAreaField';
import { createFeatureRequest } from '../api/featureRequests';
import { ApiError } from '../api/http';
import { useToast } from '../components/ToastProvider';
import './CreatePage.css';

const TITLE_MIN = 10;
const TITLE_MAX = 200;
const DESCRIPTION_MAX = 2000;

export function CreatePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleTouched, setTitleTouched] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmedTitleLength = title.trim().length;
  const titleError = !titleTouched
    ? null
    : trimmedTitleLength === 0
      ? 'Title is required.'
      : trimmedTitleLength < TITLE_MIN
        ? `Title must be at least ${TITLE_MIN} characters (currently ${trimmedTitleLength}).`
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
      showToast('Request submitted. It is now pending review.', 'success');
      navigate(`/requests/${created.id}`);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-page">
      <h1>New feature request</h1>
      <p className="create-page__intro">
        Describe the feature you would like to see. Your request starts in the <strong>Pending</strong> state until
        an administrator reviews it.
      </p>
      <form onSubmit={handleSubmit} noValidate className="create-page__form">
        <TextField
          label="Title"
          value={title}
          onChange={setTitle}
          onBlur={() => setTitleTouched(true)}
          minLength={TITLE_MIN}
          maxLength={TITLE_MAX}
          required
          error={titleError}
          hint={`Between ${TITLE_MIN} and ${TITLE_MAX} characters.`}
          disabled={isSubmitting}
          placeholder="e.g. Add dark mode to the dashboard"
        />
        <TextAreaField
          label="Description"
          value={description}
          onChange={setDescription}
          maxLength={DESCRIPTION_MAX}
          hint="Optional. Up to 2000 characters."
          disabled={isSubmitting}
          rows={8}
          placeholder="Explain the problem this feature solves and how it should work…"
        />
        {submitError && (
          <p className="create-page__error" role="alert">
            {submitError}
          </p>
        )}
        <div className="create-page__actions">
          <button type="submit" className="button button--primary" disabled={isSubmitting || !isValid}>
            {isSubmitting ? 'Submitting…' : 'Submit request'}
          </button>
        </div>
      </form>
    </div>
  );
}
