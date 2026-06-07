import { useEffect, useState } from 'react';
import { addProduct, updateProduct } from '../../data/db.js';
import { compressImage } from '../../logic/image.js';
import { dollarsToCents, formatDollars } from '../../logic/money.js';

// Add a new product, or edit an existing one. Image is taken from the
// Chromebook camera or a file, compressed, and stored as a Blob.
export function ProductForm({ existing, onSaved, onCancel }) {
  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [priceText, setPriceText] = useState(
    existing ? (existing.priceCents / 100).toFixed(2) : '',
  );
  const [imageBlob, setImageBlob] = useState(existing?.imageBlob ?? null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!imageBlob) return undefined;
    const url = URL.createObjectURL(imageBlob);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageBlob]);

  async function onPickImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setImageBlob(await compressImage(file));
    setBusy(false);
  }

  const priceCents = dollarsToCents(priceText);
  const valid = title.trim() && priceCents !== null && priceCents >= 0;

  async function save() {
    if (!valid) return;
    const data = { title: title.trim(), description: description.trim(), priceCents, imageBlob };
    if (existing) {
      await updateProduct(existing.id, data);
    } else {
      await addProduct(data);
    }
    onSaved();
  }

  return (
    <div className="screen product-form">
      <header className="screen-header">
        <button className="back-link" onClick={onCancel}>← Cancel</button>
        <h1>{existing ? 'Edit product' : 'Add product'}</h1>
      </header>

      <label className="field">
        <span>Picture</span>
        <div className="image-pick">
          {previewUrl ? (
            <img src={previewUrl} alt="" className="image-pick__preview" />
          ) : (
            <div className="image-pick__placeholder">{busy ? 'Processing…' : 'No picture yet'}</div>
          )}
          <input type="file" accept="image/*" capture="environment" onChange={onPickImage} />
        </div>
      </label>

      <label className="field">
        <span>Title</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Apple Juice" />
      </label>

      <label className="field">
        <span>Description (optional)</span>
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Cold, from the fridge" />
      </label>

      <label className="field">
        <span>Price</span>
        <input
          inputMode="decimal"
          value={priceText}
          onChange={(e) => setPriceText(e.target.value)}
          placeholder="1.00"
        />
        {priceText && priceCents === null && <small className="field-error">Enter a price like 1.00</small>}
        {priceCents !== null && <small className="muted">{formatDollars(priceCents)}</small>}
      </label>

      <footer className="screen-footer">
        <button className="primary" onClick={save} disabled={!valid || busy}>
          {existing ? 'Save changes' : 'Add product'}
        </button>
      </footer>
    </div>
  );
}
