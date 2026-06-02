import { useEffect, useRef, useState } from "react";

function TallyCard({
  name,
  count,
  onIncrement,
  onDecrement,
  onRequestDelete,
  isLocked = false,
  isCustom = false,
  maxCount = 300,
}) {
  const isMin = count <= 0;
  const isMax = count >= maxCount;
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef(null);

  useEffect(() => {
    if (!isThemeMenuOpen) return;

    const handleClickOutside = (event) => {
      if (!themeMenuRef.current) return;
      if (!themeMenuRef.current.contains(event.target)) {
        setIsThemeMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsThemeMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isThemeMenuOpen]);

  const handleRemoveTheme = () => {
    setIsThemeMenuOpen(false);
    onRequestDelete();
  };

  return (
    <article className="tally-card">
      <div className="tally-label">
        <p className="tally-text">
          {name}: <span className="tally-count">{count}</span>
        </p>
      </div>

      <div className="tally-actions">
        <button
          className="action-btn"
          onClick={onIncrement}
          disabled={isLocked || isMax}
          aria-label={`Increase ${name}`}
        >
          +
        </button>
        <button
          className="action-btn"
          onClick={onDecrement}
          disabled={isLocked || isMin}
          aria-label={`Decrease ${name}`}
        >
          -
        </button>
        {isCustom ? (
          <div className="theme-menu-wrap" ref={themeMenuRef}>
            <button
              className="delete-theme-btn"
              onClick={() => setIsThemeMenuOpen((prev) => !prev)}
              aria-label={`Theme options for ${name}`}
              aria-expanded={isThemeMenuOpen}
              type="button"
              disabled={isLocked}
            >
              ⋮
            </button>
            {isThemeMenuOpen ? (
              <div className="theme-card-menu" role="menu" aria-label={`Options for ${name}`}>
                <button type="button" className="theme-card-item" onClick={handleRemoveTheme}>
                  Remove Theme
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default TallyCard;
