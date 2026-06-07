import { useEffect, useState } from 'react';
import { getProducts } from '../data/db.js';
import { useCart } from '../state/cart.js';
import { sumCart } from '../logic/change.js';
import { formatDollars } from '../logic/money.js';
import { ProductTile } from '../components/ProductTile.jsx';
import { BigButton } from '../components/BigButton.jsx';

// Step 1 of the sale: tap products to fill the cart.
export function ShopScreen({ onCheckout, onOpenTeacher }) {
  const { items, dispatch } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((p) => {
      setProducts(p);
      setLoading(false);
    });
  }, []);

  const total = sumCart(items);
  const cartCount = items.reduce((n, i) => n + i.qty, 0);

  return (
    <div className="screen shop-screen">
      <header className="shop-header">
        <h1>Tap what they want</h1>
        <button className="teacher-link" onClick={onOpenTeacher} aria-label="Teacher menu">
          ⚙️
        </button>
      </header>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <p>No products yet.</p>
          <p className="muted">Tap ⚙️ to add some in the Teacher menu.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductTile key={p.id} product={p} onTap={(prod) => dispatch({ type: 'ADD', product: prod })} />
          ))}
        </div>
      )}

      <footer className="cart-bar">
        <div className="cart-bar__summary">
          🛒 {cartCount} item{cartCount === 1 ? '' : 's'} · {formatDollars(total)}
        </div>
        <BigButton onClick={onCheckout} disabled={cartCount === 0}>
          Check Out
        </BigButton>
      </footer>
    </div>
  );
}
