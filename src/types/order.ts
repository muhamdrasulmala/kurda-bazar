export type SizeType = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type PackageType = 'single' | 'double_bundle' | 'family_bundle';

export interface CustomerOrder {
  id: string;
  fullName: string;
  city: string;
  customCity?: string;
  addressDetails?: string;
  primaryPhone: string;
  secondaryPhone?: string;
  weightKg: number;
  heightCm?: number;
  selectedSize?: SizeType;
  packageType: PackageType;
  totalPrice: number;
  deliveryFee: number;
  notes?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'shipped' | 'delivered' | 'cancelled';
}

export interface PackageOffer {
  id: PackageType;
  title: string;
  subtitle: string;
  quantity: number;
  price: number;
  originalPrice: number;
  isPopular?: boolean;
  freeDelivery: boolean;
  badge?: string;
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  storeUsername: string; // e.g. 'kurda_bazar' or phone
  isActive: boolean;
}

export const KURDISH_CITIES = [
  'هەولێر',
  'سلێمانی',
  'دهۆک',
  'کەرکووک',
  'هەڵەبجە',
  'زاخۆ',
  'گەرمیان / کەلار',
  'سۆران',
  'ڕانیە / پشدەر',
  'کۆیە',
  'چەمچەماڵ',
  'شارەزوور',
  'ئاکرێ',
  'بەغدا و شارەکانی تری عێراق'
] as const;

export const PACKAGE_OFFERS: PackageOffer[] = [
  {
    id: 'single',
    title: 'قایشی پزیشکی ڕاستکردنەوەی پشت',
    subtitle: 'ئۆفەری تایبەتی کوردە بازاڕ + گەیاندنی خۆڕایی',
    quantity: 1,
    price: 15000,
    originalPrice: 25000,
    isPopular: true,
    freeDelivery: true,
    badge: 'داشکاندنی ٤٠٪ · گەیاندنی خۆڕایی'
  }
];
