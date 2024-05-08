// @ts-nocheck
// Import necessary libraries and components
import React, { useEffect, useState } from 'react';
import HomeView from './src/HomeView';
import LoginView from './src/LoginView';
import ApiViewModel from './src/ApiViewModel'; 
import * as appInsights from 'appinsights-module';
import { notifyMessage } from './src/Utils';
import ChooseMDView from './src/ChooseMdView';

const apiViewModel = new ApiViewModel(); 

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [selectedMd, setSelectedMd] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);

  useEffect(() => {
    appInsights.initAppInsights();
  }, []);

  const handleGoToMd = async (md: string, region: string) => {
    setSelectedMd(md);
    setSelectedRegion(region);
  };

  const handleLogin = async (username: string, password: string) => {
    // Check if Maindealer and Region are selected
    if (!selectedMd || !selectedRegion) {
      console.error('Login failed: Maindealer and Region not selected');
      notifyMessage('Please select both Maindealer and Region');
      return;
    }
  
    try {
      const { success } = await apiViewModel.login(username, password, selectedMd, selectedRegion);
  
      if (success) {
        setAuthenticated(true);
        notifyMessage('User Profile tracked');
        console.log('Login successful!');
      } else {
        console.error('Login failed');
        notifyMessage('Username or password wrong');
      }
    } catch (error) {
      console.error('Error during login:', error);
      notifyMessage('An error occurred during login.');
    }
  };
  

  return isAuthenticated ? <HomeView selectedMd={selectedMd} selectedRegion={selectedRegion} /> : selectedMd && selectedRegion ? <LoginView onLogin={handleLogin} selectedMd={selectedMd} selectedRegion={selectedRegion} /> : <ChooseMDView onNavigate={handleGoToMd} />;
}

export default App;