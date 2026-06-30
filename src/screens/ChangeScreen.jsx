import { useState } from 'react';
import { useCart } from '../state/cart.js';
import { sumCart, makeChange } from '../logic/change.js';
import { formatDollars } from '../logic/money.js';
import { MoneyPicture } from '../components/MoneyPicture.jsx';
import { Receipt } from '../components/Receipt.jsx';
import { BigButton } from '../components/BigButton.jsx';

// Step 4 — the payoff: show exactly which bills and coins to hand back,
// as pictures the student can match piece for piece.
export function ChangeScreen({ paidCents, onDone }) {
  const { items, dispatch } = useCart();
  const total = sumCart(items);
  const { changeCents, pieces } = makeChange(total, paidCents);

  // Stamp the sale once when this screen mounts so the printed receipt shows a
  // stable time even across re-renders.
  const [dateLabel] = useState(() =>
    new Date().toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
  );

  function finish() {
    dispatch({ type: 'CLEAR' });
    onDone();
  }

  return (
    <div className="screen change-screen">
      <h1>Give back:</h1>
      <div className="change-amount">{formatDollars(changeCents)}</div>

      {changeCents === 0 ? (
        <p className="change-none">No change — all done! 🎉</p>
      ) : (
        <MoneyPicture pieces={pieces} size="large" />
      )}

      <footer className="screen-footer">
        <button className="back-link" onClick={() => window.print()}>
          🖨️ Print order
        </button>
        <BigButton onClick={finish}>Done — Next Customer</BigButton>
      </footer>

      {/* Hidden on screen; rendered to paper by the @media print rules. */}
      <Receipt
        items={items}
        totalCents={total}
        paidCents={paidCents}
        changeCents={changeCents}
        dateLabel={dateLabel}
      />
    </div>
  );
}
