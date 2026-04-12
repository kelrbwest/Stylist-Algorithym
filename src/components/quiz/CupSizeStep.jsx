const CUP_SIZES = ['A', 'B', 'C', 'D', 'DD', 'E', 'EE', 'F', 'FF', 'G'];

export default function CupSizeStep({ value, onChange, onNext, onBack }) {
  return (
    <div className="quiz-step">
      <button className="quiz-back-btn" onClick={onBack}>← Back</button>
      <p className="quiz-step-eyebrow">Step 4 of 5</p>
      <h2 className="quiz-step-heading">What's your cup size?</h2>
      <p className="quiz-step-sub">This is the letter in your bra size — e.g. the C in 34C.</p>

      <div className="quiz-size-grid">
        {CUP_SIZES.map((s) => (
          <button
            key={s}
            className={`quiz-size-chip${value === s ? ' selected' : ''}`}
            onClick={() => onChange(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <button className="quiz-next-btn" onClick={onNext}>
        {value ? 'Continue' : 'Skip'}
      </button>
    </div>
  );
}
