import { useId } from 'react';
import type { ChangeEvent, HTMLAttributes } from 'react';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  error?: string | null;
  hint?: string;
  disabled?: boolean;
  autoComplete?: string;
  type?: string;
  placeholder?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
}

export function TextField({
  label,
  value,
  onChange,
  onBlur,
  maxLength,
  required,
  error,
  hint,
  disabled,
  autoComplete,
  type = 'text',
  placeholder,
  inputMode,
}: TextFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className="field">
      <div className="field__label-row">
        <label htmlFor={id} className="field__label">
          {label}
          {required && (
            <span className="field__required" aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
        {maxLength !== undefined && (
          <span className="field__counter" aria-hidden="true">
            {value.length} / {maxLength}
          </span>
        )}
      </div>
      <input
        id={id}
        className="field__input"
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        maxLength={maxLength}
        required={required}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        onBlur={onBlur}
      />
      {hint && !error && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
