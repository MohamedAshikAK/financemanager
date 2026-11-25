import { memo } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-white mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full p-4 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 focus:bg-white/80 transition-all duration-300 text-sm placeholder-slate-400 dark:bg-[#1c1c1e] dark:border-[#38383a] dark:text-white dark:placeholder-[#8e8e93] dark:focus:bg-[#2c2c2e] dark:focus:ring-purple-500/50 dark:focus:border-purple-500 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

export default memo(Input);
