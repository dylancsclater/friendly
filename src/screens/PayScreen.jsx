import { useState } from 'react';
import { useCart } from '../state/cart.js';
import { sumCart } from '../logic/change.js';
import { formatDollars, DENOMINATIONS } from '../logic/money.js';
import { BigButton } from '../components/BigButton.jsx';

// Step 3: the student taps the bills and coins the customer handed over.
// A running "paid so far" total fills up; the next button unlocks only once
// the customer has paid enough.
export function PayScreen({ onShowChange, onBack }) {
  const { items } = useCart();
  const total = sumCart(items);
  const [paidCents, setPaidCents] = useState(0);

  const enough = paidCents >= total;

  return (
    <div className="screen pay-screen">
      <header className="screen-header">
        <button className="back-link" onClick={onBack}>← Back</button>
        <h1>Tap the money they gave you</h1>
      </header>

      <div className="pay-status">
        <div>Total: <strong>{formatDollars(total)}</strong></div>
        <div className={enough ? 'paid-ok' : 'paid-short'}>
          Paid: <strong>{formatDollars(paidCents)}</strong>
        </div>
        {!enough && <div className="muted">Need {formatDollars(total - paidCents)} more</div>}
      </div>

      <div className="cash-pad">
        {DENOMINATIONS.map((d) => (
          <button
            key={d.cents}
            className={`cash-button ${d.cents >= 100 ? 'cash-button--bill' : 'cash-button--coin'}`}
            onClick={() => setPaidCents((c) => c + d.cents)}
          >
            <img src={d.img} alt={d.aria} draggable={false} />
            <span>{d.label}</span>
          </button>
        ))}
      </div>

      <footer className="screen-footer">
        <button className="back-link" onClick={() => setPaidCents(0)}>Start over</button>
        <BigButton onClick={() => onShowChange(paidCents)} disabled={!enough}>
          Show Change
        </BigButton>
      </footer>
    </div>
  );
}
