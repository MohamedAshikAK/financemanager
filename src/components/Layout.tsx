import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, CreditCard, FileText, User, Settings, Database, Calendar } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/finance', label: 'Finance', icon: Wallet },
  { path: '/debt', label: 'Debt', icon: CreditCard },
  { path: '/monthly-debt', label: 'Monthly', icon: Calendar },
  { path: '/bills', label: 'Bills', icon: FileText },
  { path: '/contacts', label: 'Contacts', icon: User },
  { path: '/backup', label: 'Backup', icon: Database },
  { path: '/settings', label: 'Settings', icon: Settings },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen pb-16">
      <main className="max-w-lg mx-auto px-3 pt-3">
        {children}
      </main>
      
      {/* iOS-style Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-2xl border-t border-white/50 z-50 shadow-2xl shadow-slate-900/10 dark:bg-[#1c1c1e] dark:border-[#38383a]">
        <div className="max-w-lg mx-auto flex justify-around items-center h-16 px-1 pb-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'text-blue-600 bg-gradient-to-t from-blue-100/50 to-transparent scale-105 dark:text-white dark:from-blue-500/20'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50 dark:text-[#8e8e93] dark:hover:text-white dark:hover:bg-[#2c2c2e]/50'
                }`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className={`p-1.5 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : ''
                }`}>
                  <Icon size={18} strokeWidth={2.5} className={isActive ? 'text-white' : ''} />
                </div>
                <span className="text-[10px] mt-1 font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
