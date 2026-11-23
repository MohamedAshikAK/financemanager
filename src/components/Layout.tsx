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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 pb-20">
      <main className="max-w-lg mx-auto">
        {children}
      </main>
      
      {/* Modern Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200/50 z-50 shadow-2xl shadow-slate-900/5">
        <div className="max-w-lg mx-auto flex justify-around items-center h-20 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'text-blue-600 bg-blue-50/50 scale-105'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all duration-200 ${
                  isActive ? 'bg-blue-100 shadow-md shadow-blue-500/20' : ''
                }`}>
                  <Icon size={22} strokeWidth={2.5} />
                </div>
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
