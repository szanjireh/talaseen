export type UserRole = 'USER' | 'SELLER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  shopName?: string;
  isApproved?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Seller {
  id: string;
  userId: string;
  shopName: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface GoldProduct {
  id: string;
  sellerId: string;
  title: string;
  description?: string;
  type: GoldProductType;
  weight: number; // in grams
  size?: number; // Optional: for rings, bracelets, etc.
  makingFee: number;
  profitPercent: number;
  goldPriceAtCreation: number;
  finalPrice: number;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
  seller?: Seller;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  isPrimary: boolean;
  createdAt: string;
}

export type GoldProductType = 
  | 'RING'
  | 'BRACELET'
  | 'NECKLACE'
  | 'EARRING'
  | 'BANGLE'
  | 'PENDANT'
  | 'ANKLET'
  | 'CHAIN'
  | 'COIN'
  | 'BAR'
  | 'OTHER';

export interface Announcement {
  id: string;
  title: string;
  content?: string;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
