import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

interface BannerData {
  id: number;
  title: string;
  description: string;
  image?: string;
  badge?: string;
}

interface Hero3DProps {
  defaultTitle?: string;
}

export function Hero3D({ defaultTitle = "Sifatli mahsulotlar do'koni" }: Hero3DProps) {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<BannerData[]>([]);

  useEffect(() => {
    // Dynamic fetch from /api/banners or fallback to a simple truthful state
    fetch('/api/banners')
      .then((res) => {
        if (!res.ok) throw new Error('Offline or no API');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBanners(data);
        } else {
          throw new Error('Empty banner array');
        }
      })
      .catch(() => {
        // Fallback to dynamic, truthful local content
        setBanners([
          {
            id: 1,
            title: defaultTitle,
            description: "Bizning do'konda faqat original va kafolatlangan texnika hamda smartfonlarni topasiz.",
            badge: "RASMIY DO'KON",
            image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop"
          }
        ]);
      });
  }, [defaultTitle]);

  const activeBanner = banners[0] || {
    title: defaultTitle,
    description: "Bizning do'konda faqat original va kafolatlangan texnika hamda smartfonlarni topasiz.",
    badge: "RASMIY DO'KON",
  };

  return (
    <div className="relative w-full h-[280px] sm:h-[320px] rounded-2xl overflow-hidden bg-white border border-gray-150 shadow-sm flex items-center">
      
      {/* Background container */}
      <div className="absolute inset-0 z-0 flex items-center justify-between">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-700 opacity-[0.95]" />
        
        {activeBanner.image && (
          <div className="absolute top-0 right-0 bottom-0 w-1/2 hidden md:block overflow-hidden">
            <img
              src={activeBanner.image}
              alt="Store banner"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full md:w-3/5 px-6 sm:px-12 md:pl-16 text-left text-white flex flex-col justify-center space-y-4">
        
        {activeBanner.badge && (
          <div className="inline-flex self-start items-center space-x-2 bg-white/15 backdrop-blur-md rounded-full px-3.5 py-1">
            <Sparkles size={11} className="text-white animate-pulse" />
            <span className="text-[9px] tracking-wider uppercase font-extrabold text-white">
              {activeBanner.badge}
            </span>
          </div>
        )}

        <h2 className="font-display font-extrabold text-2xl sm:text-4xl leading-tight tracking-tight">
          {activeBanner.title}
        </h2>

        <p className="text-xs sm:text-sm text-white/85 max-w-md font-medium leading-relaxed">
          {activeBanner.description}
        </p>

        <div>
          <button
            onClick={() => navigate('/products')}
            className="bg-white text-purple-700 hover:bg-purple-50 transition-all px-6 py-2.5 rounded-xl font-bold text-xs cursor-pointer shadow-sm hover:scale-[1.01]"
          >
            Mahsulotlarni ko'rish
          </button>
        </div>

      </div>
    </div>
  );
}
