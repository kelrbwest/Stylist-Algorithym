import { useState } from 'react';

export default function CustomerDetailsStep({ value, onChange, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const update = (field, val) => {
    onChange({ ...value, [field]: val });
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!value.firstName?.trim()) e.firstName = 'First name is required';
    if (!value.lastName?.trim()) e.lastName = 'Last name is required';
    if (!value.email?.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim())) e.email = 'Please enter a valid email';
    if (!value.mobile?.trim()) e.mobile = 'Mobile is required';
    if (!value.postCode?.trim()) e.postCode = 'Post code is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onNext();
  };

  return (
    <div className="quiz-step">
      <button className="quiz-back-btn" onClick={onBack}>← Back</button>
      <p className="quiz-step-eyebrow">Step 5 of 5</p>
      <h2 className="quiz-step-heading">Almost there — let's get to know you</h2>
      <p className="quiz-step-sub">
        Enter your details below to see your personalised Intimo Capsule Solution.
        Your information is safe with us and will only be used to enhance your experience.
      </p>

      <div className="quiz-form-fields">
        <div className="quiz-form-row">
          <div className="quiz-field">
            <label className="quiz-field-label">First Name *</label>
            <input
              type="text"
              className={`quiz-field-input${errors.firstName ? ' error' : ''}`}
              placeholder="First name"
              value={value.firstName || ''}
              onChange={(e) => update('firstName', e.target.value)}
            />
            {errors.firstName && <span className="quiz-field-error">{errors.firstName}</span>}
          </div>
          <div className="quiz-field">
            <label className="quiz-field-label">Last Name *</label>
            <input
              type="text"
              className={`quiz-field-input${errors.lastName ? ' error' : ''}`}
              placeholder="Last name"
              value={value.lastName || ''}
              onChange={(e) => update('lastName', e.target.value)}
            />
            {errors.lastName && <span className="quiz-field-error">{errors.lastName}</span>}
          </div>
        </div>

        <div className="quiz-field">
          <label className="quiz-field-label">Email *</label>
          <input
            type="email"
            className={`quiz-field-input${errors.email ? ' error' : ''}`}
            placeholder="you@example.com"
            value={value.email || ''}
            onChange={(e) => update('email', e.target.value)}
          />
          {errors.email && <span className="quiz-field-error">{errors.email}</span>}
        </div>

        <div className="quiz-form-row">
          <div className="quiz-field">
            <label className="quiz-field-label">Mobile *</label>
            <input
              type="tel"
              className={`quiz-field-input${errors.mobile ? ' error' : ''}`}
              placeholder="0400 000 000"
              value={value.mobile || ''}
              onChange={(e) => update('mobile', e.target.value)}
            />
            {errors.mobile && <span className="quiz-field-error">{errors.mobile}</span>}
          </div>
          <div className="quiz-field">
            <label className="quiz-field-label">Post Code *</label>
            <input
              type="text"
              className={`quiz-field-input${errors.postCode ? ' error' : ''}`}
              placeholder="3000"
              value={value.postCode || ''}
              onChange={(e) => update('postCode', e.target.value)}
              maxLength={4}
            />
            {errors.postCode && <span className="quiz-field-error">{errors.postCode}</span>}
          </div>
        </div>

        <label className="quiz-checkbox-label">
          <input
            type="checkbox"
            checked={value.subscribe || false}
            onChange={(e) => update('subscribe', e.target.checked)}
          />
          <span>Subscribe to the Intimo newsletter for exclusive offers and styling tips</span>
        </label>
      </div>

      <button className="quiz-next-btn" onClick={handleSubmit}>
        See My Capsule
      </button>
    </div>
  );
}
