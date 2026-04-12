import { useEffect } from 'react';

export default function TransitionStep({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2200);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="quiz-step quiz-step--transition">
      <div className="quiz-transition-content">
        <div className="quiz-transition-dots">
          <span /><span /><span />
        </div>
        <p className="quiz-transition-text">Finding your perfect styles…</p>
      </div>
    </div>
  );
}
