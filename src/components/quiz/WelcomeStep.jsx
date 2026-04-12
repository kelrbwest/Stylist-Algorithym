export default function WelcomeStep({ onNext }) {
  return (
    <div className="quiz-step quiz-step--welcome">
      <div className="quiz-welcome-content">
        <p className="quiz-welcome-eyebrow">INTIMO FITME</p>
        <h1 className="quiz-welcome-heading">Welcome to your<br />personal fit journey</h1>
        <p className="quiz-welcome-body">
          Answer 5 quick questions and we'll build your personalised capsule wardrobe of styles — chosen just for your body.
        </p>
        <button className="quiz-start-btn" onClick={onNext}>
          Let's begin
        </button>
        <p className="quiz-welcome-hint">Takes less than 2 minutes</p>
      </div>
    </div>
  );
}
