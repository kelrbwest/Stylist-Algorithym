const BAND_SIZES = ['30', '32', '34', '36', '38', '40', '42', '44', '46'];

export default function BandSizeStep({ value, onChange, onNext, onBack }) {
  return (
    <div className="quiz-step">
      <button className="quiz-back-btn" onClick={onBack}>← Back</button>
      <p className="quiz-step-eyebrow">Step 3 of 5</p>
      <h2 className="quiz-step-heading">What's your bra band size?</h2>
      <p className="quiz-step-sub">This is the number in your bra size — e.g. the 34 in 34C.</p>

      <div className="quiz-size-grid">
        {BAND_SIZES.map((s) => (
          <button
            key={s}
            className={`quiz-size-chip${value === s ? ' selected' : ''}`}
            onClick={() => onChange(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <button className="quiz-skip-btn" onClick={() => { onChange(''); onNext(); }}>
        Not sure — skip
      </button>

      <button
        className="quiz-next-btn"
        onClick={onNext}
      >
        {value ? 'Continue' : 'Skip'}
      </button>
    </div>
  );
}
