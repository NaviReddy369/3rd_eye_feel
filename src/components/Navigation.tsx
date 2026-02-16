import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AboutModal from './AboutModal';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [hasSeenAbout, setHasSeenAbout] = useLocalStorage('hasSeenAbout', false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll for sticky effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-show About modal on first visit (only on landing page)
  useEffect(() => {
    if (!hasSeenAbout && location.pathname === '/') {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setShowAboutModal(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hasSeenAbout, location.pathname]);

  const handleAboutClick = () => {
    setShowAboutModal(true);
  };

  const handleCloseAbout = () => {
    setShowAboutModal(false);
    if (!hasSeenAbout) {
      setHasSeenAbout(true);
    }
  };

  const isLandingPage = location.pathname === '/';

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-40
          transition-all duration-300
          ${isScrolled ? 'glass backdrop-blur-xl border-b border-tech-border/50 shadow-lg' : 'bg-transparent'}
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Home */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-tech-text hover:text-tech-cyan transition-colors focus:outline-none focus:ring-2 focus:ring-tech-cyan/50 rounded-lg px-2 py-1"
              aria-label="Go to home page"
            >
              <span className="text-xl font-bold text-tech-gradient">3rd Eye Feel</span>
            </button>

            {/* Navigation Items */}
            <div className="flex items-center gap-3 md:gap-4">
              {!isLandingPage && (
                <button
                  onClick={() => navigate('/')}
                  className="text-tech-text-muted hover:text-tech-cyan transition-colors px-3 py-2 rounded-lg hover:bg-tech-gray/50 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-tech-cyan/50"
                >
                  Home
                </button>
              )}
              <button
                onClick={() => navigate('/chat')}
                className="text-tech-text-muted hover:text-tech-cyan transition-colors px-3 py-2 rounded-lg hover:bg-tech-gray/50 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-tech-cyan/50 flex items-center gap-2"
                aria-label="Open chat"
              >
                <span>💬</span>
                <span className="hidden sm:inline">Chat</span>
              </button>
              <button
                onClick={() => navigate('/guide')}
                className="text-tech-text-muted hover:text-tech-cyan transition-colors px-3 py-2 rounded-lg hover:bg-tech-gray/50 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-tech-cyan/50 flex items-center gap-2"
                aria-label="Implementation guide"
              >
                <span>📋</span>
                <span className="hidden sm:inline">Guide</span>
              </button>
              <button
                onClick={handleAboutClick}
                className="text-tech-text-muted hover:text-tech-cyan transition-colors px-3 py-2 rounded-lg hover:bg-tech-gray/50 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-tech-cyan/50 flex items-center gap-2"
                aria-label="Open about modal"
              >
                <span>ℹ️</span>
                <span className="hidden sm:inline">About</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed nav */}
      <div className="h-16 md:h-20" />

      <AboutModal isOpen={showAboutModal} onClose={handleCloseAbout} />
    </>
  );
};

export default Navigation;
