import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Search, Plus, Minus, CheckCircle2, ShieldAlert, PackageOpen } from 'lucide-react';
import { useProductStore } from '../stores/useProductStore';

export function AdminProducts() {
  const navigate = useNavigate();

  // Zustand Product Store
  const { products: productsList, isLoading: loading, fetchProducts, updateProduct } = useProductStore();
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleUpdateStock = async (productId: string, amount: number) => {
    const target = productsList.find(p => p.id === productId);
    if (!target) return;
    
    const newStock = Math.max(0, target.inventory + amount);
    
    const payload = {
      name: target.name,
      description: target.description,
      price: target.price,
      stockQuantity: newStock,
      categoryId: (target as any).categoryId || '00000000-0000-0000-0000-000000000000',
      isActive: true,
      images: (target as any).images && (target as any).images.length > 0 ? (target as any).images : [target.image]
    };
    
    try {
      await updateProduct(productId, payload);
    } catch (err) {
      console.error("Failed to update stock via API:", err);
    }
  };

  const handleToggleFeatured = async (productId: string) => {
    const target = productsList.find(p => p.id === productId);
    if (!target) return;
    
    const payload = {
      name: target.name,
      description: target.description,
      price: target.price,
      stockQuantity: target.inventory,
      categoryId: (target as any).categoryId || '00000000-0000-0000-0000-000000000000',
      isActive: true,
      images: (target as any).images && (target as any).images.length > 0 ? (target as any).images : [target.image],
      isFeatured: !target.isFeatured
    } as any;
    
    try {
      await updateProduct(productId, payload);
    } catch (err) {
      console.error("Failed to toggle featured status via API:", err);
    }
  };

  const filteredProducts = productsList.filter(p =>
    p.name.toLowerCase().includes(searchVal.toLowerCase()) ||
    p.category.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <div className="space-y-8">
      
      {/* Header and Search Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Title details */}
        <div className="text-left">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
            Mahsulotlar Ombori
          </h1>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            Qurilmalarning ombor qoldig'i, narxlari va tavsiya maqomini boshqarish.
          </p>
        </div>

        {/* Action Button & Search */}
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Search bar */}
          <div className="flex items-center rounded-xl bg-white border border-gray-200 px-3.5 py-2.5 w-full sm:w-64 shadow-sm focus-within:border-purple-650/40 transition-all text-left">
            <Search size={14} className="text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Qidirish..."
              className="bg-transparent text-xs w-full text-gray-900 outline-none placeholder:text-gray-400 font-semibold"
            />
          </div>

          {/* Add product button */}
          <button
            onClick={() => navigate('/admin/products/new')}
            className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-display font-bold hover:bg-purple-750 transition-all text-xs cursor-pointer shadow-sm shadow-purple-600/10 flex items-center space-x-1.5 hover:scale-[1.01]"
          >
            <Plus size={14} className="stroke-[2.5]" />
            <span>Yangi mahsulot qo'shish</span>
          </button>

        </div>

      </div>

      {/* Products inventory table */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="flex items-center space-x-2 pb-4 border-b border-gray-100 text-left">
          <Package size={16} className="text-purple-650" />
          <h2 className="font-display font-extrabold text-base text-gray-900">
            Mahsulotlar ro'yxati
          </h2>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-2.5">
            <div className="h-6 w-6 rounded-full border-2 border-purple-650 border-t-transparent animate-spin" />
            <span className="text-[11px] text-gray-450 font-bold">Mahsulotlar yuklanmoqda...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty state */
          <div className="py-16 text-center space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-gray-50 border border-gray-150 text-gray-450 flex items-center justify-center mx-auto shadow-sm">
              <PackageOpen size={24} className="stroke-[2]" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-sm text-gray-900">Ma'lumot yo'q</h3>
              <p className="text-[11px] text-gray-450 font-semibold mt-1 max-w-[240px] mx-auto leading-relaxed">
                Qidiruv shartlariga mos keladigan yoki faol ombor mahsulotlari topilmadi.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase border-b border-gray-150 pb-3">
                  <th className="py-3.5 px-4">Rasm</th>
                  <th className="py-3.5 px-4">Mahsulot nomi</th>
                  <th className="py-3.5 px-4">Kategoriya</th>
                  <th className="py-3.5 px-4">Narxi</th>
                  <th className="py-3.5 px-4">Zaxira (Ombor)</th>
                  <th className="py-3.5 px-4">Holati</th>
                  <th className="py-3.5 px-4 text-center">Tavsiya</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors font-semibold text-gray-700">
                    
                    {/* Image */}
                    <td className="py-4 px-4 shrink-0">
                      <div className="h-10 w-10 overflow-hidden rounded-lg bg-gray-50 border border-gray-150">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-4 px-4 text-gray-900 font-extrabold max-w-[200px] truncate">{p.name}</td>

                    {/* Category */}
                    <td className="py-4 px-4 text-gray-400 font-bold">{p.category}</td>

                    {/* Price */}
                    <td className="py-4 px-4 text-gray-900 font-extrabold">{p.price.toLocaleString('uz-UZ')} so'm</td>

                    {/* Inventory Adjuster */}
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateStock(p.id, -1)}
                          className="h-6 w-6 rounded bg-gray-50 hover:bg-gray-200 border border-gray-200 text-gray-700 flex items-center justify-center cursor-pointer transition-colors"
                        >
                          <Minus size={10} className="stroke-[3]" />
                        </button>
                        <span className="font-mono font-bold text-gray-900 w-8 text-center">{p.inventory}</span>
                        <button
                          onClick={() => handleUpdateStock(p.id, 1)}
                          className="h-6 w-6 rounded bg-gray-50 hover:bg-gray-200 border border-gray-200 text-gray-700 flex items-center justify-center cursor-pointer transition-colors"
                        >
                          <Plus size={10} className="stroke-[3]" />
                        </button>
                      </div>
                    </td>

                    {/* Stock status badge */}
                    <td className="py-4 px-4">
                      {p.inventory > 0 ? (
                        <span className="inline-flex items-center text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-150 rounded-full px-2.5 py-0.5">
                          <CheckCircle2 size={10} className="mr-1 shrink-0" />
                          <span>Mavjud</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[9px] font-bold text-red-650 bg-red-50 border border-red-150 rounded-full px-2.5 py-0.5">
                          <ShieldAlert size={10} className="mr-1 shrink-0" />
                          <span>Tugagan</span>
                        </span>
                      )}
                    </td>

                    {/* Recommendation Tag Toggler */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(p.id)}
                        className={`text-[9px] font-bold rounded-lg px-2.5 py-1.5 border transition-all cursor-pointer ${
                          p.isFeatured
                            ? 'bg-amber-50 text-amber-700 border-amber-250'
                            : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-amber-450 hover:text-amber-500'
                        }`}
                      >
                        {p.isFeatured ? 'Asosiyda faol' : 'Qo\'shish'}
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
