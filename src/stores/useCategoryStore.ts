import { create } from 'zustand';
import { apiClient } from '../services/apiClient';

export interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
}

// Resilient Uzum-style default fallback categories to prevent UI crashes if server is down or empty
const FALLBACK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Smartphones', slug: 'smartphones' },
  { id: 'cat-2', name: 'Laptops', slug: 'laptops' },
  { id: 'cat-3', name: 'Audio', slug: 'audio' },
  { id: 'cat-4', name: 'Accessories', slug: 'accessories' }
];

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: FALLBACK_CATEGORIES, // Seed with standard fallbacks out-of-the-box
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    // Avoid double fetching triggers if already loading to keep UX fluid
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/categories');
      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        set({ categories: data, isLoading: false });
      } else {
        // Log warn and keep standard fallback options
        console.warn("Backend categories response empty. Utilizing built-in fallback categories.");
        set({ categories: FALLBACK_CATEGORIES, isLoading: false });
      }
    } catch (err: any) {
      console.error("Failed to fetch product categories:", err);
      // Fail gracefully: retain fallback categories so the user has fully working catalog filter panels
      set({ 
        categories: FALLBACK_CATEGORIES, 
        isLoading: false,
        error: err.message || "Kategoriyalarni yuklashda xatolik yuz berdi"
      });
    }
  }
}));

export default useCategoryStore;
