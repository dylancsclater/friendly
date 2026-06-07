// The consistent, large "next" action button used across student screens.
// Keeping it in one place means every screen's primary action looks and
// behaves identically — important for a predictable, low-anxiety flow.
export function BigButton({ children, onClick, disabled = false, variant = 'go' }) {
  return (
    <button
      className={`big-button big-button--${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
