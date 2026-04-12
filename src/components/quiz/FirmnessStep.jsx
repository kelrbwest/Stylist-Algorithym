import { useMemo } from 'react';
import { AGE_TO_TISSUE, getAvailableFirmness } from '../../utils/recommend';

const FIRMNESS_OPTIONS = [
  {
    value: 'Firm',
    label: 'Firm',
    descriptor: 'Toned & athletic feel',
    detail: 'Your body feels firm and well-supported naturally.',
    emoji: '◆',
  },
  {
    value: 'Medium',
    label: 'Medium',
    descriptor: 'Balanced & versatile',
    detail: 'A comfortable mix — not too firm, not too soft.',
    emoji: '◈',
  },
  {
    value: 'Soft',
    label: 'Soft',
    descriptor: 'Relaxed & gentle',
    detail: 'Your body has a softer, more relaxed feel.',
    emoji: '○',
  },
];

export default function FirmnessStep({ ageGroup, value, onChange, onNext, onBack }) {
  const tissue = AGE_TO_TISSUE[ageGroup];

  const available = useMemo(() => {
    if (!ageGroup) return new Set(['Firm', 'Medium', 'Soft']);
    return getAvailableFirmness(ageGroup);
  }, [ageGroup]);

  return (
    <div className="quiz-step">
      <button className="quiz-back-btn" onClick={onBack}>← Back</button>
      <p className="quiz-step-eyebrow">Step 2 of 5</p>
      <h2 className="quiz-step-heading">How would you describe your body?</h2>
      <p className="quiz-step-sub">Think about how your body feels overall — there's no wrong answer.</p>

      {tissue && (
        <p className="quiz-tissue-note">
          Based on your age, your breast tissue type is <strong>{tissue}</strong>.
        </p>
      )}

      <div className="quiz-option-cards quiz-option-cards--3">
        {FIRMNESS_OPTIONS.map((opt) => {
          const disabled = !available.has(opt.value);
          return (
            <button
              key={opt.value}
              className={`quiz-option-card${value === opt.value ? ' selected' : ''}${disabled ? ' disabled' : ''}`}
              onClick={() => !disabled && onChange(opt.value)}
              disabled={disabled}
            >
              <span className="quiz-option-icon">{opt.emoji}</span>
              <span className="quiz-option-label">{opt.label}</span>
              <span className="quiz-option-desc">{opt.descriptor}</span>
              <span className="quiz-option-detail">{opt.detail}</span>
            </button>
          );
        })}
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
