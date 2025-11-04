'use client';

import { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import AuthForm from './components/AuthForm';
import ProfileSetup from './components/ProfileSetup';
import Discover from './components/Discover';

type FlowStep = 'splash' | 'auth' | 'profile' | 'discover';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<FlowStep>('splash');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSplashComplete = () => {
    setCurrentStep('auth');
  };

  const handleAuthComplete = () => {
    setIsAuthenticated(true);
    setCurrentStep('profile');
  };

  const handleProfileComplete = () => {
    setCurrentStep('discover');
  };

  return (
    <>
      {currentStep === 'splash' && <SplashScreen onComplete={handleSplashComplete} />}
      {currentStep === 'auth' && <AuthForm onComplete={handleAuthComplete} />}
      {currentStep === 'profile' && <ProfileSetup onComplete={handleProfileComplete} />}
      {currentStep === 'discover' && <Discover />}
    </>
  );
}
