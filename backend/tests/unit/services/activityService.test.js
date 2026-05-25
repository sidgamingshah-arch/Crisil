const ActivityService = require('../../../src/services/ActivityService');

describe('ActivityService.calculateDiscount', () => {
  const activity = {
    base_price: 100.00,
    currency_code: 'USD',
    discount_tiers: [
      { min_participants: 3, discount_percent: 10 },
      { min_participants: 6, discount_percent: 20 },
      { min_participants: 10, discount_percent: 35 },
    ],
  };

  test('1 participant: no discount', () => {
    const result = ActivityService.calculateDiscount(activity, 1);
    expect(result.discount_percent).toBe(0);
    expect(result.final_price).toBe(100.00);
    expect(result.savings).toBe(0);
    expect(result.next_tier.min_participants).toBe(3);
    expect(result.spots_to_next_discount).toBe(2);
  });

  test('2 participants: no discount, next tier in 1 spot', () => {
    const result = ActivityService.calculateDiscount(activity, 2);
    expect(result.discount_percent).toBe(0);
    expect(result.spots_to_next_discount).toBe(1);
  });

  test('3 participants: exactly at first tier (10%)', () => {
    const result = ActivityService.calculateDiscount(activity, 3);
    expect(result.discount_percent).toBe(10);
    expect(result.final_price).toBe(90.00);
    expect(result.savings).toBe(10.00);
  });

  test('5 participants: still at 10% tier', () => {
    const result = ActivityService.calculateDiscount(activity, 5);
    expect(result.discount_percent).toBe(10);
    expect(result.next_tier.min_participants).toBe(6);
    expect(result.spots_to_next_discount).toBe(1);
  });

  test('6 participants: at 20% tier', () => {
    const result = ActivityService.calculateDiscount(activity, 6);
    expect(result.discount_percent).toBe(20);
    expect(result.final_price).toBe(80.00);
  });

  test('10 participants: max tier (35%)', () => {
    const result = ActivityService.calculateDiscount(activity, 10);
    expect(result.discount_percent).toBe(35);
    expect(result.final_price).toBe(65.00);
    expect(result.next_tier).toBeNull();
    expect(result.spots_to_next_discount).toBeNull();
  });

  test('15 participants: beyond max tier, stays at 35%', () => {
    const result = ActivityService.calculateDiscount(activity, 15);
    expect(result.discount_percent).toBe(35);
    expect(result.next_tier).toBeNull();
  });

  test('empty discount_tiers: always 0%', () => {
    const noTiers = { ...activity, discount_tiers: [] };
    const result = ActivityService.calculateDiscount(noTiers, 100);
    expect(result.discount_percent).toBe(0);
    expect(result.final_price).toBe(100.00);
    expect(result.next_tier).toBeNull();
  });
});
