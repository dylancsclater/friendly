import { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../../data/db.js';
import { formatDollars } from '../../logic/money.js';
import { ProductForm } from './ProductForm.jsx';

// Teacher's product manager: list, add, edit, delete.
export function ProductList({ onExit }) {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null); // null = list view, {} = new, {id..} = edit

  async function refresh() {
    setProducts(await getProducts());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function remove(id, title) {
    if (confirm(`Remove "${title}"?`)) {
      await deleteProduct(id);
      refresh();
    }
  }

  if (editing !== null) {
    return (
      <ProductForm
        existing={editing.id ? editing : null}
        onSaved={() => { setEditing(null); refresh(); }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="screen product-list">
      <header className="screen-header">
        <button className="back-link" onClick={onExit}>← Done</button>
        <h1>Products</h1>
        <button className="primary" onClick={() => setEditing({})}>+ Add</button>
      </header>

      {products.length === 0 ? (
        <p className="muted">No products yet. Tap “+ Add” to create one.</p>
      ) : (
        <ul className="admin-list">
          {products.map((p) => (
            <li key={p.id} className="admin-row">
              <span className="admin-row__title">{p.title}</span>
              <span className="admin-row__price">{formatDollars(p.priceCents)}</span>
              <button onClick={() => setEditing(p)}>Edit</button>
              <button className="danger" onClick={() => remove(p.id, p.title)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
