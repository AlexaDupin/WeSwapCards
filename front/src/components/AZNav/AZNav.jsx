export default function AZNav({ onSelect, lettersWithContent = new Set(), className = "" }) {
    const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return (
      <nav className={`az-toolbar ${className}`} role="toolbar" aria-label="Jump to letter">
        {LETTERS.map((L) => (
          <button
            key={L}
            type="button"
            className={`az-pill ${lettersWithContent.has(L) ? "" : "is-empty"}`}
            aria-label={`Jump to ${L}`}
            onClick={() => onSelect(L)}
          >
            {L}
          </button>
        ))}
      </nav>
    );
  }
  