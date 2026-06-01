import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  MapPin, 
  Clock, 
  Phone, 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  CheckCircle2,
  ChevronRight,
  Compass,
  Navigation
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const handleCTA = () => {
    if (isAuthenticated) {
      navigate('/store');
    } else {
      navigate('/login');
    }
  };

  // Modern startup style categories with premium details
  const categories = [
    {
      title: 'Professional Krossovkalar',
      desc: 'Yugurish, marafon, fitnes va faol hayot tarzi uchun maxsus ishlab chiqilgan, amortizatsiyali poyabzallar.',
      icon: '👟',
      count: '120+ model'
    },
    {
      title: 'Premium Trenajyorlar',
      desc: 'Uy va professional zallar uchun yuqori chidamlilikdagi yugurish yo\'lakchalari, gantellar va trenajyorlar.',
      icon: '🏋️‍♂️',
      count: '45+ turdagi'
    },
    {
      title: 'Sport Ozuqalari',
      desc: 'Sertifikatlangan, sifatli proteinlar, vitamin komplekslari hamda mashg\'ulot oldi quvvat beruvchi ozuqalar.',
      icon: '🥤',
      count: '80+ mahsulot'
    },
    {
      title: 'Texnologik Kiyimlar',
      desc: 'Havo o\'tkazuvchan, terlashning oldini oluvchi va harakatlarni cheklamaydigan innovatsion matoli kiyimlar.',
      icon: '👕',
      count: '150+ kiyimlar'
    }
  ];

  const trustBadges = [
    {
      title: 'Kafolatlangan Orginal Mahsulot',
      desc: 'Do\'konimizdagi barcha tovarlar jahon standartlariga javob beradi va rasmiy ishlab chiqaruvchi kafolatiga ega.',
      icon: ShieldCheck
    },
    {
      title: 'O\'zbekiston Bo\'ylab Yetkazib Berish',
      desc: 'Buyurtmalarni respublikamizning istalgan nuqtasiga tezkor va xavfsiz transport xizmati orqali yetkazamiz.',
      icon: TrendingUp
    },
    {
      title: 'Ekspert Maslahati va Yordam',
      desc: 'Professional sport maslahatchilarimiz sizning maqsadlaringizga mos jihozlarni bepul saralab berishadi.',
      icon: Award
    }
  ];

  return (
    <div className="flex-grow bg-[#f8fafc] text-slate-800 font-sans selection:bg-purple-100 selection:text-purple-900">
      
      {/* 1. Hero Section - Sleek Premium Tech Startup look */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100 py-24 md:py-32">
        {/* Apple-style background overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold tracking-wide"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping" />
              Toshkent shahridagi Premium Shourumimiz
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.05]"
            >
              Professional Sport <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                Jihozlari va Kiyimlari
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed"
            >
              Biz shunchaki mahsulot sotmaymiz. Biz sizga sog\'lom turmush tarzi, yuqori sifat, original brendlar va uzoq muddatli kafolat taqdim etamiz.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <button
                onClick={handleCTA}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-purple-600/15 cursor-pointer"
              >
                <span>Katalogga o'tish</span>
                <ArrowRight size={16} className="stroke-[2.5]" />
              </button>
              
              <a
                href="#showroom"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-50 text-slate-700 border border-slate-200 font-bold text-sm hover:bg-slate-100 hover:text-slate-900 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Shourum bilan tanishish</span>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Visual Categories Grid - Premium Card Designs */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Do'konimizdagi Asosiy Yo'nalishlar
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Jismoniy do'konimiz shourumida hamda onlayn katalogimizda mavjud premium sport jihozlari
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white border border-gray-100 rounded-3xl p-8 text-left flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer"
              onClick={handleCTA}
            >
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-355">
                  {cat.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-xl text-slate-900 group-hover:text-purple-600 transition-colors tracking-tight">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {cat.desc}
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-50 mt-6 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-purple-650 transition-colors">
                <span>{cat.count}</span>
                <ChevronRight size={15} className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Physical Store Info Section & Map Overhaul */}
      <section id="showroom" className="bg-white border-y border-slate-100 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Block - Physical store copy */}
            <div className="text-left space-y-10">
              <div className="space-y-4">
                <span className="text-xs font-bold tracking-widest text-purple-600 uppercase bg-purple-50 px-4 py-1.5 rounded-full">
                  Fizik Shourum
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Toshkentdagi eng shinam <br />
                  sport shourumiga keling!
                </h2>
                <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
                  Mahsulotlar sifatini shaxsan baholash, kiyib ko\'rish va mashg\'ulot jihozlarini sinab ko\'rish uchun shourumimizga tashrif buyuring. Professional trener va maslahatchilarimiz sizni kutmoqda.
                </p>
              </div>

              {/* Physical details grid with refined rounded shapes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-4">
                  <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <MapPin size={20} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Manzil</h4>
                    <p className="text-xs text-slate-500 mt-1 font-semibold leading-relaxed">
                      Amir Temur ko'chasi, 45-uy. (Yunusobod tumani)
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-4">
                  <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Clock size={20} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Ish vaqti</h4>
                    <p className="text-xs text-slate-500 mt-1 font-semibold leading-relaxed">
                      Har kuni uzluksiz<br />09:00 - 22:00 gacha
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-4">
                  <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Phone size={20} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Telefonlar</h4>
                    <p className="text-xs text-slate-500 mt-1 font-semibold leading-relaxed">
                      +998 (71) 200-45-45<br />+998 (90) 123-45-67
                    </p>
                  </div>
                </div>

              </div>

              {/* Call to action */}
              <div className="pt-2">
                <button
                  onClick={handleCTA}
                  className="px-8 py-3.5 rounded-2xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-purple-600/10"
                >
                  <span>Katalogni onlayn ko'rish</span>
                  <ArrowRight size={15} className="stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Right Block - Premium Map Overlay */}
            <div className="w-full relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-50 p-4">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 relative flex flex-col items-center justify-center p-8 border border-slate-200 bg-cover bg-center">
                {/* Advanced topographical grid layers */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 via-transparent to-purple-50/20" />
                
                {/* Simulated topographical contour lines using transparent styling */}
                <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full border border-slate-200/40 opacity-50 scale-100" />
                <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full border border-slate-200/60 opacity-50" />
                <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full border border-slate-300/60 opacity-50" />
                
                {/* Visual road overlays */}
                <div className="absolute h-1 bg-slate-200/90 w-full top-1/3 left-0 transform -rotate-12" />
                <div className="absolute w-1 bg-slate-200/90 h-full left-2/3 top-0 transform rotate-6" />

                {/* Pulse radar beacon */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <div className="relative flex items-center justify-center h-16 w-16">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-25 animate-ping" />
                    <span className="absolute inline-flex h-10 w-10 rounded-full bg-purple-500 opacity-40 animate-ping" style={{ animationDelay: '0.5s' }} />
                    <div className="relative h-10 w-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-650/30">
                      <Navigation size={18} className="fill-white stroke-none transform rotate-45" />
                    </div>
                  </div>
                  
                  {/* Floating glass card detailing */}
                  <div className="mt-6 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-lg max-w-[280px] text-center space-y-2 text-xs">
                    <h3 className="font-bold text-slate-900 flex items-center justify-center gap-1.5">
                      <MapPin size={13} className="text-purple-600" /> 
                      Premium Shourum
                    </h3>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                      Yunusobod tumani, Amir Temur ko'chasi. Oloy Bozori ro'parasida, metro bekatiga 3 daqiqalik yo'l.
                    </p>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[9px] font-bold">
                      <CheckCircle2 size={10} /> Bepul avtoturargoh mavjud
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Trust and Benefits Section - Clean borders, hover animations */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div 
                key={idx} 
                className="bg-white border border-gray-100 rounded-3xl p-8 text-left space-y-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default"
              >
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Icon size={22} className="stroke-[2.5]" />
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 tracking-tight">{badge.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                    {badge.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Minimalist Pre-footer CTA replacing the dark solid block */}
      <section className="bg-slate-50 border-t border-slate-100 py-24 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider">
            <Compass size={12} />
            Onlayn Katalog
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-2xl mx-auto">
            Sport olamiga birinchi qadamni professional do'kon bilan qo'ying!
          </h2>
          
          <p className="text-xs sm:text-base text-slate-500 max-w-lg mx-auto leading-relaxed font-semibold">
            Hozirroq ro'yxatdan o'ting yoki tizimga kiring. Shaxsiy profilingiz orqali buyurtmalarni oson rasmiylashtiring, chegirmalar va bonuslarga ega bo'ling.
          </p>

          <div className="pt-2">
            <button
              onClick={handleCTA}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-purple-600 text-white font-extrabold text-sm hover:bg-purple-700 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2.5 shadow-lg shadow-purple-600/10 cursor-pointer"
            >
              <span>Onlayn Katalogga Kirish</span>
              <ArrowRight size={16} className="stroke-[2.5]" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
