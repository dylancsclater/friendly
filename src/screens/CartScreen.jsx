import { useCart } from '../state/cart.js';
import { sumCart, breakdown } from '../logic/change.js';
import { formatDollars } from '../logic/money.js';
import { MoneyPicture } from '../components/MoneyPicture.jsx';
import { BigButton } from '../components/BigButton.jsx';

// Step 2: review the cart and see the total — shown as a number AND as a
// picture of the bills/coins that make it, so the amount feels concrete.
export function CartScreen({ onPay, onBack }) {
  const { items, dispatch } = useCart();
  const total = sumCart(items);

  return (
    <div className="screen cart-screen">
      <header className="screen-header">
        <button className="back-link" onClick={onBack}>← Back</button>
        <h1>Cart</h1>
      </header>

      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.id} className="cart-item">
            <span className="cart-item__title">{item.title}</span>
            <span className="cart-item__qty">×{item.qty}</span>
            <span className="cart-item__price">{formatDollars(item.priceCents * item.qty)}</span>
            <button
              className="cart-item__remove"
              onClick={() => dispatch({ type: 'REMOVE_ONE', id: item.id })}
              aria-label={`Remove one ${item.title}`}
            >
              −
            </button>
          </li>
        ))}
      </ul>

      <div className="total-block">
        <div className="total-amount">{formatDollars(total)}</div>
        <p className="muted">That looks like:</p>
        <MoneyPicture pieces={breakdown(total)} />
      </div>

      <footer className="screen-footer">
        <BigButton onClick={onPay} disabled={total === 0}>
          Customer Pays
        </BigButton>
      </footer>
    </div>
  );
}
