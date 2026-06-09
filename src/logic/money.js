// Money is ALWAYS represented as integer cents. Never use floats for math.
// Dollars are produced only at the moment of display.

// Denominations as integer cents, largest -> smallest. US currency.
// `img` points at a picture in /public/money/. `aria` is spoken/alt text.
export const DENOMINATIONS = [
  { cents: 2000, label: '$20', img: '/money/2000.png', aria: 'twenty dollar bill' },
  { cents: 1000, label: '$10', img: '/money/1000.png', aria: 'ten dollar bill' },
  { cents: 500,  label: '$5',  img: '/money/500.png',  aria: 'five dollar bill' },
  { cents: 100,  label: '$1',  img: '/money/100.png',  aria: 'one dollar bill' },
  { cents: 25,   label: '25¢', img: '/money/25.png',   aria: 'quarter' },
  { cents: 10,   label: '10¢', img: '/money/10.png',   aria: 'dime' },
  { cents: 5,    label: '5¢',  img: '/money/5.png',    aria: 'nickel' },
  { cents: 1,    label: '1¢',  img: '/money/1.png',    aria: 'penny' },
];

// Quick lookup by cents value (e.g. when the student taps a $1 button).
export const DENOM_BY_CENTS = Object.fromEntries(
  DENOMINATIONS.map((d) => [d.cents, d]),
);

// Display only — never do arithmetic on this string.
export function formatDollars(cents) {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  return `${sign}$${(abs / 100).toFixed(2)}`;
}

// Parse a dollars string like "1.75" into integer cents. Used by the teacher
// product form. Returns null if it isn't a valid non-negative amount.
export function dollarsToCents(input) {
  if (typeof input !== 'string') input = String(input ?? '');
  const trimmed = input.trim().replace(/^\$/, '');
  if (!/^\d*(\.\d{0,2})?$/.test(trimmed) || trimmed === '' || trimmed === '.') {
    return null;
  }
  return Math.round(parseFloat(trimmed) * 100);
}
