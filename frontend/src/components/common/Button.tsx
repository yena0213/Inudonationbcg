import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  children, 
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = `
    transition-all
    disabled:opacity-50 
    disabled:cursor-not-allowed
    font-medium
  `.replace(/\s+/g, ' ').trim();
  
  const variantStyles = {
    primary: `
      text-[var(--color-text-inverse)]
      hover:opacity-90
    `,
    secondary: `
      bg-gray-200 
      hover:bg-gray-300 
      text-[var(--color-text-primary)]
    `,
    success: `
      text-[var(--color-text-inverse)]
      hover:opacity-90
    `,
    warning: `
      text-[var(--color-text-inverse)]
      hover:opacity-90
    `,
    error: `
      text-[var(--color-text-inverse)]
      hover:opacity-90
    `,
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  };
  
  // 인라인 스타일로 토큰 적용
  const getVariantStyle = () => {
    const styles: React.CSSProperties = {
      transition: 'var(--transition-base)',
      borderRadius: 'var(--button-border-radius)',
    };
    
    switch (variant) {
      case 'primary':
        styles.backgroundColor = 'var(--color-brand-primary)';
        break;
      case 'success':
        styles.backgroundColor = 'var(--color-success)';
        break;
      case 'warning':
        styles.backgroundColor = 'var(--color-warning)';
        break;
      case 'error':
        styles.backgroundColor = 'var(--color-error)';
        break;
    }
    
    return styles;
  };
  
  const widthStyle = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      style={getVariantStyle()}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}