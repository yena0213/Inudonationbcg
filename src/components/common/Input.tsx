import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  fullWidth = true,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-[var(--color-text-primary)] mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          w-full
          px-[var(--input-padding-x)]
          py-[var(--input-padding-y)]
          border-[var(--input-border-width)]
          border-[var(--color-border-medium)]
          rounded-[var(--input-border-radius)]
          focus:border-[var(--color-brand-primary)]
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--color-brand-primary)]/20
          transition-all
          ${error ? 'border-[var(--color-error)]' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-[var(--color-error)]">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
