interface ProgressBarProps {
  current: number;
  goal: number;
  height?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  color?: string;
}

export function ProgressBar({ 
  current, 
  goal, 
  height = 'md',
  showPercentage = false,
  color = 'var(--color-brand-primary)'
}: ProgressBarProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  
  const heightStyles = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };
  
  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightStyles[height]}`}>
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
      {showPercentage && (
        <p className="mt-1 text-sm text-[var(--color-text-secondary)] text-right">
          {percentage.toFixed(0)}%
        </p>
      )}
    </div>
  );
}
