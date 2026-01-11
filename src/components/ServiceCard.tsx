import React from 'react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  const gradientClasses = {
    'tech-primary': 'border-tech-cyan/30 hover:border-tech-cyan/60 hover:bg-tech-cyan/5',
    'tech-secondary': 'border-tech-accent/30 hover:border-tech-accent/60 hover:bg-tech-accent/5',
  };

  return (
    <div
      onClick={onClick}
      className={`
        glass-card
        rounded-lg p-5 cursor-pointer
        border border-tech-border
        ${gradientClasses[service.gradient]}
        transform transition-all duration-300
        hover:scale-[1.02] hover:shadow-lg
        active:scale-[0.98]
        group
        ${onClick ? 'hover:z-10' : ''}
      `}
    >
      <div className="flex items-start gap-4">
        <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          {service.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-tech-text mb-1.5 group-hover:text-tech-cyan transition-colors">
            {service.name}
          </h3>
          <p className="text-sm text-tech-text-muted leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
