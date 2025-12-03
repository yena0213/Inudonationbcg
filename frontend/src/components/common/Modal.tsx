import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'md',
  showCloseButton = true 
}: ModalProps) {
  if (!isOpen) return null;
  
  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };
  
  return (
    <div 
      className="fixed inset-0 bg-[var(--color-bg-overlay)] backdrop-blur-sm flex items-center justify-center p-4 z-[var(--z-modal)] animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`
          bg-white 
          rounded-[var(--modal-border-radius)]
          shadow-[var(--modal-shadow)]
          w-full 
          ${maxWidthStyles[maxWidth]}
          max-h-[90vh] 
          overflow-y-auto
          animate-slide-up
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="p-6 border-b border-[var(--color-border-light)] flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-[var(--modal-border-radius)]">
            {title && <h2 className="text-[var(--color-text-primary)]">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
