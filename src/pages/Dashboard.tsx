import { useState, useEffect } from 'react';
import { Heart, Navigation, Box, RefreshCw, ShoppingCart, Power } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { INITIAL_USER_PROFILE } from '../utils/dummyData';
import type { Order } from '../types';

import { useCartStore } from '../stores/cartStore';
import { useProductStore } from '../stores/useProductStore';

export function Dashboard() {
  const addItem = useCartStore((state) => state.addItem);
  const [profile, setProfile] = useState(INITIAL_USER_PROFILE);
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist'>('orders');
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [dronePingState, setDronePingState] = useState<string>('calibrating');

  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const wishlistProducts = products.filter((p) => profile.wishlist.includes(p.id));

  const handleRemoveWishlist = (productId: string) => {
    setProfile({
      ...profile,
      wishlist: profile.wishlist.filter((id) => id !== productId),
    });
  };

  const handleTrackDrone = (order: Order) => {
    setActiveTrackingOrder(order);
    setDronePingState('calibrating');
    
    // Simulate real-time GPS connections
    setTimeout(() => {
      setDronePingState('connecting');
    }, 800);

    setTimeout(() => {
      setDronePingState('resolved');
    }, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-grow pb-24 md:pb-12 text-left bg-[#f2f4f7]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* User Card */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 mb-8 relative overflow-hidden shadow-sm">
          
          {/* Avatar */}
          <div className="h-20 w-20 rounded-2xl overflow-hidden bg-gray-50 shrink-0 border-2 border-purple-100">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile specs */}
          <div className="flex-grow text-center md:text-left space-y-1.5 z-10">
            <h1 className="font-display font-extrabold text-2xl text-gray-900 tracking-tight">
              {profile.name}
            </h1>
            <p className="text-xs text-purple-600 font-bold tracking-wide">
              XARIDOR MAQOMI: PREMIUM // ID: 842-XLM
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-[11px] text-gray-400 font-semibold">
              <span>EMAIL MANZIL: {profile.email}</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-emerald-600 font-bold">MIJOZ TIZIMI: FAOLLASHTIRILGAN</span>
            </div>
          </div>

          <div className="shrink-0 flex items-center space-x-2 bg-purple-50 border border-purple-100 rounded-full px-4 py-2 pointer-events-none select-none">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-450 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
            </span>
            <span className="text-[10px] tracking-wider text-purple-700 font-bold">
              TIZIMDA
            </span>
          </div>

        </div>

        {/* Tab triggers */}
        <div className="flex border-b border-gray-200 space-x-8 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs font-bold tracking-widest uppercase cursor-pointer transition-colors relative ${
              activeTab === 'orders' ? 'text-purple-600 font-extrabold' : 'text-gray-400 hover:text-purple-600'
            }`}
          >
            Buyurtmalarim ({profile.orders.length})
            {activeTab === 'orders' && (
              <motion.div layoutId="dashboardActiveTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`pb-3 text-xs font-bold tracking-widest uppercase cursor-pointer transition-colors relative ${
              activeTab === 'wishlist' ? 'text-purple-600 font-extrabold' : 'text-gray-400 hover:text-purple-600'
            }`}
          >
            Saralanganlar ({wishlistProducts.length})
            {activeTab === 'wishlist' && (
              <motion.div layoutId="dashboardActiveTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
            )}
          </button>
        </div>

        {/* Tab panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main content lists */}
          <div className="lg:col-span-2 space-y-4">
            
            {activeTab === 'orders' ? (
              /* Orders listing */
              profile.orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border border-gray-150 shadow-sm">
                  <h3 className="font-display font-extrabold text-lg text-gray-950">Faol buyurtmalar mavjud emas</h3>
                  <p className="text-xs text-gray-400 font-semibold max-w-xs mx-auto mt-2 leading-relaxed">
                    Sizda hali hech qanday buyurtma tarixi mavjud emas. Buyurtmalaringiz shu bo'limda ko'rinadi.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {profile.orders.map((order) => {
                    const statusText = {
                      Processing: 'Kutilmoqda',
                      Shipped: 'Yo\'lda',
                      Delivered: 'Yetkazildi',
                      Cancelled: 'Bekor qilindi',
                    };
                    const statusColors = {
                      Processing: 'bg-yellow-50 border-yellow-200 text-yellow-700',
                      Shipped: 'bg-blue-50 border-blue-200 text-blue-700',
                      Delivered: 'bg-emerald-50 border-emerald-200 text-emerald-700',
                      Cancelled: 'bg-red-50 border-red-200 text-red-700',
                    };
                    
                    return (
                      <div key={order.id} className="bg-white border border-gray-150 rounded-2xl p-5 space-y-4 shadow-sm">
                        {/* Header metadata */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3 font-sans text-xs font-bold text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span>BUYURTMA RAQAMI: <span className="text-purple-600 font-extrabold">{order.id}</span></span>
                            <span className="text-gray-400">SANA: {order.date}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-0.5 rounded-full border text-[9px] font-bold ${statusColors[order.status]}`}>
                              {statusText[order.status].toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Order items lists */}
                        <div className="space-y-2.5">
                          {order.items.map((item) => (
                            <div key={item.product.id} className="flex items-center gap-4 text-xs font-semibold text-gray-800">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="h-10 w-10 object-cover rounded-lg bg-gray-50 border border-gray-100 shrink-0"
                              />
                              <div className="flex-grow min-w-0 text-left">
                                <span className="font-bold text-gray-900 block truncate">{item.product.name}</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase">
                                  SONI: {item.quantity} {item.selectedColor && `// RANGI: ${item.selectedColor}`}
                                </span>
                              </div>
                              <span className="text-gray-900 font-extrabold text-right shrink-0">
                                {(item.product.price * item.quantity).toLocaleString('uz-UZ')} so'm
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order totals & tracking button */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="text-xs font-bold text-gray-500">
                            <span className="mr-1.5">Jami to'lov:</span>
                            <span className="font-extrabold text-purple-700">{order.total.toLocaleString('uz-UZ')} so'm</span>
                          </div>
                          
                          {order.trackingNumber && (
                            <button
                              onClick={() => handleTrackDrone(order)}
                              className="px-3.5 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-[10px] font-bold text-purple-700 hover:bg-purple-600 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5"
                            >
                              <Navigation size={10} className="stroke-[2.5]" />
                              <span>Kuryer xaritasi</span>
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              /* Wishlist panel */
              wishlistProducts.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border border-gray-150 shadow-sm">
                  <h3 className="font-display font-extrabold text-lg text-gray-950">Saralangan mahsulotlar yo'q</h3>
                  <p className="text-xs text-gray-400 font-semibold max-w-xs mx-auto mt-2 leading-relaxed">
                    Sizga ma'qul kelgan mahsulotlarni yurakcha tugmasini bosish orqali bu yerda saqlashingiz mumkin.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistProducts.map((p) => (
                    <div key={p.id} className="bg-white border border-gray-150 rounded-2xl p-4 space-y-3 flex flex-col group relative shadow-sm">
                      
                      {/* Image cover */}
                      <div className="h-32 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Details */}
                      <div className="space-y-1.5 text-left flex-grow">
                        <span className="text-[9px] font-bold tracking-widest text-purple-600 uppercase">
                          {p.category}
                        </span>
                        <h3 className="font-display font-bold text-sm text-gray-900 line-clamp-1">
                          {p.name}
                        </h3>
                        <span className="text-xs font-bold text-gray-950 block">{p.price.toLocaleString('uz-UZ')} so'm</span>
                      </div>

                      {/* CTA operations */}
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-auto">
                        <button
                          onClick={() => addItem(p, 1, p.colors?.[0], p.sizes?.[0])}
                          className="w-full py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-semibold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm shadow-purple-600/10"
                        >
                          <ShoppingCart size={10} />
                          <span>Savatga qo'shish</span>
                        </button>
                        
                        <button
                          onClick={() => handleRemoveWishlist(p.id)}
                          className="p-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all cursor-pointer"
                          aria-label="Remove wishlist"
                        >
                          <Heart size={12} className="fill-red-500 text-red-500" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )
            )}

          </div>

          {/* Right: GPS coordinate tracking widget */}
          <div className="lg:col-span-1 space-y-4">
            
            <div className="bg-white border border-gray-150 rounded-3xl p-6 space-y-5 text-left relative overflow-hidden shadow-sm">
              
              <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                <Navigation size={14} className="text-purple-600 animate-pulse" />
                <h3 className="font-display font-bold text-xs tracking-wider text-gray-800 uppercase">
                  Kuryer Xizmati GPS
                </h3>
              </div>

              {activeTrackingOrder ? (
                /* Dynamic coordination dashboard */
                <div className="space-y-4">
                  <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 font-sans text-[10px] font-bold text-gray-500 space-y-2">
                    <div className="flex justify-between">
                      <span>BUYURTMA ID:</span>
                      <span className="text-purple-600 font-extrabold">{activeTrackingOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>KURYER KODI:</span>
                      <span className="text-gray-800">{activeTrackingOrder.trackingNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>HOLATI:</span>
                      <span className={activeTrackingOrder.status === 'Delivered' ? 'text-emerald-600 font-bold' : 'text-purple-600 font-bold'}>
                        {activeTrackingOrder.status === 'Delivered' ? 'YETKAZIB BERILDI' : 'ETKAZIB BERISHDA'}
                      </span>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {dronePingState === 'calibrating' && (
                      <motion.div
                        key="calib"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-10 text-center space-y-2 text-gray-400 text-xs font-semibold"
                      >
                        <RefreshCw size={18} className="text-purple-600 animate-spin mx-auto mb-2" />
                        <span>KURYER MA'LUMOTLARI YUKLANMOQDA...</span>
                      </motion.div>
                    )}

                    {dronePingState === 'connecting' && (
                      <motion.div
                        key="conn"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-10 text-center space-y-2 text-gray-400 text-xs font-semibold"
                      >
                        <Box size={18} className="text-purple-600 animate-bounce mx-auto mb-2" />
                        <span>KURYERNING GPS KOORDINATALARI...</span>
                      </motion.div>
                    )}

                    {dronePingState === 'resolved' && (
                      <motion.div
                        key="res"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4 animate-fade-in"
                      >
                        {/* Interactive Radar Ring */}
                        <div className="relative h-44 w-full rounded-2xl bg-gray-50 border border-gray-250 flex items-center justify-center overflow-hidden">
                          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(112,0,255,0.04)_10%,transparent_70%)] animate-pulse" />
                          <div className="h-32 w-32 border border-purple-600/10 rounded-full flex items-center justify-center">
                            <div className="h-20 w-20 border border-purple-600/5 rounded-full flex items-center justify-center">
                              <div className="h-8 w-8 border border-purple-600/5 rounded-full flex items-center justify-center">
                                <div className="h-2 w-2 bg-purple-600 rounded-full animate-ping" />
                              </div>
                            </div>
                          </div>
                          
                          {/* Pulsing signal pointer */}
                          <motion.div 
                            animate={{ 
                              x: [10, -30, 40, 10], 
                              y: [-20, 20, -10, -20] 
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                            className="absolute h-3 w-3 bg-purple-600 rounded-full border-2 border-white shadow-md animate-pulse"
                          />

                          <div className="absolute bottom-2 right-2 text-[9px] font-bold text-purple-600">
                            GPS KOORDINATA: 41.311 / 69.240
                          </div>
                        </div>

                        <div className="text-xs font-semibold text-gray-500 leading-relaxed font-sans">
                          {activeTrackingOrder.status === 'Delivered' ? (
                            <span>Kuryer yetkazib berish manziliga muvaffaqiyatli yetib bordi va buyurtmani topshirdi. Xarid uchun rahmat!</span>
                          ) : (
                            <span>Kuryer yo'nalish bo'yicha harakatlanmoqda. Buyurtmangiz 1 kun ichida belgilangan vaqtda yetkaziladi.</span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              ) : (
                /* Static guidance widget */
                <div className="py-12 text-center space-y-3 font-semibold">
                  <div className="h-10 w-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 mx-auto">
                    <Power size={18} />
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold leading-relaxed max-w-[170px] mx-auto uppercase">
                    FAOL BUYURTMANI TANLANG // KURYER JOYLASHUVINI XARITADA KO'RISH UCHUN BUYURTMANI TANLANG.
                  </p>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </motion.div>
  );
}
