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
  const baseStyles = 'transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-[var(--color-text-primary)]',
    success: 'bg-[var(--color-success)] hover:bg-green-600 text-white',
    warning: 'bg-[var(--color-warning)] hover:bg-orange-600 text-white',
    error: 'bg-[var(--color-error)] hover:bg-red-600 text-white',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded-xl',
    md: 'px-6 py-3 rounded-2xl',
    lg: 'px-8 py-4 text-lg rounded-3xl',
  };
  
  const widthStyle = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
