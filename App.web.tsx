import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthLogin from './screens/AuthLogin';
import CustomerHome from './screens/CustomerHome';
import BarberDashboard from './screens/BarberDashboard';
import RoleGate from './screens/RoleGate';
import SalonList from './screens/SalonList';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleGate />} />
        <Route path="/login" element={<AuthLogin />} />
        <Route path="/customer" element={<CustomerHome />} />
        <Route path="/barber" element={<BarberDashboard />} />
        <Route path="/salons" element={<SalonList />} />
      </Routes>
    </Router>
  );
};

export default App;
