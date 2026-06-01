import { useState, useEffect } from 'react';
import { ShoppingBag, Users, TrendingUp, ClipboardList, PackageOpen } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

interface OrderData {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: string;
}

export function AdminDashboard() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [stats, setStats] = useState({
    salesTotal: 0,
    orderCount: 0,
    customerCount: 0,
    productsCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dynamic fetch from backend endpoints
    Promise.all([
      fetch('/api/admin/stats').then(res => res.ok ? res.json() : null),
      fetch('/api/admin/orders').then(res => res.ok ? res.json() : null)
    ])
    .then(([statsData, ordersData]) => {
      if (statsData) setStats(statsData);
      if (Array.isArray(ordersData)) setOrders(ordersData);
      setLoading(false);
    })
    .catch(() => {
      // Fallback to empty states (no fake data lies!)
      setStats({
        salesTotal: 0,
        orderCount: 0,
        customerCount: 0,
        productsCount: 0
      });
      setOrders([]);
      setLoading(false);
    });
  }, []);

  const statsCards = [
    { title: 'Jami Savdolar', value: `${stats.salesTotal.toLocaleString('uz-UZ')} so'm`, icon: TrendingUp, color: 'text-purple-650 bg-purple-50 border-purple-100' },
    { title: 'Buyurtmalar Soni', value: `${stats.orderCount} ta buyurtma`, icon: ClipboardList, color: 'text-blue-650 bg-blue-50 border-blue-100' },
    { title: 'Mijozlar Bazasi', value: `${stats.customerCount} nafar`, icon: Users, color: 'text-emerald-650 bg-emerald-50 border-emerald-100' },
    { title: 'Faol Mahsulotlar', value: `${stats.productsCount} turdagi`, icon: ShoppingBag, color: 'text-amber-650 bg-amber-50 border-amber-100' }
  ];

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
          Bosh sahifa
        </h1>
        <p className="text-xs text-gray-400 font-semibold mt-1">
          Xush kelibsiz, {user?.name || 'Administrator'}! Tizim ma'lumotlari haqiqiy vaqt rejimida yangilanadi.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white border border-gray-150 rounded-2xl p-6 flex items-center justify-between shadow-sm">
              <div className="space-y-1.5 text-left">
                <span className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                  {item.title}
                </span>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-gray-900 leading-none">
                  {item.value}
                </h3>
              </div>
              <div className={`h-11 w-11 rounded-2xl border flex items-center justify-center shrink-0 ${item.color}`}>
                <Icon size={20} className="stroke-[2.5]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Logs Table block */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <ClipboardList size={16} className="text-purple-650" />
            <h2 className="font-display font-extrabold text-base text-gray-900">
              Oxirgi buyurtmalar
            </h2>
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase">
            Jarayonlar monitoringi
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-2.5">
            <div className="h-6 w-6 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
            <span className="text-[11px] text-gray-400 font-bold">Ma'lumotlar yuklanmoqda...</span>
          </div>
        ) : orders.length === 0 ? (
          /* True blank state fallback */
          <div className="py-16 text-center space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-gray-50 border border-gray-150 text-gray-450 flex items-center justify-center mx-auto shadow-sm">
              <PackageOpen size={24} className="stroke-[2]" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-sm text-gray-900">Ma'lumot yo'q</h3>
              <p className="text-[11px] text-gray-450 font-semibold mt-1 max-w-[240px] mx-auto leading-relaxed">
                Hozircha tizimda hech qanday faol buyurtmalar ro'yxatga olinmagan.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase border-b border-gray-150 pb-3">
                  <th className="py-3.5 px-4">Buyurtma ID</th>
                  <th className="py-3.5 px-4">Mijoz</th>
                  <th className="py-3.5 px-4">Sana</th>
                  <th className="py-3.5 px-4">Jami summasi</th>
                  <th className="py-3.5 px-4">Holati</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors font-semibold text-gray-700">
                    <td className="py-4 px-4 font-bold text-purple-650">{o.id}</td>
                    <td className="py-4 px-4 text-gray-900 font-extrabold">{o.customer}</td>
                    <td className="py-4 px-4 text-gray-400 font-medium">{o.date}</td>
                    <td className="py-4 px-4 text-gray-900 font-extrabold">{o.total.toLocaleString('uz-UZ')} so'm</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full border text-[9px] font-bold bg-purple-50 text-purple-700 border-purple-200">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
