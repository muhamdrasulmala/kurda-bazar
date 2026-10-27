import { SizeType, PackageType, PACKAGE_OFFERS } from '../types/order';

/**
 * Calculates the recommended belt size based on weight and optional height
 */
export function calculateRecommendedSize(weightKg: number, heightCm?: number): SizeType {
  const safeWeight = Math.max(30, Math.min(180, weightKg || 65));
  
  // If height is provided, we can refine using a body mass ratio indicator
  if (heightCm && heightCm >= 120 && heightCm <= 220) {
    const bmi = safeWeight / Math.pow(heightCm / 100, 2);
    if (safeWeight < 52 || bmi < 19) return 'S';
    if (safeWeight < 68 || bmi < 23) return 'M';
    if (safeWeight < 84 || bmi < 27.5) return 'L';
    if (safeWeight < 100 || bmi < 32) return 'XL';
    return 'XXL';
  }

  // Pure weight fallback
  if (safeWeight < 52) return 'S';
  if (safeWeight < 68) return 'M';
  if (safeWeight < 83) return 'L';
  if (safeWeight < 98) return 'XL';
  return 'XXL';
}

/**
 * Provides size explanation and measurement details in Kurdish
 */
export function getSizeDetailsKurdish(size: SizeType): {
  label: string;
  weightRange: string;
  waistRange: string;
  description: string;
} {
  switch (size) {
    case 'S':
      return {
        label: 'سایزی بچووک (S)',
        weightRange: '٣٥ تا ٥٢ کیلۆگرام',
        waistRange: '٦٠ تا ٧٥ سانتیمەتر',
        description: 'گونجاوە بۆ کێشی کەم و هەرزەکاران یان کەسانی لەش باریک'
      };
    case 'M':
      return {
        label: 'سایزی مامناوەند (M)',
        weightRange: '٥٢ تا ٦٨ کیلۆگرام',
        waistRange: '٧٥ تا ٨٨ سانتیمەتر',
        description: 'سایزی ستاندارد بۆ کێشی مامناوەندی پیاوان و ئافرەتان'
      };
    case 'L':
      return {
        label: 'سایزی گەورە (L)',
        weightRange: '٦٨ تا ٨٣ کیلۆگرام',
        waistRange: '٨٨ تا ١٠٠ سانتیمەتر',
        description: 'گونجاوە بۆ کێشی سەرووی ٦٨ کگم و پێکهاتەی وەرزشی و پان'
      };
    case 'XL':
      return {
        label: 'سایزی زۆر گەورە (XL)',
        weightRange: '٨٣ تا ٩٨ کیلۆگرام',
        waistRange: '١٠٠ تا ١١٥ سانتیمەتر',
        description: 'گونجاوە بۆ کێشی زۆر و لەشی پڕ و شانی پان'
      };
    case 'XXL':
      return {
        label: 'سایزی دوو ئێکس (XXL)',
        weightRange: 'سەرووی ٩٨ کیلۆگرام',
        waistRange: '١١٥ تا ١٣٥ سانتیمەتر',
        description: 'گونجاوە بۆ کێش و باڵای زۆر بە قایشی کشانی درێژکراوە'
      };
  }
}

/**
 * Validates Kurdish/Iraqi phone numbers
 * Accepts formats: 0750XXXXXXX, 0770XXXXXXX, 0780XXXXXXX, +964750XXXXXXX, 750XXXXXXX
 */
export function validateKurdishPhone(phone: string): {
  isValid: boolean;
  normalized: string;
  error?: string;
} {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, normalized: '', error: 'تکایە ژمارەی مۆبایل بنووسە' };
  }

  // Clean characters, Arabic/Persian digits to western digits
  const cleaned = phone
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1632 + 48))
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1776 + 48))
    .replace(/[\s\-\(\)\.]/g, '');

  // Normalize local format
  let normalized = cleaned;
  if (normalized.startsWith('+964')) {
    normalized = '0' + normalized.slice(4);
  } else if (normalized.startsWith('00964')) {
    normalized = '0' + normalized.slice(5);
  } else if (normalized.length === 10 && (normalized.startsWith('75') || normalized.startsWith('77') || normalized.startsWith('78') || normalized.startsWith('79'))) {
    normalized = '0' + normalized;
  }

  // Must match Iraqi mobile pattern: 07[5789]XXXXXXXX (11 digits)
  const iraqiPhoneRegex = /^07[56789]\d{8}$/;
  if (iraqiPhoneRegex.test(normalized)) {
    return { isValid: true, normalized };
  }

  // Lenient fallback for general mobile numbers with 10-14 digits
  if (/^\+?\d{10,14}$/.test(cleaned)) {
    return { isValid: true, normalized: cleaned };
  }

  return {
    isValid: false,
    normalized: cleaned,
    error: 'ژمارەی مۆبایل دەبێت بە ٠٧ دەست پێبکات و ١١ ژمارە بێت (نموونە: 07501234567)'
  };
}

/**
 * Calculates total order pricing and delivery fees
 */
export function calculateOrderPricing(packageType: PackageType = 'single', city: string = ''): {
  basePrice: number;
  deliveryFee: number;
  totalPrice: number;
  isFreeDelivery: boolean;
  savings: number;
} {
  const basePrice = 15000;
  const deliveryFee = 0; // گەیاندن خۆڕاییە (بەلاش)
  const totalPrice = 15000;
  const originalPrice = 25000;
  const savings = originalPrice - totalPrice;

  return {
    basePrice,
    deliveryFee,
    totalPrice,
    isFreeDelivery: true,
    savings
  };
}
