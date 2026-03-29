import { useState, useMemo, useEffect } from 'react';
import { mapAge, getAvailableFirmness, AGE_TO_TISSUE } from '../utils/recommend';

const BAND_SIZES = ['30','32','34','36','38','40','42','44','46'];
const CUP_SIZES = ['A','B','C','D','DD','E','EE','F','FF','G'];
const FIRMNESS_OPTIONS = ['Firm', 'Medium', 'Soft'];
const AGE_GROUPS = [25, 40, 55];
const AGE_GROUP_LABELS = { 25: 'Under 35', 40: '35–49', 55: '50+' };

export default function CustomerForm({ onSubmit }) {
  const [ageInput, setAgeInput] = useState('');
  const [useAgeGroup, setUseAgeGroup] = useState(false);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(40);
  const [bandSize, setBandSize] = useState('');
  const [cupSize, setCupSize] = useState('');
  const [bodyFirmness, setBodyFirmness] = useState('');
  const [error, setError] = useState('');

  // Derive age group from whichever input mode is active
  const derivedAgeGroup = useAgeGroup ? selectedAgeGroup : mapAge(ageInput);

  // Breast tissue is a label derived from age — not user-selectable
  const derivedTissue = derivedAgeGroup ? AGE_TO_TISSUE[derivedAgeGroup] : null;

  const availableFirmness = useMemo(() => {
    if (!derivedAgeGroup) return null;
    return getAvailableFirmness(derivedAgeGroup);
  }, [derivedAgeGroup]);

  useEffect(() => {
    if (availableFirmness && bodyFirmness && !availableFirmness.has(bodyFirmness)) {
      setBodyFirmness('');
    }
  }, [availableFirmness]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    let ageGroup;
    if (useAgeGroup) {
      ageGroup = selectedAgeGroup;
    } else {
      ageGroup = mapAge(ageInput);
      if (!ageGroup) {
        setError('Please enter a valid age.');
        return;
      }
    }

    if (!bodyFirmness) {
      setError('Please select a body firmness.');
      return;
    }

    onSubmit({ ageGroup, bandSize, cupSize, bodyFirmness });
  };

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      <h2>Customer Profile</h2>

      {/* Age */}
      <div className="field-group">
        <label className="field-label">Customer Age</label>
        <div className="age-toggle">
          <button
            type="button"
            className={`toggle-btn${!useAgeGroup ? ' active' : ''}`}
            onClick={() => setUseAgeGroup(false)}
          >
            Enter Age
          </button>
          <button
            type="button"
            className={`toggle-btn${useAgeGroup ? ' active' : ''}`}
            onClick={() => setUseAgeGroup(true)}
          >
            Select Age Group
          </button>
        </div>

        {!useAgeGroup ? (
          <input
            type="number"
            className="text-input"
            placeholder="e.g. 42"
            value={ageInput}
            min={16}
            max={99}
            onChange={(e) => setAgeInput(e.target.value)}
          />
        ) : (
          <div className="chip-group">
            {AGE_GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                className={`chip${selectedAgeGroup === g ? ' selected' : ''}`}
                onClick={() => setSelectedAgeGroup(g)}
              >
                {AGE_GROUP_LABELS[g]}
              </button>
            ))}
          </div>
        )}

        {!useAgeGroup && ageInput && (
          <p className="age-hint">
            Maps to age group: <strong>{mapAge(ageInput) ? AGE_GROUP_LABELS[mapAge(ageInput)] : '—'}</strong>
          </p>
        )}
      </div>

      {/* Breast Tissue — derived from age, display only */}
      {derivedTissue && (
        <div className="field-group">
          <label className="field-label">Breast Tissue Type</label>
          <span className="tissue-badge">{derivedTissue}</span>
        </div>
      )}

      {/* Band & Cup */}
      <div className="field-row">
        <div className="field-group">
          <label className="field-label">Band Size</label>
          <select
            className="select-input"
            value={bandSize}
            onChange={(e) => setBandSize(e.target.value)}
          >
            <option value="">Select…</option>
            {BAND_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="field-group">
          <label className="field-label">Cup Size</label>
          <select
            className="select-input"
            value={cupSize}
            onChange={(e) => setCupSize(e.target.value)}
          >
            <option value="">Select…</option>
            {CUP_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Body Firmness */}
      <div className="field-group">
        <label className="field-label">Body Firmness</label>
        <div className="chip-group">
          {FIRMNESS_OPTIONS.map((t) => {
            const isDisabled = availableFirmness !== null && !availableFirmness.has(t);
            return (
              <button
                key={t}
                type="button"
                className={`chip${bodyFirmness === t ? ' selected' : ''}${isDisabled ? ' disabled' : ''}`}
                disabled={isDisabled}
                onClick={() => !isDisabled && setBodyFirmness(t)}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <button type="submit" className="submit-btn">Find Best Styles</button>
    </form>
  );
}
