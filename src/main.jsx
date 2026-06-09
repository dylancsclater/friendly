import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Kid-friendly fonts, bundled locally: Fredoka (rounded, playful) for headings
// and buttons; Nunito (very legible) for body text.
import '@fontsource/fredoka/500.css';
import '@fontsource/fredoka/600.css';
import '@fontsource/fredoka/700.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import App from './App.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
