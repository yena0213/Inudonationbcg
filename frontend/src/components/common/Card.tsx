import { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: boolean;
  hover?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

export function Card({ 
  children, 
  className = '', 
  padding = 'lg',
  shadow = true,
  hover = false,
  onClick,
  style: styleOverride
}: CardProps) {
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const hoverClass = hover ? 'hover:scale-[1.02] cursor-pointer' : '';
  const clickClass = onClick ? 'cursor-pointer' : '';
  
  const style: React.CSSProperties = {
    backgroundColor: 'var(--color-bg-tertiary)',
    borderRadius: 'var(--card-border-radius)',
    boxShadow: shadow ? 'var(--card-shadow)' : 'none',
    transition: 'var(--transition-base)',
    ...styleOverride,
  };
  
  return (
    <div
      className={`
        ${paddingStyles[padding]}
        ${hoverClass}
        ${clickClass}
        ${className}
      `}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
