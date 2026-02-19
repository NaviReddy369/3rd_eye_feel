import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Landing from './pages/Landing';
import RequestForm from './pages/RequestForm';
import ServiceForm from './pages/ServiceForm';
import Chatbot from './pages/Chatbot';
import ImplementationGuidesPage from './pages/ImplementationGuidesPage';
import EnrollGuides from './pages/EnrollGuides';

const App: React.FC = () => {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/request" element={<RequestForm />} />
        <Route path="/request/:serviceId" element={<ServiceForm />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/guides" element={<ImplementationGuidesPage />} />
        <Route path="/guide" element={<Navigate to="/guides" replace />} />
        <Route path="/enroll" element={<EnrollGuides />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
