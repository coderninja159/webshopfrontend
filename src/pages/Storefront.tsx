import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ArrowRight, Zap, Sparkles, Compass } from 'lucide-react';

import { Hero3D } from '../components/3d/Hero3D';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/ui/ProductCard';
import { useAuthStore } from '../stores/useAuthStore';
import { useProductStore } from '../stores/useProductStore';
import { useCategoryStore } from '../stores/useCategoryStore';

export function Storefront() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { products, isLoading: loading, fetchProducts } = useProductStore();
  const { categories: fetchedCategories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 3);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.05 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 15, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 18 } },
  };

  // Uzum style category maps mapped dynamically from database
  const categories = fetchedCategories.map((c) => ({
    id: c.name,
    name: c.name === 'Smartphones' ? 'Smartfonlar' : c.name === 'Laptops' ? 'Noutbuklar' : c.name === 'Audio' ? 'Audio va Quloqchinlar' : c.name === 'Accessories' ? 'Aksessuarlar' : c.name,
    icon: c.slug === 'smartphones' ? '📱' : c.slug === 'laptops' ? '💻' : c.slug === 'audio' ? '🎧' : '📦'
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 pb-24 md:pb-12 bg-[#f2f4f7] transition-colors duration-200 text-left"
    >
      {/* Welcome & Promo Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Block - Personal Welcome and Action buttons */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6 text-left"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-purple-50 border border-purple-100 rounded-full px-4 py-1.5">
              <Sparkles size={13} className="text-purple-600 animate-spin" />
              <span className="text-[10px] tracking-widest text-purple-600 uppercase font-bold">
                Xush kelibsiz, {user?.full_name || 'Mijoz'}!
              </span>
            </motion.div>

            <motion.h1 
              variants={itemVariants} 
              className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[52px] tracking-tight text-gray-900 leading-[1.15]"
            >
              Premium Onlayn <br />
              <span className="text-purple-600">
                Katalogimizga Kirish
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xs sm:text-sm text-gray-500 max-w-lg leading-relaxed font-sans font-medium">
              Siz muvaffaqiyatli ro'yxatdan o'tdingiz. Endi barcha premium original sport jihozlari, krossovkalar va smart fonlarni to'liq kafolat hamda maxsus narxlar bilan xarid qilishingiz mumkin.
            </motion.p>

            {/* Premium Category Quick Links */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2.5 pt-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/products?category=${cat.id}`)}
                  className="px-4 py-2 bg-white border border-gray-150 rounded-xl hover:border-purple-600 hover:text-purple-600 text-xs font-bold text-gray-600 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-2">
              <Button size="lg" onClick={() => navigate('/products')} className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-3 px-6 shadow-sm shadow-purple-600/10 transition-colors">
                <Compass size={16} className="stroke-[2.5]" />
                <span>Barcha Mahsulotlarni Ko'rish</span>
                <ArrowRight size={16} />
              </Button>
            </motion.div>

            <div className="pt-4 border-t border-gray-200" />
          </motion.div>

          {/* Right Block - Premium 3D Display Card */}
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full relative animate-pulse"
            style={{ animationDuration: '3s' }}
          >
            <Hero3D defaultTitle="Onlayn Katalog" />
          </motion.div>

        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-white border-y border-gray-200 py-14 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 text-left">
            <div>
              <div className="flex items-center gap-1.5 text-purple-600 font-bold text-xs uppercase tracking-wider mb-2">
                <Zap size={13} fill="currentColor" />
                <span>Sizga tavsiya etiladi</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
                Saralangan Premium Mahsulotlar
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-2 font-medium">
                Sizning didingizga mos, sifatli, tezkor yetkazib berish sharti bilan taqdim etiladigan eng yangi buyumlar.
              </p>
            </div>
            <Link to="/products" className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center space-x-1 shrink-0 mt-4 sm:mt-0">
              <span>Barcha mahsulotlar</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white border border-gray-100 rounded-2xl p-4 space-y-4 animate-pulse">
                  <div className="h-48 bg-slate-100 rounded-xl w-full" />
                  <div className="space-y-3">
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                    <div className="h-5 bg-slate-100 rounded w-3/4" />
                    <div className="h-4 bg-slate-100 rounded-full w-1/2" />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="h-6 bg-slate-100 rounded w-1/4" />
                    <div className="h-8 bg-slate-100 rounded-full w-8" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="py-16 text-center text-gray-400 font-bold text-xs border border-gray-150 rounded-2xl bg-gray-50/50">
              Hozircha mahsulotlar yo'q
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

    </motion.div>
  );
}
