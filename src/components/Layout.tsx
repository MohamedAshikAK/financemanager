import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, CreditCard, Users, User, Settings, Database } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/finance', label: 'Finance', icon: Wallet },
  { path: '/debt', label: 'Debt', icon: CreditCard },
  { path: '/groups', label: 'Groups', icon: Users },
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
    <div className="min-h-screen bg-gray-50 pb-16">
      <main className="max-w-lg mx-auto">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-lg mx-auto flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full ${
                  isActive ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
