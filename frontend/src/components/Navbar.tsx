import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Home, ShieldCheck } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Chat', path: '/chat', icon: MessageSquare },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900 tracking-tight">FAIRCHAT</span>
            </Link>
          </div>
          <div className="hidden sm:flex sm:space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                    isActive
                      ? "border-blue-600 text-slate-900"
                      : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center sm:hidden">
            {/* Mobile menu button could go here */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
