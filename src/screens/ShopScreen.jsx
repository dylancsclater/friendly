import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getProducts } from '../data/db.js';
import { useCart } from '../state/cart.js';
import { sumCart } from '../logic/change.js';
import { formatDollars } from '../logic/money.js';
import { ProductTile } from '../components/ProductTile.jsx';
import { BigButton } from '../components/BigButton.jsx';

// Roughly how tall a tile is relative to its width (square image + title + price).
// Used to bias the column count toward pleasantly-proportioned tiles.
const TILE_ASPECT = 1.35;
const GRID_GAP = 16;

// Pick the column count that lets all `count` tiles fill the WxH box at the
// largest possible size while staying close to TILE_ASPECT. This is what keeps
// everything on a single page: more products -> smaller tiles, never a scroll.
function bestColumns(count, width, height) {
  if (count <= 0 || width <= 0 || height <= 0) return 1;
  let bestCols = 1;
  let bestSize = 0;
  for (let cols = 1; cols <= count; cols++) {
    const rows = Math.ceil(count / cols);
    const tileW = (width - GRID_GAP * (cols - 1)) / cols;
    const tileH = (height - GRID_GAP * (rows - 1)) / rows;
    const size = Math.min(tileW, tileH / TILE_ASPECT);
    if (size > bestSize) {
      bestSize = size;
      bestCols = cols;
    }
  }
  return bestCols;
}

// Measure the grid container and recompute the best column count whenever it
// resizes or the number of products changes.
function useGridColumns(count) {
  const ref = useRef(null);
  const [cols, setCols] = useState(1);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => setCols(bestColumns(count, el.clientWidth, el.clientHeight));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [count]);

  return [ref, cols];
}

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

  const [gridRef, cols] = useGridColumns(products.length);
  const rows = products.length ? Math.ceil(products.length / cols) : 1;

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
        <div
          ref={gridRef}
          className="product-grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
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
