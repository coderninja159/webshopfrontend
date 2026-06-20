import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ShieldCheck, Ticket, RefreshCw, CheckCircle, ArrowRight, MapPin, Phone as PhoneIcon, CreditCard, Wallet, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/useAuthStore';
import { apiClient } from '../services/apiClient';

export function CartPage() {
  const navigate = useNavigate();
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getSubtotal, 
    clearCart 
  } = useCartStore();

  const { isAuthenticated } = useAuthStore();

  // Local States
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'authenticating' | 'routing' | 'success'>('cart');
  const [createdOrderId, setCreatedOrderId] = useState('');

  // Checkout Form states
  const [shippingAddress, setShippingAddress] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState(
    useAuthStore.getState().user?.emailOrPhone || ''
  );
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [checkoutError, setCheckoutError] = useState('');


  // Derived values in UZS/so'm
  const subtotal = getSubtotal();
  const discountAmount = subtotal * (discountPercent / 100);
  const taxedSubtotal = subtotal - discountAmount;
  const tax = 0; // 0% tax for simplified clean corporate calculations
  const shipping = taxedSubtotal >= 1000000 ? 0 : 30000; // Free above 1M so'm, else 30 000 so'm
  const total = taxedSubtotal + tax + shipping;

  const freeShippingThreshold = 1000000; // 1M so'm
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    const formattedCode = promoCode.trim().toUpperCase();
    if (formattedCode === 'NEURAL20') {
      setDiscountPercent(20);
      setPromoSuccess('NEURAL20 promokodi faol! 20% chegirma qo\'llanildi.');
    } else if (formattedCode === 'SHOPWEP10') {
      setDiscountPercent(10);
      setPromoSuccess('SHOPWEP10 promokodi faol! 10% chegirma qo\'llanildi.');
    } else {
      setPromoError('Noto\'g\'ri promokod. Qayta tekshirib ko\'ring.');
    }
  };

  const handleTriggerCheckout = () => {
    if (items.length === 0) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setCheckoutStep('checkout');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError('');

    if (!shippingAddress.trim()) {
      setCheckoutError("Etkazib berish manzilini kiritishingiz shart");
      return;
    }
    if (!deliveryPhone.trim()) {
      setCheckoutError("Telefon raqamingizni kiritishingiz shart");
      return;
    }

    setCheckoutStep('authenticating');
    
    try {
      const orderPayload = {
        shippingAddress: shippingAddress.trim(),
        deliveryPhone: deliveryPhone.trim(),
        paymentMethod,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          selectedColor: item.selectedColor || 'Standard',
          selectedSize: item.selectedSize || 'Standard'
        }))
      };

      const response = await apiClient.post('/orders', orderPayload);
      
      setCheckoutStep('routing');
      
      setTimeout(() => {
        setCreatedOrderId(response.data.id || `SW-${Math.floor(10000 + Math.random() * 90000)}`);
        setCheckoutStep('success');
        
        setTimeout(() => {
          clearCart();
        }, 500);
      }, 1500);

    } catch (err: any) {
      console.error("Failed to place order:", err);
      const errMsg = err.response?.data?.message || err.response?.data?.error || "Buyurtmani rasmiylashtirishda xatolik yuz berdi";
      setCheckoutError(errMsg);
      setCheckoutStep('checkout');
    }
  };


  if (checkoutStep === 'checkout') {
    return (
      <div className="flex-grow flex items-center justify-center p-8 bg-[#f2f4f7]">
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white border border-gray-150 rounded-3xl p-8 sm:p-10 max-w-xl w-full shadow-sm text-left relative overflow-hidden"
        >
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="font-display font-extrabold text-2xl text-gray-900 tracking-tight">
                Buyurtmani rasmiylashtirish
              </h2>
              <p className="text-xs text-gray-500 font-sans font-semibold mt-1">
                Yetkazib berish ma'lumotlarini kiriting
              </p>
            </div>
            <button
              onClick={() => setCheckoutStep('cart')}
              className="text-xs text-purple-600 hover:text-purple-700 font-bold uppercase cursor-pointer"
            >
              Savatga qaytish
            </button>
          </div>

          {checkoutError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-xs font-semibold text-red-650 flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{checkoutError}</span>
            </div>
          )}

          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Etkazib berish manzili
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <textarea
                  required
                  placeholder="Masalan: Toshkent shahri, Chilonzor tumani, 9-kvartal, 12-uy, 45-xonadon"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-sans focus:outline-none focus:border-purple-600 focus:bg-white transition-all resize-none h-24"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Aloqa telefoni
              </label>
              <div className="relative">
                <PhoneIcon className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  placeholder="+998901234567"
                  value={deliveryPhone}
                  onChange={(e) => setDeliveryPhone(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-sans focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-3">
                To'lov usuli
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'CARD'
                      ? 'border-purple-600 bg-purple-50/50 text-purple-600 font-bold'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600 font-semibold'
                  }`}
                >
                  <CreditCard size={18} />
                  <span className="text-sm">Karta orqali</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH')}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'CASH'
                      ? 'border-purple-600 bg-purple-50/50 text-purple-600 font-bold'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600 font-semibold'
                  }`}
                >
                  <Wallet size={18} />
                  <span className="text-sm">Naqd pul</span>
                </button>
              </div>
            </div>

            {/* Order summary info */}
            <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 text-xs font-semibold text-gray-500 space-y-2">
              <div className="flex justify-between">
                <span>Mahsulotlar soni:</span>
                <span className="text-gray-900">{items.reduce((sum, item) => sum + item.quantity, 0)} dona</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-sm">
                <span className="text-gray-900">Jami to'lov:</span>
                <span className="text-purple-600">{total.toLocaleString('uz-UZ')} so'm</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-purple-600 text-white font-display font-semibold hover:bg-purple-700 transition-colors shadow-sm cursor-pointer text-center"
            >
              Buyurtma berish
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (checkoutStep === 'authenticating' || checkoutStep === 'routing') {
    return (
      <div className="flex-grow flex items-center justify-center p-8 bg-[#f2f4f7]">
        <div className="bg-white border border-gray-150 rounded-3xl p-12 text-center max-w-sm space-y-6 shadow-sm relative overflow-hidden">
          <div className="relative flex justify-center">
            <RefreshCw size={40} className="text-purple-600 animate-spin" />
          </div>

          <div className="space-y-2 relative">
            <h2 className="font-display font-extrabold text-lg text-gray-900 tracking-tight">
              {checkoutStep === 'authenticating' ? 'Buyurtma tekshirilmoqda' : 'Buyurtma rasmiylashtirilmoqda'}
            </h2>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed font-sans">
              {checkoutStep === 'authenticating' 
                ? 'Tizim ma\'lumotlari tahlil qilinmoqda va to\'lov holati tekshirilmoqda...'
                : 'Buyurtma kurerlik xizmati tizimiga yo\'naltirilmoqda...'}
            </p>
          </div>

          <div className="w-full bg-gray-100 border border-gray-200 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.6, ease: 'easeInOut' }}
              className="h-full bg-purple-600"
            />
          </div>
        </div>
      </div>
    );
  }

  if (checkoutStep === 'success') {
    return (
      <div className="flex-grow flex items-center justify-center p-8 bg-[#f2f4f7]">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white border border-gray-150 rounded-3xl p-10 text-center max-w-md space-y-6 shadow-sm relative overflow-hidden"
        >
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-500">
              <CheckCircle size={32} className="stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-widest text-emerald-600 uppercase">
              MUVAFFAQIYATLI RASMIYLASHTIRILDI
            </span>
            <h2 className="font-display font-extrabold text-2xl text-gray-900 tracking-tight leading-tight">
              Buyurtmangiz qabul qilindi!
            </h2>
            <p className="text-xs text-gray-500 font-sans font-semibold max-w-sm leading-relaxed">
              Buyurtma muvaffaqiyatli rasmiylashtirildi. 1 kun ichida belgilangan manzilga tezkor va bepul yetkazib beriladi.
            </p>
          </div>

          {/* Invoice box */}
          <div className="bg-gray-50 border border-gray-150 rounded-2xl p-5 text-left font-sans text-xs space-y-3 text-gray-500 shadow-inner">
            <div className="flex justify-between text-gray-800 font-bold border-b border-gray-200 pb-2">
              <span>BUYURTMA RAQAMI:</span>
              <span className="text-purple-600">{createdOrderId}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>HOLATI:</span>
              <span className="text-emerald-600 font-bold">YETKAZIB BERISHDA</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>TO'LOV SUMMASI:</span>
              <span className="text-gray-950 font-extrabold">{total.toLocaleString('uz-UZ')} so'm</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>ETKAZIB BERISH MANZILI:</span>
              <span className="text-gray-950 font-bold truncate max-w-[180px]">{shippingAddress}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 rounded-xl bg-purple-600 text-white font-display font-semibold hover:bg-purple-700 transition-colors shadow-sm cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>Buyurtmalarim bo'limiga o'tish</span>
              <ArrowRight size={14} className="stroke-[2.5]" />
            </button>
            <button
              onClick={() => navigate('/products')}
              className="w-full py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 hover:text-purple-600 transition-colors text-xs font-bold uppercase cursor-pointer"
            >
              Katalogga qaytish
            </button>
          </div>

        </motion.div>
      </div>
    );
  }


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-grow pb-24 md:pb-12 text-left bg-[#f2f4f7]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Banner */}
        <div className="border-b border-gray-200 pb-5 mb-6">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
            Xarid Savati
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            Tanlangan mahsulotlarni rasmiylashtiring.
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white border border-gray-150 rounded-2xl p-16 text-center max-w-md mx-auto space-y-5 shadow-sm">
            <div className="flex justify-center">
              <div className="h-14 w-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                <ShoppingBag size={24} className="stroke-[2.5]" />
              </div>
            </div>
            <h2 className="font-display font-extrabold text-xl text-gray-900">
              Savat hozircha bo'sh
            </h2>
            <p className="text-xs text-gray-400 font-semibold leading-relaxed">
              Savatingizga hali birorta mahsulot qo'shmadingiz. Katalog bo'limiga o'ting va ajoyib takliflarni ko'ring.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-all cursor-pointer inline-block"
            >
              Xarid qilishga o'tish
            </button>
          </div>
        ) : (
          /* Cart Listing */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left: Items list */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Free shipping banner */}
              <div className="bg-white border border-gray-150 rounded-2xl p-5 space-y-3 shadow-sm">
                <div className="flex justify-between items-center text-xs font-bold text-gray-800">
                  <span>Yetkazib berish holati</span>
                  <span className="font-sans text-purple-600 font-extrabold">
                    {remainingForFreeShipping > 0 
                      ? `Yana ${remainingForFreeShipping.toLocaleString('uz-UZ')} so'm xarid qilsangiz, bepul yetkaziladi`
                      : 'Bepul yetkazib berish faol!'
                    }
                  </span>
                </div>
                
                <div className="w-full bg-gray-100 border border-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-600 transition-all duration-500" 
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      layout
                      key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-5 shadow-sm"
                    >
                      {/* Image */}
                      <div className="h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Detail */}
                      <div className="flex-grow space-y-1.5 text-center sm:text-left">
                        <h3 className="font-display font-bold text-[13.5px] text-gray-900 line-clamp-1 leading-snug">
                          {item.product.name}
                        </h3>
                        
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-[10px] text-gray-400 font-bold">
                          {item.selectedColor && (
                            <span className="bg-gray-50 border border-gray-200 px-2.5 py-0.5 rounded-md">
                              RANGI: {item.selectedColor}
                            </span>
                          )}
                          {item.selectedSize && (
                            <span className="bg-gray-50 border border-gray-200 px-2.5 py-0.5 rounded-md">
                              O'LCHAMI: {item.selectedSize}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price Matrix */}
                      <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                        {/* Quantity Counter */}
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-0.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                            className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-white text-gray-400 hover:text-purple-600 font-extrabold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-3 text-xs font-bold text-gray-800 select-none">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                            className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-white text-gray-400 hover:text-purple-600 font-extrabold cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Total price for item */}
                        <span className="text-sm font-display font-extrabold text-gray-900 w-24 text-right">
                          {(item.product.price * item.quantity).toLocaleString('uz-UZ')} so'm
                        </span>

                        {/* Delete button */}
                        <button
                          onClick={() => removeItem(item.product.id, item.selectedColor, item.selectedSize)}
                          className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

            </div>

            {/* Right: Checkout summaries */}
            <div className="space-y-6">
              
              {/* Promo application */}
              <div className="bg-white border border-gray-150 rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                  <Ticket size={14} className="text-purple-600" />
                  <h3 className="font-display font-bold text-xs tracking-wider text-gray-800 uppercase">
                    Promokod kiritish
                  </h3>
                </div>

                <form onSubmit={handleApplyPromo} className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Masalan: SHOPWEP10"
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-purple-600 text-gray-900 placeholder:text-gray-400 font-bold"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Kiritish
                  </button>
                </form>

                {promoError && (
                  <p className="text-[10px] text-red-500 font-semibold">{promoError}</p>
                )}
                {promoSuccess && (
                  <p className="text-[10px] text-emerald-600 font-semibold">{promoSuccess}</p>
                )}
                
                <div className="bg-gray-50 border border-gray-150 rounded-xl p-3 text-[10px] font-semibold text-gray-500 leading-relaxed">
                  <span className="text-purple-600 font-extrabold">MASLAHAT:</span> 10% chegirma olish uchun <span className="text-purple-700 font-bold bg-purple-50 px-1 rounded">SHOPWEP10</span> kodidan foydalaning.
                </div>
              </div>

              {/* Price Calculation Sheets */}
              <div className="bg-white border border-gray-150 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                  <ShieldCheck size={14} className="text-purple-600" />
                  <h3 className="font-display font-bold text-xs tracking-wider text-gray-800 uppercase">
                    Xarid tafsilotlari
                  </h3>
                </div>

                <div className="space-y-3 font-sans text-xs font-semibold text-gray-500">
                  <div className="flex justify-between">
                    <span>Mahsulotlar summasi</span>
                    <span className="text-gray-850">{subtotal.toLocaleString('uz-UZ')} so'm</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Kupon chegirmasi ({discountPercent}%)</span>
                      <span>-{discountAmount.toLocaleString('uz-UZ')} so'm</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>QQS (0%)</span>
                    <span className="text-gray-800 font-bold">0 so'm</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Yetkazib berish</span>
                    <span className="text-gray-850 font-bold">
                      {shipping === 0 ? 'BEPUL' : `${shipping.toLocaleString('uz-UZ')} so'm`}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex justify-between text-gray-900 font-extrabold">
                    <span className="text-xs uppercase tracking-wider">Jami to'lov</span>
                    <span className="text-lg font-extrabold text-purple-700 leading-none">{total.toLocaleString('uz-UZ')} so'm</span>
                  </div>
                </div>

                <button
                  onClick={handleTriggerCheckout}
                  className="w-full py-3.5 rounded-2xl bg-purple-600 text-white font-display font-bold hover:bg-purple-700 transition-all flex items-center justify-center space-x-2 shadow-sm shadow-purple-600/10 cursor-pointer mt-4"
                >
                  <ShieldCheck size={16} />
                  <span>Rasmiylashtirishga o'tish</span>
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </motion.div>
  );
}
