import React from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import Button from '../components/Button';
import { SERVICES } from '../config/services';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const handleServiceClick = (serviceRoute: string) => {
    navigate(serviceRoute);
  };

  const handleGetStarted = () => {
    navigate('/request');
  };

  const productionServices = SERVICES.filter(s => s.category === 'production');
  const developmentServices = SERVICES.filter(s => s.category === 'development');

  return (
    <div className="min-h-screen bg-tech-dark relative">
      {/* Hero Section - Tech/AI Theme */}
      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="text-center mb-12 md:mb-16 animate-fadeIn">
          {/* Logo */}
          <div className="mb-10 flex justify-center">
            <div className="relative">
              <img 
                src="/logo.png"
                alt="Company Logo"
                className="h-32 md:h-48 lg:h-56 w-auto mx-auto opacity-90 hover:opacity-100 transition-all duration-300"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(0, 217, 255, 0.4))',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'drop-shadow(0 0 30px rgba(0, 217, 255, 0.6))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'drop-shadow(0 0 20px rgba(0, 217, 255, 0.4))';
                }}
              />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-tech-text mb-4 text-tech-gradient">
            3rd Eye Feel
          </h1>
          <p className="text-base md:text-lg text-tech-text-muted mb-2 max-w-2xl mx-auto">
            Advanced solutions for production and development needs
          </p>
          <p className="text-sm text-tech-text-muted/80 max-w-xl mx-auto">
            Select a service to get started. Our team will reach out within 24 hours.
          </p>
        </div>

        {/* Production Services Section */}
        <div className="mb-16 animate-fadeIn">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-tech-cyan/30 to-transparent"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-tech-text">
              Production
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-tech-cyan/30 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {productionServices.map((service, index) => (
              <div
                key={service.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ServiceCard 
                  service={service} 
                  onClick={() => handleServiceClick(service.formRoute)} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Development Services Section */}
        <div className="mb-12 animate-fadeIn">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-tech-accent/30 to-transparent"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-tech-text">
              Development
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-tech-accent/30 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {developmentServices.map((service, index) => (
              <div
                key={service.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ServiceCard 
                  service={service} 
                  onClick={() => handleServiceClick(service.formRoute)} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* General Inquiry CTA */}
        <div className="text-center mt-16 animate-fadeIn">
          <div className="glass rounded-lg p-8 md:p-10 max-w-xl mx-auto border border-tech-border">
            <h3 className="text-xl md:text-2xl font-bold text-tech-text mb-3">
              Not Sure Which Service?
            </h3>
            <p className="text-tech-text-muted mb-6 text-sm md:text-base">
              Fill out our general inquiry form and we'll help you find the right solution.
            </p>
            <Button size="md" onClick={handleGetStarted} variant="outline">
              General Inquiry
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
