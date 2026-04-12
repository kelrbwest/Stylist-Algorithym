const AGE_OPTIONS = [
  {
    value: 25,
    label: 'Under 35',
    descriptor: 'Youthful & active',
    emoji: '🌿',
  },
  {
    value: 40,
    label: '35 – 49',
    descriptor: 'Confident & established',
    emoji: '✦',
  },
  {
    value: 55,
    label: '50 and over',
    descriptor: 'Sophisticated & relaxed',
    emoji: '◇',
  },
];

export default function AgeStep({ value, onChange, onNext, onBack }) {
  return (
    <div className="quiz-step">
      <button className="quiz-back-btn" onClick={onBack}>← Back</button>
      <p className="quiz-step-eyebrow">Step 1 of 5</p>
      <h2 className="quiz-step-heading">Which best describes you?</h2>
      <p className="quiz-step-sub">We use this to personalise the styles we recommend.</p>

      <div className="quiz-option-cards quiz-option-cards--3">
        {AGE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`quiz-option-card${value === opt.value ? ' selected' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            <span className="quiz-option-icon">{opt.emoji}</span>
            <span className="quiz-option-label">{opt.label}</span>
            <span className="quiz-option-desc">{opt.descriptor}</span>
          </button>
        ))}
      </div>

      <button
        className="quiz-next-btn"
        onClick={onNext}
        disabled={value === null}
      >
        Continue
      </button>
    </div>
  );
}
