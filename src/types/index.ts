export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: {
    rate: number;
    count: number;
  };
  specs: Record<string, string>;
  sizes?: string[];
  colors?: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  discountPercent?: number;
  inventory: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  wishlist: string[]; // array of product IDs
  orders: Order[];
}
