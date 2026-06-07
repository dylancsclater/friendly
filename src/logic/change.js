import { DENOMINATIONS } from './money.js';

// Greedy breakdown of an amount into bills/coins.
// Returns e.g. for 175 cents:
//   [{ cents:100, label:'$1', img, aria, count:1 },
//    { cents:25,  label:'25¢', img, aria, count:3 }]
// Greedy is provably optimal for standard US denominations.
export function breakdown(amountCents) {
  let remaining = Math.max(0, Math.round(amountCents));
  const pieces = [];
  for (const denom of DENOMINATIONS) {
    const count = Math.floor(remaining / denom.cents);
    if (count > 0) {
      pieces.push({ ...denom, count });
      remaining -= count * denom.cents;
    }
  }
  return pieces;
}

// Total number of physical pieces in a breakdown (handy for layout decisions).
export function pieceCount(pieces) {
  return pieces.reduce((n, p) => n + p.count, 0);
}

// Sum a cart of { priceCents, qty } items into total cents.
export function sumCart(cartItems) {
  return cartItems.reduce((total, item) => total + item.priceCents * item.qty, 0);
}

// What to hand back as change.
// Returns { changeCents, pieces }. If underpaid, changeCents is negative and
// `pieces` is empty — the UI uses the sign to keep the "Show change" button locked.
export function makeChange(totalCents, paidCents) {
  const changeCents = paidCents - totalCents;
  return {
    changeCents,
    pieces: changeCents > 0 ? breakdown(changeCents) : [],
  };
}
