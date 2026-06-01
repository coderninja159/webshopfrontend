import { create } from 'zustand';
import type { Product, CartItem } from '../types';


interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeItem: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  
  // Computed values
  getSubtotal: () => number;
  getTax: () => number;
  getShipping: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

const getStoredCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('shopwep-cart');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('shopwep-cart', JSON.stringify(items));
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  items: getStoredCart(),
  
  addItem: (product, quantity = 1, color, size) => {
    const { items } = get();
    const existingIndex = items.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedColor === color &&
        item.selectedSize === size
    );

    let newItems = [...items];
    if (existingIndex > -1) {
      const nextQuantity = newItems[existingIndex].quantity + quantity;
      // Cap at product inventory
      newItems[existingIndex].quantity = Math.min(nextQuantity, product.inventory);
    } else {
      newItems.push({
        product,
        quantity: Math.min(quantity, product.inventory),
        selectedColor: color,
        selectedSize: size,
      });
    }

    saveCart(newItems);
    set({ items: newItems });
  },

  removeItem: (productId, color, size) => {
    const { items } = get();
    const newItems = items.filter(
      (item) =>
        !(
          item.product.id === productId &&
          item.selectedColor === color &&
          item.selectedSize === size
        )
    );
    saveCart(newItems);
    set({ items: newItems });
  },

  updateQuantity: (productId, quantity, color, size) => {
    if (quantity <= 0) {
      get().removeItem(productId, color, size);
      return;
    }

    const { items } = get();
    const newItems = items.map((item) => {
      if (
        item.product.id === productId &&
        item.selectedColor === color &&
        item.selectedSize === size
      ) {
        return { ...item, quantity: Math.min(quantity, item.product.inventory) };
      }
      return item;
    });

    saveCart(newItems);
    set({ items: newItems });
  },

  clearCart: () => {
    saveCart([]);
    set({ items: [] });
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  },

  getTax: () => {
    return get().getSubtotal() * 0.08; // 8% standard sales tax
  },

  getShipping: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0 || subtotal >= 150) return 0; // Free shipping over $150
    return 15; // Flat $15 shipping rate
  },

  getTotal: () => {
    return get().getSubtotal() + get().getTax() + get().getShipping();
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  }
}));
