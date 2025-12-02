import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ 
  children, 
  className = '', 
  padding = 'lg',
  shadow = true,
  hover = false,
  onClick
}: CardProps) {
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const shadowStyle = shadow ? 'shadow-[var(--shadow-lg)]' : '';
  const hoverStyle = hover ? 'hover:shadow-[var(--shadow-xl)] hover:scale-[1.02] transition-all duration-200 cursor-pointer' : '';
  const clickStyle = onClick ? 'cursor-pointer' : '';
  
  return (
    <div
      className={`
        bg-white 
        rounded-[var(--card-border-radius)]
        ${paddingStyles[padding]}
        ${shadowStyle}
        ${hoverStyle}
        ${clickStyle}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
