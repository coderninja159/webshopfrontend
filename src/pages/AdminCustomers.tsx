import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, RefreshCw, Search } from 'lucide-react';
import { showGlobalToast } from '../services/apiClient';

interface CustomerData {
  id: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export function AdminCustomers() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      } else {
        showGlobalToast("Mijozlar ro'yxatini yuklashda xatolik yuz berdi", 'error');
      }
    } catch (err) {
      console.error(err);
      showGlobalToast("Tarmoq xatoligi yuz berdi", 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleActive = async (id: string) => {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}/toggle-active`, {
        method: 'POST',
      });
      if (res.ok) {
        setCustomers(prev =>
          prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c))
        );
        showGlobalToast("Mijoz holati muvaffaqiyatli yangilandi", 'success');
      } else {
        showGlobalToast("Amalni bajarishda xatolik yuz berdi", 'error');
      }
    } catch (err) {
      console.error(err);
      showGlobalToast("Tarmoq xatoligi", 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phoneNumber.includes(searchQuery)
  );

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
            Mijozlar boshqaruvi
          </h1>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            Ro'yxatdan o'tgan foydalanuvchilarning faollik holatini nazorat qilish.
          </p>
        </div>
        <button
          onClick={fetchCustomers}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 hover:border-purple-600 rounded-xl text-xs font-bold text-gray-650 hover:text-purple-600 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Yangilash</span>
        </button>
      </div>

      {/* Control Actions & Search */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="max-w-md relative">
          <input
            type="text"
            placeholder="Mijoz ismi yoki telefon raqami bo'yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-100 border border-transparent focus-within:border-purple-600/40 focus-within:bg-white rounded-xl text-xs font-semibold text-gray-900 outline-none transition-all placeholder:text-gray-450"
          />
          <Search size={14} className="absolute left-4 top-3.5 text-gray-400" />
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-2.5">
            <div className="h-7 w-7 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
            <span className="text-xs text-gray-450 font-bold">Yuklanmoqda...</span>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-gray-50 border border-gray-150 text-gray-400 flex items-center justify-center mx-auto shadow-sm">
              <Users size={22} className="stroke-[1.8]" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-sm text-gray-900">Mijozlar topilmadi</h3>
              <p className="text-[11px] text-gray-400 font-semibold mt-1 max-w-[280px] mx-auto leading-relaxed">
                Qidiruv so'rovi bo'yicha hech qanday mijoz topilmadi yoki ro'yxat bo'sh.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase border-b border-gray-150 pb-3">
                  <th className="py-3.5 px-4">F.I.SH</th>
                  <th className="py-3.5 px-4">Telefon raqami</th>
                  <th className="py-3.5 px-4">Ro'yxatdan o'tgan sana</th>
                  <th className="py-3.5 px-4">Holati</th>
                  <th className="py-3.5 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(customer => (
                  <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors font-semibold text-gray-700">
                    <td className="py-4 px-4 text-gray-900 font-extrabold">
                      {customer.fullName}
                    </td>
                    <td className="py-4 px-4 font-mono text-gray-500">
                      {customer.phoneNumber}
                    </td>
                    <td className="py-4 px-4 text-gray-405">
                      {new Date(customer.createdAt).toLocaleDateString('uz-UZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-4">
                      {customer.isActive ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full border text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border-emerald-200">
                          <UserCheck size={10} />
                          <span>Faol</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full border text-[9px] font-extrabold bg-red-50 text-red-700 border-red-200">
                          <UserX size={10} />
                          <span>Bloklangan</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleToggleActive(customer.id)}
                        disabled={togglingId === customer.id}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                          customer.isActive
                            ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {togglingId === customer.id ? (
                          <RefreshCw size={10} className="animate-spin" />
                        ) : customer.isActive ? (
                          'Bloklash'
                        ) : (
                          'Blokdan ochish'
                        )}
                      </button>
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

export default AdminCustomers;
