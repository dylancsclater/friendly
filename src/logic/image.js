// Shrinks an uploaded/camera image down to a sensible size before we store it
// in IndexedDB. Keeps the device fast and the database small — a teacher's
// phone photo can be several MB; product tiles only need ~600px.
export async function compressImage(file, maxSize = 600, quality = 0.8) {
  const bitmap = await createImageBitmap(file);

  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality);
  });
}
