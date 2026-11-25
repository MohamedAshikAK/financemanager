import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, CreditCard, User, Settings, Database, FileText } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/finance', label: 'Finance', icon: Wallet },
  { path: '/debt', label: 'Debt', icon: CreditCard },
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
    <div className="min-h-screen pb-20">
      <main className="max-w-lg mx-auto px-3 pt-3">
        {children}
      </main>
      
      {/* iOS-style Glassmorphism Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-2xl border-t border-white/50 z-50 shadow-2xl shadow-slate-900/10">
        <div className="max-w-lg mx-auto flex justify-around items-center h-20 px-2 pb-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'text-purple-600 bg-gradient-to-t from-purple-100/50 to-transparent scale-105'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
                }`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className={`p-2 rounded-2xl transition-all duration-300 ${
                  isActive ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30' : ''
                }`}>
                  <Icon size={20} strokeWidth={2.5} className={isActive ? 'text-white' : ''} />
                </div>
                <span className="text-[11px] mt-1.5 font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
