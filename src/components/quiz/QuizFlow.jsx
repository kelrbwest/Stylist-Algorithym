import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecommendations } from '../../utils/recommend';
import CapsuleResults from '../CapsuleResults';
import ProgressBar from './ProgressBar';
import WelcomeStep from './WelcomeStep';
import AgeStep from './AgeStep';
import FirmnessStep from './FirmnessStep';
import BandSizeStep from './BandSizeStep';
import CupSizeStep from './CupSizeStep';
import CustomerDetailsStep from './CustomerDetailsStep';
import TransitionStep from './TransitionStep';

const STEPS = ['welcome', 'age', 'firmness', 'band', 'cup', 'details', 'transition', 'results'];
const TOTAL_QUESTIONS = 5;

export default function QuizFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [ageGroup, setAgeGroup] = useState(null);
  const [bodyFirmness, setBodyFirmness] = useState(null);
  const [bandSize, setBandSize] = useState('');
  const [cupSize, setCupSize] = useState('');
  const [customerDetails, setCustomerDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    postCode: '',
    subscribe: false,
  });
  const [results, setResults] = useState(null);
  const [profile, setProfile] = useState(null);

  const goNext = () => setStep((s) => s + 1);
  const goBack = () => setStep((s) => s - 1);

  const handleTransitionDone = useCallback(() => {
    const recs = getRecommendations({ ageGroup, bodyFirmness });
    setProfile({ ageGroup, bodyFirmness, bandSize, cupSize, postCode: customerDetails.postCode });
    setResults(recs);
    setStep(STEPS.indexOf('results'));
  }, [ageGroup, bodyFirmness, bandSize, cupSize, customerDetails.postCode]);

  const handleReset = () => {
    setStep(0);
    setAgeGroup(null);
    setBodyFirmness(null);
    setBandSize('');
    setCupSize('');
    setCustomerDetails({ firstName: '', lastName: '', email: '', mobile: '', postCode: '', subscribe: false });
    setResults(null);
    setProfile(null);
  };

  const currentStep = STEPS[step];

  const questionSteps = ['age', 'firmness', 'band', 'cup', 'details'];
  const questionIndex = questionSteps.indexOf(currentStep);
  const showProgress = questionIndex >= 0;

  return (
    <div className="quiz-wrapper">
      <header className="app-header">
        <div className="header-inner">
          <span className="brand-name" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>INTIMO</span>
          <span className="brand-tagline">Lingerie Capsule</span>
        </div>
      </header>

      {showProgress && (
        <ProgressBar current={questionIndex + 1} total={TOTAL_QUESTIONS} />
      )}

      <main className="quiz-main">
        {currentStep === 'welcome' && (
          <WelcomeStep onNext={goNext} />
        )}
        {currentStep === 'age' && (
          <AgeStep
            value={ageGroup}
            onChange={setAgeGroup}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {currentStep === 'firmness' && (
          <FirmnessStep
            ageGroup={ageGroup}
            value={bodyFirmness}
            onChange={setBodyFirmness}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {currentStep === 'band' && (
          <BandSizeStep
            value={bandSize}
            onChange={setBandSize}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {currentStep === 'cup' && (
          <CupSizeStep
            value={cupSize}
            onChange={setCupSize}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {currentStep === 'details' && (
          <CustomerDetailsStep
            value={customerDetails}
            onChange={setCustomerDetails}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {currentStep === 'transition' && (
          <TransitionStep onDone={handleTransitionDone} />
        )}
        {currentStep === 'results' && results && (
          <CapsuleResults
            recommendations={results}
            profile={profile}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}
