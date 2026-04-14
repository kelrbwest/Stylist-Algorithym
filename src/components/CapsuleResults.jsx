import { useState } from 'react';
import BraCard from './BraCard';
import { CAPSULES, AGE_TO_TISSUE } from '../utils/recommend';

const AGE_GROUP_LABELS = { 25: 'Under 35', 40: '35–49', 55: '50+' };

export default function CapsuleResults({ recommendations, profile, onReset }) {
  const { ageGroup, bandSize, cupSize, bodyFirmness } = profile;
  const breastTissue = AGE_TO_TISSUE[ageGroup];
  const [viewMode, setViewMode] = useState('flatlay');

  return (
    <div className="results-container">
      <div className="results-header">
        <div>
          <h2>Your Capsule Solution</h2>
          <p className="profile-summary">
            {bandSize && cupSize ? `${bandSize}${cupSize} · ` : ''}
            Age group: {AGE_GROUP_LABELS[ageGroup]} ·
            Tissue: {breastTissue} ·
            Firmness: {bodyFirmness}
          </p>
        </div>
        <div className="results-actions">
          <button className="reset-btn" onClick={onReset}>New Profile</button>
          <button className="print-btn" onClick={() => window.print()}>Print / Save PDF</button>
        </div>
      </div>

      {/* View toggle + Add Capsule to Cart */}
      <div className="results-toolbar">
        <div className="view-toggle">
          <span className="view-toggle-label">View:</span>
          <button
            className={`view-toggle-btn${viewMode === 'flatlay' ? ' active' : ''}`}
            onClick={() => setViewMode('flatlay')}
          >
            Flat Lay
          </button>
          <button
            className={`view-toggle-btn${viewMode === 'model' ? ' active' : ''}`}
            onClick={() => setViewMode('model')}
          >
            On Model
          </button>
        </div>
        <button className="cart-btn" onClick={() => {}}>
          Add Capsule to Cart
        </button>
      </div>

      {CAPSULES.map(({ key, label }) => {
        const items = recommendations[key] || [];
        return (
          <section key={key} className="capsule-section">
            <h3 className="capsule-heading">{label}</h3>
            {items.length === 0 ? (
              <p className="no-results">No recommendations for this profile in {label}.</p>
            ) : (
              <div className="cards-grid">
                {items.map((entry, i) => (
                  <BraCard key={entry.style} entry={entry} rank={i + 1} viewMode={viewMode} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
