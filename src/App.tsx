import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import RequestForm from './pages/RequestForm';
import ServiceForm from './pages/ServiceForm';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/request" element={<RequestForm />} />
      <Route path="/request/:serviceId" element={<ServiceForm />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
