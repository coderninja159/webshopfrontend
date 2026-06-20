import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ClipboardList, Users, LogOut, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearSession, user } = useAuthStore();

  const handleLogout = () => {
    clearSession();
    navigate('/admin-secure-gate');
  };

  const navItems = [
    { label: 'Bosh sahifa', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Mahsulotlar', path: '/admin/products', icon: ShoppingBag },
    { label: 'Buyurtmalar', path: '/admin/orders', icon: ClipboardList },
    { label: 'Mijozlar', path: '/admin/customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#f2f4f7] flex text-left font-sans">
      
      {/* Fixed Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed top-0 bottom-0 left-0 z-30 flex flex-col justify-between shadow-sm">
        
        {/* Top brand header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-650 shrink-0">
              <ShieldCheck size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <span className="font-display font-extrabold text-base text-gray-900 tracking-tight block leading-none">
                shopwep
              </span>
              <span className="text-[9px] font-extrabold tracking-widest text-purple-600 uppercase block mt-1">
                Admin Panel
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === '/admin/products' && location.pathname.startsWith('/admin/products'));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-purple-50 text-purple-750 border border-purple-100'
                    : 'text-gray-500 hover:text-purple-650 hover:bg-gray-50 border border-transparent'
                }`}
              >
                <Icon size={16} className={`shrink-0 ${isActive ? 'text-purple-700' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom profile and logout section */}
        <div className="p-4 border-t border-gray-100 space-y-3.5">
          
          {/* User badge */}
          <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-xl p-2.5">
            <div className="h-8 w-8 rounded-lg bg-purple-100 text-purple-700 font-extrabold text-xs flex items-center justify-center shrink-0 uppercase">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-extrabold text-gray-950 block truncate leading-none">
                {user?.name || 'Admin'}
              </span>
              <span className="text-[9px] text-gray-400 font-bold block mt-1 truncate">
                {user?.emailOrPhone || 'admin@shopwep.uz'}
              </span>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-xl border border-red-150 bg-red-50 text-red-750 hover:bg-red-500 hover:text-white transition-all text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer shadow-sm shadow-red-100/5"
          >
            <LogOut size={13} className="stroke-[2.5]" />
            <span>Tizimdan chiqish</span>
          </button>

        </div>

      </aside>

      {/* Right core content panel */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        <main className="flex-grow p-8">
          {children}
        </main>
      </div>

    </div>
  );
}
