import React, { useEffect, useState } from 'react';
import CustomerHome from './screens/CustomerHome.web';
import BarberDashboard from './screens/BarberDashboard';
import RoleGate from './screens/RoleGate';
const App = () => {
  const [currentView, setCurrentView] = useState('');
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentView(window.location.hash.slice(1));
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
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