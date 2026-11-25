import { memo } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  children: React.ReactNode;
}

function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyles = 'font-semibold py-3 px-5 rounded-2xl transition-all duration-300 active:scale-95 text-sm';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/30 backdrop-blur-sm',
    secondary: 'bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 border border-slate-200/50 shadow-sm dark:bg-[#2c2c2e] dark:text-white dark:border-[#38383a] dark:hover:bg-[#3a3a3c]',
    danger: 'bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 hover:from-rose-600 hover:via-red-600 hover:to-orange-600 text-white shadow-lg shadow-red-500/30 backdrop-blur-sm',
    success: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white shadow-lg shadow-emerald-500/30 backdrop-blur-sm',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default memo(Button);
