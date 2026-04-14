export default function WelcomeStep({ onNext }) {
  return (
    <div className="quiz-step quiz-step--welcome">
      <div className="quiz-welcome-content">
        <p className="quiz-welcome-eyebrow">YOUR TOP DRAWER SOLUTION</p>
        <h1 className="quiz-welcome-heading">The Intimo<br />Lingerie Capsule</h1>
        <p className="quiz-welcome-body">
          Since 1995 we've been focused on providing women with comfortable,
          supportive and beautiful bras that simply make them feel good.
        </p>
        <p className="quiz-welcome-body">
          Our unique Lingerie Capsule Solution provides you with a considered set of
          bras and briefs to ensure an effortless approach to everyday dressing across
          six key categories.
        </p>
        <div className="quiz-welcome-categories">
          <span>Everyday</span>
          <span>Lace</span>
          <span>Active</span>
          <span>Strapless</span>
          <span>Cami</span>
          <span>Lounge</span>
        </div>
        <p className="quiz-welcome-body quiz-welcome-body--small">
          Gone are the days of forfeiting outfits because you don't have the right bra to wear beneath.
          Answer a few quick questions and we'll build your personalised capsule solution.
        </p>
        <button className="quiz-start-btn" onClick={onNext}>
          Discover Your Capsule
        </button>
        <p className="quiz-welcome-hint">Takes less than 2 minutes</p>
      </div>
    </div>
  );
}
