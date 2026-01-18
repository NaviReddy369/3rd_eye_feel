import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 5000,
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsExiting(false);
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          onClose();
        }, 300); // Animation duration
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' 
    ? 'bg-gradient-to-r from-green-500/95 to-green-600/95' 
    : 'bg-gradient-to-r from-red-500/95 to-red-600/95';

  const borderColor = type === 'success'
    ? 'border-green-400/50'
    : 'border-red-400/50';

  const icon = type === 'success' ? (
    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  ) : (
    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  );

  return (
    <div 
      className={`
        fixed z-50 
        top-4 right-4 left-4 sm:left-auto sm:right-4
        max-w-md sm:max-w-sm mx-auto sm:mx-0
        transition-all duration-300 ease-out
        ${isExiting ? 'opacity-0 translate-x-full sm:translate-x-full' : 'opacity-100 translate-x-0'}
        animate-slideInRight
      `}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div
        className={`
          ${bgColor} ${borderColor}
          text-white px-4 py-3 sm:px-6 sm:py-4 
          rounded-xl shadow-2xl 
          flex items-start gap-3
          backdrop-blur-md
          border
          transform transition-all duration-300
          hover:scale-[1.02] hover:shadow-2xl
        `}
      >
        <div className="flex-shrink-0 mt-0.5">
          {icon}
        </div>
        <p className="flex-1 font-medium text-sm sm:text-base leading-relaxed pt-0.5">
          {message}
        </p>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => onClose(), 300);
          }}
          className="flex-shrink-0 text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Close notification"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;
