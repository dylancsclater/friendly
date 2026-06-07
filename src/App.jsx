import { useState } from 'react';
import { CartProvider } from './state/cart.js';
import { ShopScreen } from './screens/ShopScreen.jsx';
import { CartScreen } from './screens/CartScreen.jsx';
import { PayScreen } from './screens/PayScreen.jsx';
import { ChangeScreen } from './screens/ChangeScreen.jsx';
import { PinGate } from './screens/teacher/PinGate.jsx';
import { ProductList } from './screens/teacher/ProductList.jsx';

// Simple screen router. The whole app is one of these named screens at a time —
// no URLs, no history — which keeps the student flow strictly linear and
// impossible to get lost in.
const SCREENS = {
  SHOP: 'SHOP',
  CART: 'CART',
  PAY: 'PAY',
  CHANGE: 'CHANGE',
  TEACHER_PIN: 'TEACHER_PIN',
  TEACHER_PRODUCTS: 'TEACHER_PRODUCTS',
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.SHOP);
  const [paidCents, setPaidCents] = useState(0);

  return (
    <CartProvider>
      {screen === SCREENS.SHOP && (
        <ShopScreen
          onCheckout={() => setScreen(SCREENS.CART)}
          onOpenTeacher={() => setScreen(SCREENS.TEACHER_PIN)}
        />
      )}

      {screen === SCREENS.CART && (
        <CartScreen
          onPay={() => setScreen(SCREENS.PAY)}
          onBack={() => setScreen(SCREENS.SHOP)}
        />
      )}

      {screen === SCREENS.PAY && (
        <PayScreen
          onShowChange={(paid) => { setPaidCents(paid); setScreen(SCREENS.CHANGE); }}
          onBack={() => setScreen(SCREENS.CART)}
        />
      )}

      {screen === SCREENS.CHANGE && (
        <ChangeScreen
          paidCents={paidCents}
          onDone={() => { setPaidCents(0); setScreen(SCREENS.SHOP); }}
        />
      )}

      {screen === SCREENS.TEACHER_PIN && (
        <PinGate
          onUnlock={() => setScreen(SCREENS.TEACHER_PRODUCTS)}
          onCancel={() => setScreen(SCREENS.SHOP)}
        />
      )}

      {screen === SCREENS.TEACHER_PRODUCTS && (
        <ProductList onExit={() => setScreen(SCREENS.SHOP)} />
      )}
    </CartProvider>
  );
}
