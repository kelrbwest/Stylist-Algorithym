export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="quiz-progress">
      <div className="quiz-progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
