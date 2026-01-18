import React, { useState } from 'react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const gradientClasses = {
    'tech-primary': 'border-tech-cyan/30 hover:border-tech-cyan/60 hover:bg-tech-cyan/5 hover:shadow-tech-cyan/20',
    'tech-secondary': 'border-tech-accent/30 hover:border-tech-accent/60 hover:bg-tech-accent/5 hover:shadow-tech-accent/20',
  };

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };

  return (
    <div
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      className={`
        glass-card
        relative
        rounded-lg p-4 sm:p-5 cursor-pointer
        border border-tech-border
        ${gradientClasses[service.gradient]}
        transform transition-all duration-300 ease-out
        ${isHovered ? 'scale-[1.02] -translate-y-1 shadow-xl hover:z-10' : 'scale-100 translate-y-0'}
        ${isPressed ? 'scale-[0.98] translate-y-0' : ''}
        active:scale-[0.97] active:translate-y-0
        group
        ${onClick ? 'hover:z-10 focus-within:z-10' : ''}
        touch-manipulation
        min-h-[120px] sm:min-h-[140px]
        focus:outline-none focus:ring-2 focus:ring-tech-cyan/50 focus:ring-offset-2 focus:ring-offset-tech-dark
      `}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `Learn more about ${service.name}` : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 h-full">
        <div className={`
          text-3xl sm:text-2xl flex-shrink-0 
          transition-transform duration-300 ease-out
          ${isHovered ? 'scale-110 rotate-3' : 'scale-100 rotate-0'}
          w-full sm:w-auto text-center sm:text-left
        `}>
          {service.icon}
        </div>
        <div className="flex-1 min-w-0 w-full sm:w-auto">
          <h3 className="text-base sm:text-lg font-semibold text-tech-text mb-2 group-hover:text-tech-cyan transition-colors duration-300 text-center sm:text-left">
            {service.name}
          </h3>
          <p className="text-xs sm:text-sm text-tech-text-muted leading-relaxed text-center sm:text-left">
            {service.description}
          </p>
        </div>
      </div>
      
      {/* Hover gradient effect */}
      <div 
        className={`
          absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100
          transition-opacity duration-300 pointer-events-none
          bg-gradient-to-br ${
            service.gradient === 'tech-primary' 
              ? 'from-tech-cyan/5 to-transparent' 
              : 'from-tech-accent/5 to-transparent'
          }
        `}
      />
    </div>
  );
};

export default ServiceCard;
