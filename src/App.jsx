import { useState } from 'react';
import CustomerForm from './components/CustomerForm';
import CapsuleResults from './components/CapsuleResults';
import { getRecommendations } from './utils/recommend';
import './App.css';

export default function App() {
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
          <span className="brand-name">INTIMO</span>
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
