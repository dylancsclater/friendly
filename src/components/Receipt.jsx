import { useEffect, useState } from 'react';
import { formatDollars } from '../logic/money.js';

// Product images live as Blobs in IndexedDB; turn the Blob into a temporary
// object URL for display and revoke it on cleanup (same pattern as ProductTile).
function ReceiptItemImage({ blob }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!blob) return undefined;
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [blob]);

  if (!url) {
    return <div className="receipt__item-img receipt__item-img--placeholder">🛍️</div>;
  }
  return <img src={url} alt="" className="receipt__item-img" />;
}

// A plain, ink-friendly order summary. Hidden on screen (see .receipt in the
// stylesheet) and revealed only for printing via the @media print rules, so the
// teacher/student can print a paper record of the sale at the end. Each line
// shows a large product picture beside its text.
export function Receipt({ items, totalCents, paidCents, changeCents, dateLabel }) {
  return (
    <div className="receipt">
      <h2 className="receipt__store">School Store</h2>
      <p className="receipt__date">{dateLabel}</p>

      <ul className="receipt__items">
        {items.map((item) => (
          <li key={item.id} className="receipt__item">
            <ReceiptItemImage blob={item.imageBlob} />
            <span className="receipt__item-title">{item.title}</span>
            <span className="receipt__item-qty">×{item.qty}</span>
            <span className="receipt__item-price">
              {formatDollars(item.priceCents * item.qty)}
            </span>
          </li>
        ))}
      </ul>

      <dl className="receipt__totals">
        <div>
          <dt>Total</dt>
          <dd>{formatDollars(totalCents)}</dd>
        </div>
        <div>
          <dt>Paid</dt>
          <dd>{formatDollars(paidCents)}</dd>
        </div>
        <div className="receipt__change">
          <dt>Change</dt>
          <dd>{formatDollars(changeCents)}</dd>
        </div>
      </dl>

      <p className="receipt__thanks">Thank you! 🌱</p>
    </div>
  );
}
