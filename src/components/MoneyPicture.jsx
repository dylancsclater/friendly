// Renders the output of breakdown()/makeChange() as actual pictures of bills
// and coins. Reused on the Cart screen ("the total looks like this") and the
// Change screen ("give this back"). Pure presentation — it just draws whatever
// list of pieces it's handed.
export function MoneyPicture({ pieces, size = 'normal' }) {
  if (!pieces || pieces.length === 0) return null;

  return (
    <div className={`money-row money-row--${size}`}>
      {pieces.flatMap((p) =>
        // Render `count` copies of this bill/coin image.
        Array.from({ length: p.count }, (_, i) => (
          <img
            key={`${p.cents}-${i}`}
            src={p.img}
            alt={p.aria}
            title={p.label}
            className={`money-img money-img--${p.cents >= 100 ? 'bill' : 'coin'}`}
            draggable={false}
          />
        )),
      )}
    </div>
  );
}
