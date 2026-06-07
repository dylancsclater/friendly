import { createContext, useContext, useReducer, createElement } from 'react';

// The cart is transient session state — a sale in progress. It lives only in
// memory (never persisted), and resets to empty after each customer.

const CartContext = createContext(null);

function reducer(items, action) {
  switch (action.type) {
    case 'ADD': {
      const found = items.find((i) => i.id === action.product.id);
      if (found) {
        return items.map((i) =>
          i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [...items, { ...action.product, qty: 1 }];
    }
    case 'REMOVE_ONE':
      return items
        .map((i) => (i.id === action.id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0);
    case 'REMOVE_ALL':
      return items.filter((i) => i.id !== action.id);
    case 'CLEAR':
      return [];
    default:
      return items;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, []);
  // createElement instead of JSX so this file can stay .js (no JSX transform).
  return createElement(CartContext.Provider, { value: { items, dispatch } }, children);
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
