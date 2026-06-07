import { useEffect, useState } from 'react';
import { formatDollars } from '../logic/money.js';

// A single tappable product in the Shop grid: picture + title + price.
// Product images are stored as Blobs in IndexedDB, so we turn the Blob into a
// temporary object URL for display and revoke it on cleanup to avoid leaks.
export function ProductTile({ product, onTap }) {
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    if (!product.imageBlob) return undefined;
    const url = URL.createObjectURL(product.imageBlob);
    setImgUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [product.imageBlob]);

  return (
    <button className="product-tile" onClick={() => onTap(product)}>
      <div className="product-tile__img-wrap">
        {imgUrl ? (
          <img src={imgUrl} alt="" className="product-tile__img" draggable={false} />
        ) : (
          <div className="product-tile__img product-tile__img--placeholder">🛍️</div>
        )}
      </div>
      <div className="product-tile__title">{product.title}</div>
      <div className="product-tile__price">{formatDollars(product.priceCents)}</div>
    </button>
  );
}
