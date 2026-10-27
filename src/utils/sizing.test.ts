import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRecommendedSize, validateKurdishPhone, calculateOrderPricing } from './sizing';
import { formatTelegramOrderMessage } from './telegram';
import { CustomerOrder } from '../types/order';

test('calculateRecommendedSize returns correct sizes based on weight', () => {
  assert.equal(calculateRecommendedSize(45), 'S');
  assert.equal(calculateRecommendedSize(50), 'S');
  assert.equal(calculateRecommendedSize(60), 'M');
  assert.equal(calculateRecommendedSize(75), 'L');
  assert.equal(calculateRecommendedSize(88), 'XL');
  assert.equal(calculateRecommendedSize(105), 'XXL');
});

test('calculateRecommendedSize adjusts with height when provided', () => {
  // A 190cm person with 75kg is lean (BMI ~20.7), should get M or L
  const sizeTall = calculateRecommendedSize(75, 190);
  assert.equal(sizeTall, 'M');

  // A 160cm person with 75kg is heavier (BMI ~29.3), should get L
  const sizeShort = calculateRecommendedSize(75, 160);
  assert.equal(sizeShort, 'L');
});

test('validateKurdishPhone handles diverse Kurdistan mobile formats', () => {
  // Korek / Fastlink 0750
  const r1 = validateKurdishPhone('07501234567');
  assert.equal(r1.isValid, true);
  assert.equal(r1.normalized, '07501234567');

  // Asiacell 0770 without leading zero
  const r2 = validateKurdishPhone('7709876543');
  assert.equal(r2.isValid, true);
  assert.equal(r2.normalized, '07709876543');

  // International prefix +964
  const r3 = validateKurdishPhone('+9647501112233');
  assert.equal(r3.isValid, true);
  assert.equal(r3.normalized, '07501112233');

  // Kurdish/Arabic digits
  const r4 = validateKurdishPhone('٠٧٥٠١٢٣٤٥٦٧');
  assert.equal(r4.isValid, true);
  assert.equal(r4.normalized, '07501234567');

  // Invalid number
  const r5 = validateKurdishPhone('123');
  assert.equal(r5.isValid, false);
});

test('calculateOrderPricing calculates 15,000 IQD and free delivery', () => {
  const single = calculateOrderPricing('single', 'هەولێر');
  assert.equal(single.basePrice, 15000);
  assert.equal(single.deliveryFee, 0);
  assert.equal(single.totalPrice, 15000);
  assert.equal(single.isFreeDelivery, true);

  const testSuly = calculateOrderPricing('single', 'سلێمانی');
  assert.equal(testSuly.totalPrice, 15000);
  assert.equal(testSuly.deliveryFee, 0);
  assert.equal(testSuly.isFreeDelivery, true);
});

test('formatTelegramOrderMessage includes required fields in Kurdish', () => {
  const testOrder: CustomerOrder = {
    id: 'ord-test-123456',
    fullName: 'ئاراس ئەحمەد',
    city: 'سلێمانی',
    customCity: 'گەڕەکی ڕاپەڕین',
    primaryPhone: '07701234567',
    secondaryPhone: '07507654321',
    weightKg: 82,
    packageType: 'single',
    totalPrice: 15000,
    deliveryFee: 0,
    notes: 'پاش نیوەڕۆ پەیوەندی بکەن',
    createdAt: '2026-10-27T10:00:00Z',
    status: 'new'
  };

  const msg = formatTelegramOrderMessage(testOrder);
  assert.match(msg, /کوردە بازاڕ/);
  assert.match(msg, /ئاراس ئەحمەد/);
  assert.match(msg, /سلێمانی/);
  assert.match(msg, /07701234567/);
  assert.match(msg, /07507654321/);
  assert.match(msg, /82 کگم/);
  assert.match(msg, /15,000/);
});
