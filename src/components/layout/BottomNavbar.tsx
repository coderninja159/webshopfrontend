import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { motion } from 'framer-motion';

export function BottomNavbar() {
  const location = useLocation();
  const itemCount = useCartStore((state) => state.getItemCount());

  // Hide BottomNavbar on landing page
  if (location.pathname === '/') {
    return null;
  }

  const items = [
    { name: 'Asosiy', path: '/store', icon: Home },
    { name: 'Katalog', path: '/products', icon: Compass },
    { name: 'Savat', path: '/cart', icon: ShoppingCart, badge: true },
    { name: 'Profil', path: '/dashboard', icon: User },
  ];

  return (
    <div className="fixed bottom-5 left-4 right-4 z-40 md:hidden">
      <div className="bg-white shadow-xl rounded-2xl px-4 py-2 flex items-center justify-around border border-gray-100 max-w-lg mx-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative p-2.5 flex flex-col items-center justify-center cursor-pointer select-none text-gray-400 hover:text-purple-600 transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="activeBottomTab"
                  className="absolute inset-0 bg-purple-50 rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
              
              <div className="relative">
                <motion.div
                  animate={isActive ? { scale: 1.1, y: -1 } : { scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Icon size={20} className={isActive ? 'text-purple-600' : 'text-gray-400'} />
                </motion.div>
                
                {item.badge && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 h-4 min-w-[16px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className={`text-[9px] font-semibold tracking-wide mt-1 ${isActive ? 'text-purple-600' : 'text-gray-400'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
