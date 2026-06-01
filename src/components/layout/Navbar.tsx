import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, ShoppingCart, User, ClipboardList, Shield } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { useCategoryStore } from '../../stores/useCategoryStore';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const { fetchCategories } = useCategoryStore();
  const itemCount = useCartStore((state) => state.getItemCount());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isLandingPage = location.pathname === '/';

  if (isLandingPage) {
    return (
      <header className="sticky top-0 left-0 w-full z-40 bg-white border-b border-gray-150 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Left: Simple brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 shrink-0">
            <div className="h-9 w-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-sm shadow-purple-600/10">
              <ShoppingBag size={18} className="stroke-[2.5]" />
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tight text-gray-900">
              shop<span className="text-purple-600">wep</span>
            </span>
          </Link>

          {/* Right: Tizimga kirish or Katalogga o'tish button */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link 
                to="/admin/dashboard" 
                className="text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 px-3.5 py-2 rounded-xl transition-all"
              >
                Admin Panel
              </Link>
            )}
            <button
              onClick={() => navigate(isAuthenticated ? '/store' : '/login')}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm shadow-purple-600/10 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              {isAuthenticated ? "Katalogga o'tish" : "Tizimga kirish"}
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 left-0 w-full z-40 bg-white border-b border-gray-200 transition-colors duration-200">
      {/* Top Banner / Utility Bar (Clean corporate Uzum style) */}
      <div className="bg-gray-100 text-gray-500 text-[11px] py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span>Shahar: <span className="text-gray-900 font-semibold underline cursor-pointer">Toshkent</span></span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-900 font-medium">Topshirish punktlari bepul</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-purple-600 font-medium">Sifatli mahsulotlar va xizmatlar</span>
            <span className="text-gray-300">|</span>
            {isAuthenticated && user?.role === 'ADMIN' && (
              <>
                <Link to="/admin/dashboard" className="text-purple-600 hover:text-purple-700 font-extrabold transition-colors">Admin Panel</Link>
                <span className="text-gray-300">|</span>
              </>
            )}
            <Link to="/profile" className="hover:text-gray-900 transition-colors">Savol-javoblar</Link>
            <Link to="/profile?tab=orders" className="hover:text-gray-900 transition-colors">Buyurtmalarim</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Left: Simple brand Logo */}
        <Link to="/" className="flex items-center space-x-2.5 shrink-0">
          <div className="h-9 w-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-sm shadow-purple-600/10">
            <ShoppingBag size={18} className="stroke-[2.5]" />
          </div>
          <span className="font-display font-extrabold text-2xl tracking-tight text-gray-900">
            shop<span className="text-purple-600">wep</span>
          </span>
        </Link>

        {/* Center: Large, prominent search bar (light gray background) */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl relative">
          <div className="flex items-center w-full rounded-xl bg-gray-100 border border-transparent focus-within:border-purple-600/40 focus-within:bg-white transition-all">
            <input
              type="text"
              placeholder="Mahsulotlarni qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm w-full py-2.5 pl-4 pr-12 text-gray-900 outline-none placeholder:text-gray-400"
            />
            <button 
              type="submit" 
              className="absolute right-1 top-1 bottom-1 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Qidirish"
            >
              <Search size={16} className="stroke-[2.5]" />
            </button>
          </div>
        </form>

        {/* Right: Utility Icons for Profil, Buyurtmalar, and Savat */}
        <div className="flex items-center space-x-1 sm:space-x-4 shrink-0">
          
          {/* Admin link if user is ADMIN */}
          {isAuthenticated && user?.role === 'ADMIN' && (
            <Link
              to="/admin/dashboard"
              className="flex flex-col items-center justify-center p-1.5 rounded-xl text-purple-600 hover:text-purple-700 hover:bg-purple-50/50 transition-all cursor-pointer group"
            >
              <Shield size={20} className="stroke-[2] text-purple-600 group-hover:text-purple-700 transition-colors animate-pulse" />
              <span className="text-[10px] font-extrabold mt-1 hidden sm:block">Admin Panel</span>
            </Link>
          )}

          {/* Profile link */}
          <Link
            to="/profile"
            className="flex flex-col items-center justify-center p-1.5 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-purple-50/50 transition-all cursor-pointer group"
          >
            <User size={20} className="stroke-[2] text-gray-500 group-hover:text-purple-600 transition-colors" />
            <span className="text-[10px] font-semibold mt-1 hidden sm:block">Profil</span>
          </Link>

          {/* Orders Link */}
          <Link
            to="/profile?tab=orders"
            className="flex flex-col items-center justify-center p-1.5 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-purple-50/50 transition-all cursor-pointer group"
          >
            <ClipboardList size={20} className="stroke-[2] text-gray-500 group-hover:text-purple-600 transition-colors" />
            <span className="text-[10px] font-semibold mt-1 hidden sm:block">Buyurtmalar</span>
          </Link>

          {/* Cart Icon */}
          <button
            onClick={() => navigate('/cart')}
            className="relative flex flex-col items-center justify-center p-1.5 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-purple-50/50 transition-all cursor-pointer group"
            aria-label="Savat"
          >
            <div className="relative">
              <ShoppingCart size={20} className="stroke-[2] text-gray-500 group-hover:text-purple-600 transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 h-4 min-w-[16px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold mt-1 hidden sm:block">Savat</span>
          </button>

        </div>
      </div>
    </header>
  );
}
