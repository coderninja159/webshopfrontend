import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Globe, MessageSquare, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 transition-colors duration-200 mt-auto hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 text-left">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center text-white">
                <ShoppingBag size={16} />
              </div>
              <span className="font-display font-extrabold text-lg tracking-tight text-gray-900">
                shop<span className="text-purple-600">wep</span>
              </span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed font-sans">
              O'zbekistondagi eng premium sport do'koni. Yuqori sifatli krossovkalar, trenajyorlar, sport kiyimlari va sport ozuqalarini shourumimizdan xarid qilishingiz yoki uyingizga bepul yetkazib berish xizmatidan foydalanishingiz mumkin.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="h-8 w-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-purple-600 hover:border-purple-600 transition-colors" aria-label="Website Link">
                <Globe size={14} />
              </a>
              <a href="#" className="h-8 w-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-purple-600 hover:border-purple-600 transition-colors" aria-label="Support Link">
                <MessageSquare size={14} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="text-left">
            <h3 className="font-display font-bold text-sm text-gray-900 tracking-wider uppercase mb-4">
              Kategoriyalar
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/products?category=Smartphones" className="text-xs text-gray-500 hover:text-purple-600 transition-colors font-medium">
                  Krossovkalar
                </Link>
              </li>
              <li>
                <Link to="/products?category=Laptops" className="text-xs text-gray-500 hover:text-purple-600 transition-colors font-medium">
                  Trenajyorlar
                </Link>
              </li>
              <li>
                <Link to="/products?category=Audio" className="text-xs text-gray-500 hover:text-purple-600 transition-colors font-medium">
                  Sport ozuqalari
                </Link>
              </li>
              <li>
                <Link to="/products?category=Wearables" className="text-xs text-gray-500 hover:text-purple-600 transition-colors font-medium">
                  Sport kiyimlari
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer service links */}
          <div className="text-left">
            <h3 className="font-display font-bold text-sm text-gray-900 tracking-wider uppercase mb-4">
              Mijozlar uchun
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-xs text-gray-500 hover:text-purple-600 transition-colors font-medium">
                  Yordam va FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-xs text-gray-500 hover:text-purple-600 transition-colors font-medium">
                  Qoidalar va Shartlar
                </a>
              </li>
              <li>
                <a href="#" className="text-xs text-gray-500 hover:text-purple-600 transition-colors font-medium">
                  Maxfiylik Siyosati
                </a>
              </li>
              <li>
                <a href="#" className="text-xs text-gray-500 hover:text-purple-600 transition-colors font-medium">
                  Yetkazib berish va To'lov
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4 text-left">
            <h3 className="font-display font-bold text-sm text-gray-900 tracking-wider uppercase mb-4">
              Yangiliklar xabarnomasi
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed font-sans">
              Mavsumiy chegirmalar, yangi mahsulotlar va maxsus takliflardan birinchilardan bo'lib xabardor bo'ling.
            </p>
            <form className="flex space-x-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email manzilingiz..."
                className="bg-gray-50 border border-gray-200 text-xs rounded-xl px-3.5 py-2 w-full outline-none focus:border-purple-600 text-gray-900 placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="h-9 w-9 shrink-0 bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center justify-center cursor-pointer shadow-sm shadow-purple-600/10 transition-colors"
              >
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom line */}
        <div className="border-t border-gray-200 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-gray-400 font-sans tracking-wide">
            &copy; 2026 shopwep Bozor. Barcha huquqlar himoyalangan. Toshkent, O'zbekiston.
          </p>
          <div className="flex items-center space-x-4 text-[10px] text-gray-400 font-sans font-medium">
            <span className="flex items-center space-x-1">
              <ShieldCheck size={12} className="text-emerald-500" />
              <span>Click &amp; Payme Integratsiyasi</span>
            </span>
            <span>XAVFSIZ TO'LOV KAFOLATI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
