import { useState } from 'react';
import { getSetting } from '../../data/db.js';

// Keeps students out of the teacher area with a simple PIN. Not high security —
// just enough that a curious student can't wander into product editing.
export function PinGate({ onUnlock, onCancel }) {
  const [entry, setEntry] = useState('');
  const [error, setError] = useState(false);

  async function check(next) {
    const pin = await getSetting('teacherPin');
    if (next === String(pin)) {
      onUnlock();
    } else {
      setError(true);
      setEntry('');
    }
  }

  function press(digit) {
    setError(false);
    const next = (entry + digit).slice(0, 4);
    setEntry(next);
    if (next.length === 4) check(next);
  }

  return (
    <div className="screen pin-gate">
      <header className="screen-header">
        <button className="back-link" onClick={onCancel}>← Back to store</button>
        <h1>Teacher PIN</h1>
      </header>

      <div className={`pin-dots ${error ? 'pin-dots--error' : ''}`}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`pin-dot ${i < entry.length ? 'pin-dot--filled' : ''}`} />
        ))}
      </div>
      {error && <p className="pin-error">Wrong PIN — try again</p>}

      <div className="pin-pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button key={n} className="pin-key" onClick={() => press(String(n))}>{n}</button>
        ))}
        <button className="pin-key pin-key--back" onClick={() => setEntry((e) => e.slice(0, -1))}>⌫</button>
        <button className="pin-key" onClick={() => press('0')}>0</button>
      </div>
    </div>
  );
}
