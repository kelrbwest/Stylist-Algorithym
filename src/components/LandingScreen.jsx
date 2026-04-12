import { useNavigate } from 'react-router-dom';

export default function LandingScreen() {
  const navigate = useNavigate();

  return (
    <div className="landing-screen">
      <div className="landing-inner">
        <div className="landing-brand">
          <span className="brand-name">INTIMO</span>
          <span className="landing-tagline">Find your perfect fit</span>
        </div>

        <div className="landing-options">
          <button className="landing-card" onClick={() => navigate('/quiz')}>
            <div className="landing-card-icon">✦</div>
            <div className="landing-card-title">Customer Quiz</div>
            <div className="landing-card-desc">Self-guided fitting journey — one question at a time</div>
          </button>

          <button className="landing-card landing-card--secondary" onClick={() => navigate('/stylist')}>
            <div className="landing-card-icon">◈</div>
            <div className="landing-card-title">Stylist Tool</div>
            <div className="landing-card-desc">Quick profile entry for in-store stylist consultations</div>
          </button>
        </div>
      </div>
    </div>
  );
}
