interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div 
        className={`${sizeMap[size]} border-4 rounded-full animate-spin`}
        style={{
          borderColor: 'var(--color-brand-primary)',
          borderTopColor: 'transparent',
        }}
      />
      {message && (
        <p style={{ color: 'var(--color-brand-secondary)' }}>
          {message}
        </p>
      )}
    </div>
  );
}
