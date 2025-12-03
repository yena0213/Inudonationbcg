import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'animal' | 'environment' | 'education' | 'points' | 'default';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className = '' }: BadgeProps) {
  const variantStyles = {
    animal: 'bg-[var(--color-category-animal)] text-white',
    environment: 'bg-[var(--color-category-environment)] text-white',
    education: 'bg-[var(--color-category-education)] text-white',
    points: 'bg-[var(--color-points)] text-[var(--color-text-primary)]',
    default: 'bg-gray-200 text-[var(--color-text-primary)]',
  };
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };
  
  return (
    <span
      className={`
        inline-flex items-center justify-center
        rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
