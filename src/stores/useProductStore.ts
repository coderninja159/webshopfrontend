import { create } from 'zustand';
import { apiClient } from '../services/apiClient';
import type { Product } from '../types';

// Map database fields to standard frontend UI product models
export const mapBackendProductToFrontend = (p: any): Product => {
  return {
    id: p.id || '',
    name: p.name || '',
    description: p.description || '',
    price: Number(p.price) || 0,
    image: (p.images && p.images.length > 0) ? p.images[0] : 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop',
    category: p.categoryName || 'Smartphones',
    rating: {
      rate: p.rating?.rate || 4.7,
      count: p.rating?.count || 120
    },
    specs: p.specs || {
      'Kafolat': "1 yillik rasmiy kafolat",
      'Holati': 'Original, qadoqlangan'
    },
    sizes: p.sizes || ['Standard'],
    colors: p.colors || ['Black'],
    isFeatured: p.isFeatured !== undefined ? p.isFeatured : true,
    isNew: p.isNew !== undefined ? p.isNew : false,
    discountPercent: p.discountPercent || 0,
    inventory: p.stockQuantity !== undefined ? p.stockQuantity : 10,
    // Add dynamic DTO properties to preserve API fields
    categoryId: p.categoryId,
    images: p.images || []
  } as any;
};

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  createProduct: (productData: any) => Promise<Product>;
  updateProduct: (id: string, productData: any) => Promise<Product>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    // Avoid double fetching triggers if already loading to keep UI fluid
    if (get().isLoading) return;
    
    set({ isLoading: true, error: null });
    try {
      // Query up to 100 products from Spring Boot server in one request to ensure seamless client filtering
      const response = await apiClient.get('/products?size=100');
      const data = response.data;
      
      let list: any[] = [];
      if (data && Array.isArray(data.content)) {
        list = data.content;
      } else if (Array.isArray(data)) {
        list = data;
      }

      const mappedProducts = list.map(mapBackendProductToFrontend);
      set({ products: mappedProducts, isLoading: false });
    } catch (err: any) {
      console.error('Error fetching catalog products:', err);
      set({ 
        isLoading: false, 
        error: err.message || "Mahsulotlarni yuklashda xatolik yuz berdi" 
      });
    }
  },

  deleteProduct: async (id: string) => {
    try {
      await apiClient.delete(`/products/${id}`);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
    } catch (err: any) {
      console.error('Error deleting product from backend:', err);
      throw err;
    }
  },

  createProduct: async (productData: any) => {
    try {
      const response = await apiClient.post('/products', productData);
      const mapped = mapBackendProductToFrontend(response.data);
      set((state) => ({
        products: [mapped, ...state.products],
      }));
      return mapped;
    } catch (err: any) {
      console.error('Error creating product in backend:', err);
      throw err;
    }
  },

  updateProduct: async (id: string, productData: any) => {
    try {
      const response = await apiClient.put(`/products/${id}`, productData);
      const mapped = mapBackendProductToFrontend(response.data);
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? mapped : p)),
      }));
      return mapped;
    } catch (err: any) {
      console.error('Error updating product in backend:', err);
      throw err;
    }
  }
}));

export default useProductStore;
