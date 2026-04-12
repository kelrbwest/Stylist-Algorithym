import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import CustomerForm from './components/CustomerForm';
import CapsuleResults from './components/CapsuleResults';
import LandingScreen from './components/LandingScreen';
import QuizFlow from './components/quiz/QuizFlow';
import { getRecommendations } from './utils/recommend';
import './App.css';

function StylistTool() {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [profile, setProfile] = useState(null);

  const handleSubmit = (formData) => {
    const recs = getRecommendations({
      ageGroup: formData.ageGroup,
      bodyFirmness: formData.bodyFirmness,
    });
    setProfile(formData);
    setResults(recs);
  };

  const handleReset = () => {
    setResults(null);
    setProfile(null);
  };

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="header-inner">
          <span className="brand-name" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>INTIMO</span>
          <span className="brand-tagline">Fitme Stylist Tool</span>
        </div>
      </header>

      <main className="app-main">
        {!results ? (
          <CustomerForm onSubmit={handleSubmit} />
        ) : (
          <CapsuleResults
            recommendations={results}
            profile={profile}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>© Intimo — Stylist Use Only</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingScreen />} />
      <Route path="/stylist" element={<StylistTool />} />
      <Route path="/quiz/*" element={<QuizFlow />} />
    </Routes>
  );
}
