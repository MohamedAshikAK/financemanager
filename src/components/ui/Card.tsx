import { memo } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
}

function Card({ children, className = '', elevated = false }: CardProps) {
  const baseStyles = elevated
    ? 'bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 shadow-slate-300/50 dark:bg-[#2c2c2e] dark:border-[#38383a]'
    : 'bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 shadow-slate-200/50 dark:bg-[#1c1c1e] dark:border-[#38383a]';

  return (
    <div className={`${baseStyles} ${className}`}>
      {children}
    </div>
  );
}

export default memo(Card);
