import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  padding?: boolean;
}

export function Container({ 
  children, 
  maxWidth = 'xl', 
  className = '',
  padding = true 
}: ContainerProps) {
  const maxWidthMap = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  const paddingClass = padding ? 'px-4 md:px-6 lg:px-8' : '';

  return (
    <div className={`mx-auto w-full ${maxWidthMap[maxWidth]} ${paddingClass} ${className}`}>
      {children}
    </div>
  );
}
