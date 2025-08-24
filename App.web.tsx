import React, { useEffect, useState } from 'react';
import CustomerHome from './screens/CustomerHome.web';
import BarberDashboard from './screens/BarberDashboard';
import RoleGate from './screens/RoleGate';

// Simple hash-based routing without react-router-dom
const App = () => {
  const [currentView, setCurrentView] = useState('');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentView(window.location.hash.slice(1));
    };

    // Set initial view
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Render components based on hash
  switch (currentView) {
    case '/customer':
      return <CustomerHome />;
    case '/barber':
      return <BarberDashboard />;
    default:
      return <RoleGate />;
  }
};

export default App;
