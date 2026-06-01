import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid, List, Star, ShoppingCart, Loader2 } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../stores/cartStore';
import { ProductCard } from '../components/ui/ProductCard';
import { useProductStore } from '../stores/useProductStore';
import { useCategoryStore } from '../stores/useCategoryStore';

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  // Zustand Stores
  const { products, isLoading: storeLoading, fetchProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  // States
  const [localLoading, setLocalLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('default');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(20000000); // Max 20M so'm
  const [searchVal, setSearchVal] = useState<string>('');

  const loading = storeLoading || localLoading;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Extract from URL query params
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  // Trigger loader mock on filter changes
  useEffect(() => {
    setLocalLoading(true);
    const timer = setTimeout(() => {
      setLocalLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [selectedCategory, sortBy, priceRange, searchParam]);

  // Sync state with url query parameters
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('All');
    }
  }, [categoryParam]);

  useEffect(() => {
    if (searchParam) {
      setSearchVal(searchParam);
    } else {
      setSearchVal('');
    }
  }, [searchParam]);

  // Dynamic Uzum style categories mapping from database
  const CATEGORIES_MAP = [
    { id: 'All', name: 'Barchasi' },
    ...categories.map(c => ({
      id: c.name,
      name: c.name === 'Smartphones' ? 'Smartfonlar' : c.name === 'Laptops' ? 'Noutbuklar' : c.name === 'Audio' ? 'Audio va Quloqchinlar' : c.name === 'Accessories' ? 'Aksessuarlar' : c.name
    }))
  ];

  // Handle queries
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchVal.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchVal.toLowerCase());
    const matchesPrice = product.price <= priceRange;
    return matchesCategory && matchesSearch && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating.rate - a.rating.rate;
    return 0; // default
  });

  const handleCategoryClick = (catId: string) => {
    if (catId === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      searchParams.set('search', searchVal);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  // Skeleton loading helper
  const SkeletonCard = () => (
    <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-4 animate-pulse">
      <div className="h-44 bg-gray-100 rounded-lg w-full" />
      <div className="space-y-2">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-5 bg-gray-100 rounded w-2/3" />
        <div className="h-3 bg-gray-100 rounded w-full" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="h-6 bg-gray-100 rounded w-1/4" />
        <div className="h-8 bg-gray-100 rounded-full w-8" />
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 pb-24 md:pb-12 bg-[#f2f4f7]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header / Breadcrumb */}
        <div className="text-left mb-6 space-y-1">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
            Mahsulotlar Katalogi
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            Kafolatlangan va original texnikalar to'plami.
          </p>
        </div>

        {/* Filters and List block */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Side Control Console */}
          <div className="lg:col-span-1 space-y-6 text-left shrink-0">
            <div className="bg-white border border-gray-150 rounded-2xl p-5 space-y-6 shadow-sm">
              
              <div className="flex items-center space-x-2 border-b border-gray-100 pb-3.5">
                <SlidersHorizontal size={15} className="text-purple-600" />
                <h2 className="font-display font-bold text-xs tracking-wider text-gray-800 uppercase">
                  Filtrlash
                </h2>
              </div>

              {/* Inline Search */}
              <form onSubmit={handleSearchSubmit} className="space-y-2">
                <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  Qidiruv
                </label>
                <div className="flex items-center rounded-xl bg-gray-50 border border-gray-200 px-3.5 py-2 focus-within:bg-white focus-within:border-purple-600/40 transition-all">
                  <input
                    type="text"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Mahsulot qidirish..."
                    className="bg-transparent text-xs w-full text-gray-900 outline-none placeholder:text-gray-400"
                  />
                  <button type="submit" className="text-gray-400 hover:text-purple-600 transition-colors cursor-pointer">
                    <Search size={14} className="stroke-[2.5]" />
                  </button>
                </div>
              </form>

              {/* Category Filter */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase block">
                  Kategoriyalar
                </label>
                <div className="flex flex-col space-y-1">
                  {CATEGORIES_MAP.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className={`text-left text-xs px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-between font-semibold ${
                          isSelected
                            ? 'bg-purple-50 text-purple-700 font-bold shadow-sm'
                            : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-purple-600'
                        }`}
                      >
                        <span>{cat.name}</span>
                        {isSelected && <span className="h-1.5 w-1.5 bg-purple-600 rounded-full" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price range */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    Maksimal narx
                  </label>
                  <span className="text-xs font-bold text-purple-600 font-sans">
                    {priceRange.toLocaleString('uz-UZ')} so'm
                  </span>
                </div>
                <input
                  type="range"
                  min="1000000"
                  max="20000000"
                  step="500000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-purple-600 bg-gray-150 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-gray-400 font-bold">
                  <span>1 000 000 so'm</span>
                  <span>20 000 000 so'm</span>
                </div>
              </div>

              {/* Clear button */}
              <button
                onClick={() => {
                  searchParams.delete('category');
                  searchParams.delete('search');
                  setSearchParams(searchParams);
                  setPriceRange(20000000);
                  setSortBy('default');
                }}
                className="w-full py-2.5 rounded-xl bg-purple-50 text-[10px] font-bold tracking-wider text-purple-700 uppercase hover:bg-purple-600 hover:text-white transition-all cursor-pointer"
              >
                Filtrlarni tozalash
              </button>

            </div>
          </div>

          {/* Results Block */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Store Bar options */}
            <div className="bg-white border border-gray-150 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                Barcha mahsulotlar // {filteredProducts.length} ta mahsulot topildi
              </span>
              
              <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                {/* Sort Option */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-xs font-semibold rounded-xl px-3.5 py-2 text-gray-700 outline-none focus:border-purple-600/40 cursor-pointer"
                >
                  <option value="default">Saralash</option>
                  <option value="price-asc">Narx: pastdan balandga</option>
                  <option value="price-desc">Narx: balanddan pastga</option>
                  <option value="rating">Reyting bo'yicha</option>
                </select>

                {/* View Toggles */}
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'grid' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-purple-600'
                    }`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'list' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-purple-600'
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white border border-gray-150 rounded-2xl p-16 flex flex-col items-center justify-center space-y-4 shadow-sm text-center">
                <div className="animate-spin text-purple-600">
                  <Loader2 size={32} />
                </div>
                <h3 className="font-display font-extrabold text-lg text-gray-900">
                  Mahsulotlar topilmadi
                </h3>
                <p className="text-xs text-gray-400 max-w-sm font-medium leading-relaxed">
                  Qidiruv so'rovingiz yoki belgilangan narx filtri bo'yicha mos mahsulot topilmadi. Iltimos, filtrlarni o'zgartirib qayta urinib ko'ring.
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              /* Grid Layout Rendering using our new ProductCard! */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <motion.div
                      layout
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              /* List Layout Rendering in Light Corporate Uzbek */
              <div className="flex flex-col space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => {
                    const originalPrice = product.discountPercent
                      ? Math.round(product.price / (1 - product.discountPercent / 100))
                      : null;
                    return (
                      <motion.div
                        layout
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-5 text-left group shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        <div 
                          className="h-32 w-full sm:w-32 shrink-0 overflow-hidden rounded-xl bg-gray-50"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                          />
                        </div>
                        
                        <div className="flex-1 space-y-2.5 w-full">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold tracking-wider text-purple-600 uppercase">
                              {CATEGORIES_MAP.find(c => c.id === product.category)?.name || product.category}
                            </span>
                            <div className="flex items-center space-x-1 text-amber-400">
                              <Star size={11} fill="currentColor" className="stroke-amber-400" />
                              <span className="text-[11px] font-semibold text-gray-700">{product.rating.rate}</span>
                              <span className="text-[10px] text-gray-400">({product.rating.count} sharh)</span>
                            </div>
                          </div>

                          <h3 
                            className="font-display font-bold text-base text-gray-900 group-hover:text-purple-600 transition-colors"
                          >
                            {product.name}
                          </h3>

                          <p className="text-xs text-gray-500 leading-relaxed font-sans line-clamp-2">
                            {product.description}
                          </p>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex flex-col">
                              {originalPrice && (
                                <span className="text-[10px] text-gray-400 line-through leading-none mb-0.5">
                                  {originalPrice.toLocaleString('uz-UZ')} so'm
                                </span>
                              )}
                              <span className="text-base font-bold text-gray-900 leading-none">
                                {product.price.toLocaleString('uz-UZ')} so'm
                              </span>
                            </div>

                            <div className="flex space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/product/${product.id}`);
                                }}
                                className="px-3.5 py-2 text-[10px] font-bold rounded-xl bg-gray-50 border border-gray-200 text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                              >
                                Batafsil
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addItem(product, 1, product.colors?.[0], product.sizes?.[0]);
                                }}
                                className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-all cursor-pointer flex items-center justify-center text-xs font-semibold shadow-sm shadow-purple-600/10"
                              >
                                <ShoppingCart size={13} className="mr-1.5 stroke-[2.5]" />
                                <span>Savatga qo'shish</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

          </div>

        </div>

      </div>
    </motion.div>
  );
}
