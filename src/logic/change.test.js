import { describe, test, expect } from 'vitest';
import { breakdown, makeChange, sumCart, pieceCount } from './change.js';
import { formatDollars, dollarsToCents } from './money.js';

describe('breakdown', () => {
  test('175¢ → one $1 + three quarters', () => {
    const pieces = breakdown(175);
    expect(pieces.map((p) => [p.cents, p.count])).toEqual([
      [100, 1],
      [25, 3],
    ]);
  });

  test('0¢ → no pieces', () => {
    expect(breakdown(0)).toEqual([]);
  });

  test('uses largest denominations first', () => {
    const pieces = breakdown(2741); // $27.41
    expect(pieces.map((p) => [p.cents, p.count])).toEqual([
      [2000, 1], // $20
      [500, 1],  // $5
      [100, 2],  // $1 x2
      [25, 1],   // quarter
      [10, 1],   // dime
      [5, 1],    // nickel
      [1, 1],    // penny
    ]);
  });
});

describe('makeChange', () => {
  test('total $1.70, paid $2.00 → 30¢ change (quarter + nickel)', () => {
    const { changeCents, pieces } = makeChange(170, 200);
    expect(changeCents).toBe(30);
    expect(pieces.map((p) => [p.cents, p.count])).toEqual([
      [25, 1],
      [5, 1],
    ]);
  });

  test('exact payment → zero change, no pieces', () => {
    const { changeCents, pieces } = makeChange(300, 300);
    expect(changeCents).toBe(0);
    expect(pieces).toEqual([]);
  });

  test('underpaid → negative change, no pieces (button stays locked)', () => {
    const { changeCents, pieces } = makeChange(500, 300);
    expect(changeCents).toBe(-200);
    expect(pieces).toEqual([]);
  });
});

describe('sumCart', () => {
  test('multiplies price by quantity', () => {
    const items = [
      { priceCents: 100, qty: 2 },
      { priceCents: 75, qty: 1 },
    ];
    expect(sumCart(items)).toBe(275);
  });

  test('empty cart is 0', () => {
    expect(sumCart([])).toBe(0);
  });
});

describe('pieceCount', () => {
  test('counts every physical bill/coin', () => {
    expect(pieceCount(breakdown(175))).toBe(4); // 1 dollar + 3 quarters
  });
});

describe('formatDollars', () => {
  test('formats cents to dollars', () => {
    expect(formatDollars(175)).toBe('$1.75');
    expect(formatDollars(0)).toBe('$0.00');
    expect(formatDollars(5)).toBe('$0.05');
    expect(formatDollars(-200)).toBe('-$2.00');
  });
});

describe('dollarsToCents', () => {
  test('parses valid dollar strings', () => {
    expect(dollarsToCents('1.75')).toBe(175);
    expect(dollarsToCents('$2')).toBe(200);
    expect(dollarsToCents('0.05')).toBe(5);
    expect(dollarsToCents('10')).toBe(1000);
  });

  test('rejects invalid input', () => {
    expect(dollarsToCents('')).toBeNull();
    expect(dollarsToCents('abc')).toBeNull();
    expect(dollarsToCents('1.999')).toBeNull();
    expect(dollarsToCents('.')).toBeNull();
  });
});
