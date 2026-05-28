import React from "react";

function TallyCard({ name, count, onIncrement, onDecrement, maxCount = 300 }) {
  const isMin = count <= 0;
  const isMax = count >= maxCount;

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
          disabled={isMax}
          aria-label={`Increase ${name}`}
        >
          +
        </button>
        <button
          className="action-btn"
          onClick={onDecrement}
          disabled={isMin}
          aria-label={`Decrease ${name}`}
        >
          -
        </button>
      </div>
    </article>
  );
}

export default TallyCard;
