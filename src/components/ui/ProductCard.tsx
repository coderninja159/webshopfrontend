import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import type { Product } from '../../types';
import { useCartStore } from '../../stores/cartStore';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const originalPrice = product.discountPercent
    ? Math.round(product.price / (1 - product.discountPercent / 100))
    : null;

  // Mock monthly installment (Uzum-style)
  const monthlyInstallment = Math.round(product.price / 12);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1, product.colors?.[0], product.sizes?.[0]);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full cursor-pointer relative"
    >
      {/* Badges on Top Left of Image */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.isNew && (
          <span className="bg-purple-600 text-white text-[9px] font-bold tracking-wide px-2 py-0.5 rounded-md shadow-sm">
            YANGI
          </span>
        )}
        {product.discountPercent && (
          <span className="bg-red-500 text-white text-[9px] font-bold tracking-wide px-2 py-0.5 rounded-md shadow-sm">
            -{product.discountPercent}%
          </span>
        )}
      </div>

      {/* Product Image Cover */}
      <div className="h-56 overflow-hidden bg-gray-50 relative shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-103"
          loading="lazy"
        />
        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-black/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Product Info Section */}
      <div className="p-4 flex flex-col flex-grow text-left space-y-2.5">
        
        {/* Title */}
        <h3 className="font-display font-medium text-[13.5px] leading-snug text-gray-800 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating & Sharhlar */}
        <div className="flex items-center space-x-1">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span className="text-[11px] font-semibold text-gray-700">{product.rating.rate}</span>
          <span className="text-[11px] text-gray-400">({product.rating.count} sharh)</span>
        </div>

        {/* Installment Badge (Uzum style clone) */}
        <div className="inline-block self-start bg-yellow-50 text-[10px] text-yellow-800 font-semibold px-2 py-0.5 rounded border border-yellow-100">
          {monthlyInstallment.toLocaleString('uz-UZ')} so'm/oyiga
        </div>

        {/* Price & Add to Cart Action */}
        <div className="flex items-end justify-between pt-2 mt-auto">
          <div className="flex flex-col">
            {originalPrice && (
              <span className="text-[11px] text-gray-400 line-through leading-none mb-0.5">
                {originalPrice.toLocaleString('uz-UZ')} so'm
              </span>
            )}
            <span className="text-[14px] sm:text-[15px] font-bold text-gray-900 leading-none">
              {product.price.toLocaleString('uz-UZ')} so'm
            </span>
          </div>

          {/* Quick Add To Cart Button */}
          <button
            onClick={handleAddToCart}
            className="h-8 w-8 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 active:scale-95 shrink-0"
            aria-label="Savatga qo'shish"
          >
            <ShoppingCart size={14} className="stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>
  );
}
