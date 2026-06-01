import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Heart, Sparkles, ShoppingBag, ArrowLeft, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../stores/cartStore';
import { ProductCard } from '../components/ui/ProductCard';
import { apiClient } from '../services/apiClient';
import { mapBackendProductToFrontend, useProductStore } from '../stores/useProductStore';
import type { Product } from '../types';

interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    user: 'Diyorbek Karimov',
    rating: 5,
    date: '2026-05-18',
    comment: 'Mahsulot juda sifatli ekan. Hamma funksiyalari to\'liq ishlayapti. Tavsiya qilaman!'
  },
  {
    id: 'rev-2',
    user: 'Madina Umarova',
    rating: 4,
    date: '2026-05-22',
    comment: 'Yaxshi qurilma, yig\'ilishi baquvvat. Rangi juda chiroyli va qulay joylashadi. Narxi ham bozorga nisbatan arzonroq ekan. Rahmat!'
  }
];

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  // States
  const [product, setProduct] = useState<Product | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');
  const [liked, setLiked] = useState<boolean>(false);
  
  // Review inputs
  const [reviewUser, setReviewUser] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewsList, setReviewsList] = useState<Review[]>(MOCK_REVIEWS);

  // Zustand store to fetch the catalog (for related products lookup)
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fetch specific product by UUID on mount/id change
  useEffect(() => {
    if (!id) return;
    
    setLoadingDetail(true);
    apiClient.get(`/products/${id}`)
      .then((res) => {
        const mapped = mapBackendProductToFrontend(res.data);
        setProduct(mapped);
        setLoadingDetail(false);
      })
      .catch((err) => {
        console.error('Error fetching product detail:', err);
        setProduct(null);
        setLoadingDetail(false);
      });
  }, [id]);

  // Scroll to top and set default selectors on load
  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      } else {
        setSelectedColor('Standard');
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      } else {
        setSelectedSize('Standard');
      }
      setQuantity(1);
    }
  }, [product]);

  if (loadingDetail) {
    return (
      <div className="flex-grow flex items-center justify-center p-8 bg-[#f2f4f7] animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-8 text-left">
          <div className="h-4 w-28 bg-slate-200 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="aspect-square bg-slate-200 rounded-2xl w-full" />
            <div className="bg-white border border-gray-100 rounded-2xl p-8 space-y-6">
              <div className="h-3 bg-slate-200 rounded w-1/4" />
              <div className="h-8 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-16 bg-slate-200 rounded w-full" />
              <div className="h-10 bg-slate-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-grow flex items-center justify-center p-8 bg-[#f2f4f7]">
        <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center max-w-md space-y-4 shadow-sm">
          <h2 className="font-display font-extrabold text-2xl text-gray-900">
            Mahsulot topilmadi
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Siz qidirgan mahsulot tizimda mavjud emas yoki sotuvdan olingan bo'lishi mumkin.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-colors cursor-pointer inline-block"
          >
            Katalogga qaytish
          </button>
        </div>
      </div>
    );
  }

  const relatedProducts = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  const originalPrice = product.discountPercent
    ? Math.round(product.price / (1 - product.discountPercent / 100))
    : null;

  // Installment calculations
  const monthlyInstallment = Math.round(product.price / 12);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewUser.trim() || !reviewComment.trim()) return;
    
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      user: reviewUser,
      rating: reviewRating,
      date: new Date().toISOString().split('T')[0],
      comment: reviewComment
    };
    
    setReviewsList([newRev, ...reviewsList]);
    setReviewUser('');
    setReviewComment('');
    setReviewRating(5);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 pb-24 md:pb-12 text-left bg-[#f2f4f7]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center space-x-2 text-xs font-bold text-gray-400 hover:text-purple-600 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft size={14} className="stroke-[2.5]" />
          <span>Katalogga qaytish</span>
        </button>

        {/* Main Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Left Column - Product Image */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-square max-h-[500px] relative shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setLiked(!liked)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 backdrop-blur-md border border-gray-100 text-gray-700 hover:text-red-500 transition-colors shadow-md cursor-pointer z-10 hover:scale-105 active:scale-95"
              >
                <Heart size={16} className={liked ? 'fill-red-500 text-red-500' : ''} />
              </button>
            </div>
            
            <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center space-x-3 text-xs text-gray-500 shadow-sm font-medium">
              <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
              <span>Rasmiy kafolatlangan va sertifikatlangan original brend mahsuloti.</span>
            </div>
          </div>

          {/* Right Column - Configurations */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 flex flex-col space-y-6 shadow-sm">
            
            {/* Meta */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-widest text-purple-600 uppercase">
                {product.category}
              </span>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-amber-400">
                  <Star size={14} fill="currentColor" className="stroke-amber-400" />
                  <span className="text-xs font-bold text-gray-800">{product.rating.rate}</span>
                </div>
                <span className="text-xs text-gray-400 font-medium">({reviewsList.length} ta xaridor fikrlari)</span>
              </div>
            </div>

            {/* Price & Installment Clones */}
            <div className="border-y border-gray-100 py-4 space-y-3">
              <div className="flex items-baseline space-x-2.5">
                <span className="text-3xl font-display font-extrabold text-gray-900">
                  {product.price.toLocaleString('uz-UZ')} so'm
                </span>
                {originalPrice && (
                  <span className="text-xs font-semibold text-gray-400 line-through">
                    {originalPrice.toLocaleString('uz-UZ')} so'm
                  </span>
                )}
              </div>
              <div className="inline-flex items-center bg-yellow-50 text-[11px] text-yellow-800 font-bold px-3 py-1.5 rounded-lg border border-yellow-150">
                Muddatli to'lov: {monthlyInstallment.toLocaleString('uz-UZ')} so'm / oyiga
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans font-medium">
              {product.description}
            </p>

            {/* Option Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Color choices */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2.5 text-left">
                  <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    Rangini tanlang
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => {
                      const isSelected = selectedColor === color;
                      return (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`text-xs px-3.5 py-2 rounded-xl border font-semibold cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-purple-600 text-purple-700 bg-purple-50'
                              : 'border-gray-200 text-gray-500 hover:border-purple-600 hover:text-purple-600'
                          }`}
                        >
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size choices */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2.5 text-left">
                  <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    O'lchamini tanlang
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`text-xs px-3.5 py-2 rounded-xl border font-semibold cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-purple-600 text-purple-700 bg-purple-50'
                              : 'border-gray-200 text-gray-500 hover:border-purple-600 hover:text-purple-600'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity and CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-gray-100">
              
              {/* Quantity Select */}
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 shrink-0 w-full sm:w-auto justify-between">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-white transition-all font-extrabold cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-gray-800 select-none">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-white transition-all font-extrabold cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add Button */}
              <button
                onClick={() => {
                  addItem(product, quantity, selectedColor, selectedSize);
                }}
                disabled={product.inventory <= 0}
                className="w-full py-3.5 px-6 rounded-2xl bg-purple-600 text-white font-display font-semibold hover:bg-purple-700 transition-all flex items-center justify-center space-x-2 shadow-sm shadow-purple-600/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
              >
                <ShoppingBag size={16} />
                <span>{product.inventory <= 0 ? 'Sotuvda mavjud emas' : 'Savatga qo\'shish'}</span>
              </button>

            </div>

          </div>

        </div>

        {/* Tabbed Specs / Reviews */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex border-b border-gray-200 space-x-8 mb-6">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-xs font-bold tracking-widest uppercase cursor-pointer transition-colors relative ${
                activeTab === 'specs' ? 'text-purple-600' : 'text-gray-400 hover:text-purple-600'
              }`}
            >
              Tavsif va xarakteristikalar
              {activeTab === 'specs' && (
                <motion.div layoutId="detailActiveTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-xs font-bold tracking-widest uppercase cursor-pointer transition-colors relative ${
                activeTab === 'reviews' ? 'text-purple-600' : 'text-gray-400 hover:text-purple-600'
              }`}
            >
              Mijozlar sharhlari ({reviewsList.length})
              {activeTab === 'reviews' && (
                <motion.div layoutId="detailActiveTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
              )}
            </button>
          </div>

          <div className="min-h-[200px] text-left">
            {activeTab === 'specs' ? (
              /* Spec Sheet */
              <div className="max-w-2xl bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-xs font-sans border-collapse">
                  <tbody>
                    {Object.entries(product.specs).map(([key, val], idx) => (
                      <tr key={key} className={idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-transparent'}>
                        <td className="py-3.5 px-5 font-bold text-[10px] tracking-wider text-gray-400 uppercase w-1/3 border-b border-gray-100">
                          {key}
                        </td>
                        <td className="py-3.5 px-5 text-gray-800 font-semibold border-b border-gray-100">
                          {val}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="py-3.5 px-5 font-bold text-[10px] tracking-wider text-gray-400 uppercase border-b border-gray-100">
                        Holati
                      </td>
                      <td className="py-3.5 px-5 text-emerald-600 font-bold border-b border-gray-100">
                        YANGI // ORIGINAL
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              /* Client logs / Reviews */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-4">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-7 w-7 rounded-lg bg-purple-50 flex items-center justify-center text-[10px] font-bold text-purple-600 uppercase border border-purple-100">
                            {rev.user.substring(0, 2)}
                          </div>
                          <span className="text-xs font-bold text-gray-850">{rev.user}</span>
                        </div>
                        <span className="text-[10px] font-semibold text-gray-400">{rev.date}</span>
                      </div>
                      
                      <div className="flex space-x-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} fill={i < rev.rating ? 'currentColor' : 'transparent'} className="stroke-amber-400" />
                        ))}
                      </div>
                      
                      <p className="text-xs text-gray-500 leading-relaxed font-sans font-medium">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Add review form */}
                <div className="lg:col-span-1">
                  <div className="bg-white border border-gray-150 rounded-2xl p-6 space-y-4 shadow-sm">
                    <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                      <Sparkles size={14} className="text-purple-600 animate-pulse" />
                      <h3 className="font-display font-bold text-xs tracking-wider text-gray-800 uppercase">
                        Sharh yozish
                      </h3>
                    </div>
                    
                    <form onSubmit={handleAddReview} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold tracking-wider text-gray-400 uppercase">
                          Ismingiz
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewUser}
                          onChange={(e) => setReviewUser(e.target.value)}
                          placeholder="Masalan: Anvar Karimov"
                          className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-purple-600 text-gray-900 placeholder:text-gray-400"
                        />
                      </div>

                      <div className="space-y-1.5 font-medium">
                        <label className="text-[9px] font-bold tracking-wider text-gray-400 uppercase block">
                          Baho bering
                        </label>
                        <div className="flex space-x-1.5">
                          {[1, 2, 3, 4, 5].map((stars) => (
                            <button
                              key={stars}
                              type="button"
                              onClick={() => setReviewRating(stars)}
                              className={`p-1 transition-colors cursor-pointer ${
                                stars <= reviewRating ? 'text-amber-400' : 'text-gray-300'
                              }`}
                            >
                              <Star size={16} fill={stars <= reviewRating ? 'currentColor' : 'transparent'} className={stars <= reviewRating ? 'stroke-amber-400' : 'stroke-gray-300'} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5 font-medium">
                        <label className="text-[9px] font-bold tracking-wider text-gray-400 uppercase">
                          Sharhingiz
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Fikringizni qoldiring..."
                          className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-purple-600 text-gray-900 placeholder:text-gray-400 font-sans resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-purple-600 text-white text-[10px] font-bold tracking-wider uppercase hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm shadow-purple-600/10"
                      >
                        <Send size={12} />
                        <span>Sharhni yuborish</span>
                      </button>
                    </form>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-8">
            <h2 className="font-display font-extrabold text-xl text-gray-900 tracking-tight mb-6">
              O'xshash mahsulotlar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <div key={p.id} className="h-full">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
}
