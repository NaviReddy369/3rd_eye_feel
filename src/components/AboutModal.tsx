import React, { useEffect, useRef } from 'react';
import Button from './Button';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = React.useState<'about' | 'services' | 'contact'>('about');

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus trap
      const firstFocusable = modalRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusable?.focus();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'about' as const, label: 'About Us', icon: '🏢' },
    { id: 'services' as const, label: 'Services', icon: '⚡' },
    { id: 'contact' as const, label: 'Contact', icon: '📧' },
  ];

  // Handle tab navigation with arrow keys
  const handleTabKeyDown = (e: React.KeyboardEvent, tabId: typeof activeTab) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const tabIds = tabs.map(t => t.id);
      const currentIndex = tabIds.indexOf(tabId);
      let nextIndex: number;
      
      if (e.key === 'ArrowLeft') {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabIds.length - 1;
      } else {
        nextIndex = currentIndex < tabIds.length - 1 ? currentIndex + 1 : 0;
      }
      
      setActiveTab(tabIds[nextIndex]);
    }
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center px-0 sm:px-4 py-0 sm:py-8 animate-modalBackdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      
      {/* Layered Glassmorphism Modal */}
      <div
        ref={modalRef}
        className="relative w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] sm:rounded-2xl overflow-hidden animate-modalSlide"
      >
        {/* Outer glass layer */}
        <div className="absolute inset-0 glass sm:rounded-2xl border-0 sm:border border-tech-border/50" />
        
        {/* Middle glass layer with gradient */}
        <div className="absolute inset-0 sm:inset-0.5 glass-card sm:rounded-2xl border-0 sm:border border-tech-cyan/20" />
        
        {/* Inner content layer */}
        <div className="relative bg-tech-dark/95 backdrop-blur-xl sm:rounded-2xl border-0 sm:border border-tech-cyan/30 overflow-hidden h-full">
          {/* Header with gradient accent */}
          <div className="relative px-6 py-4 md:px-8 md:py-6 border-b border-tech-border/50">
            <div className="absolute inset-0 bg-gradient-to-r from-tech-cyan/10 via-transparent to-tech-accent/10" />
            <div className="relative flex items-center justify-between">
              <h2 id="about-modal-title" className="text-2xl md:text-3xl font-bold text-tech-gradient">
                3rd Eye Feel
              </h2>
              <button
                onClick={onClose}
                className="text-tech-text-muted hover:text-tech-cyan transition-colors p-2 rounded-lg hover:bg-tech-gray focus:outline-none focus:ring-2 focus:ring-tech-cyan/50"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div 
            className="flex border-b border-tech-border/50 bg-tech-gray/30 px-4 md:px-6"
            role="tablist"
            aria-label="About sections"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
                className={`
                  relative px-4 py-3 md:px-6 md:py-4 text-sm md:text-base font-semibold
                  transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-tech-cyan/50 focus:ring-inset
                  ${
                    activeTab === tab.id
                      ? 'text-tech-cyan'
                      : 'text-tech-text-muted hover:text-tech-text'
                  }
                `}
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                id={`tab-${tab.id}`}
                role="tab"
                tabIndex={activeTab === tab.id ? 0 : -1}
              >
                <span className="mr-2" aria-hidden="true">{tab.icon}</span>
                {tab.label}
                {activeTab === tab.id && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-tech-cyan to-tech-accent" 
                    aria-hidden="true"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-6 md:px-8 md:py-8">
            <div 
              role="tabpanel" 
              id={`tabpanel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
              tabIndex={0}
            >
              {activeTab === 'about' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-tech-text mb-4">
                      Who We Are
                    </h3>
                    <p className="text-tech-text-muted leading-relaxed text-base md:text-lg mb-4">
                      Welcome to <span className="text-tech-cyan font-semibold">3rd Eye Feel</span>, where cutting-edge technology meets creative excellence. 
                      We specialize in advanced AI solutions and professional production services that transform ideas into reality.
                    </p>
                    <p className="text-tech-text-muted leading-relaxed text-base md:text-lg mb-4">
                      Our team combines expertise in artificial intelligence, digital media production, and custom development 
                      to deliver solutions that push boundaries and exceed expectations.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-tech-text mb-4">
                      Our Mission
                    </h3>
                    <p className="text-tech-text-muted leading-relaxed text-base md:text-lg">
                      To empower businesses and creators with innovative AI-driven solutions and professional services 
                      that enhance productivity, creativity, and digital presence. We believe in making advanced technology 
                      accessible and actionable for everyone.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="glass-card p-4 rounded-lg border border-tech-border/50">
                      <div className="text-3xl mb-2">🎯</div>
                      <h4 className="font-semibold text-tech-text mb-2">Precision</h4>
                      <p className="text-sm text-tech-text-muted">Attention to detail in every project</p>
                    </div>
                    <div className="glass-card p-4 rounded-lg border border-tech-border/50">
                      <div className="text-3xl mb-2">⚡</div>
                      <h4 className="font-semibold text-tech-text mb-2">Innovation</h4>
                      <p className="text-sm text-tech-text-muted">Latest technology and techniques</p>
                    </div>
                    <div className="glass-card p-4 rounded-lg border border-tech-border/50">
                      <div className="text-3xl mb-2">🤝</div>
                      <h4 className="font-semibold text-tech-text mb-2">Partnership</h4>
                      <p className="text-sm text-tech-text-muted">Collaborative approach to success</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-tech-text mb-4">
                      Production Services
                    </h3>
                    <p className="text-tech-text-muted leading-relaxed text-base md:text-lg mb-6">
                      Our production services leverage AI and cutting-edge technology to create stunning visual and audio content.
                    </p>
                    <ul className="space-y-3">
                      {[
                        'AI Environment Setup',
                        'Video & Audio Cloning',
                        'Logo Concept Videos',
                        'Service Concept Videos',
                        'Digital Advertising',
                        'Social Media Setup',
                        'Content Editing',
                      ].map((service, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-tech-text-muted">
                          <span className="text-tech-cyan">→</span>
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-tech-border/50">
                    <h3 className="text-xl md:text-2xl font-bold text-tech-text mb-4">
                      Development Services
                    </h3>
                    <p className="text-tech-text-muted leading-relaxed text-base md:text-lg mb-6">
                      Custom development solutions tailored to your specific needs and requirements.
                    </p>
                    <ul className="space-y-3">
                      {[
                        'Network Setup & Support',
                        'Custom Web Pages',
                        'Business Form Setup',
                        'Newsletter Systems',
                        'Email Configuration',
                        'Domain Management',
                        'Tailored Development',
                      ].map((service, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-tech-text-muted">
                          <span className="text-tech-accent">→</span>
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-tech-text mb-4">
                      Get in Touch
                    </h3>
                    <p className="text-tech-text-muted leading-relaxed text-base md:text-lg mb-6">
                      Ready to bring your vision to life? Submit a request through our form and we'll get back to you within 24 hours.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="glass-card p-5 rounded-lg border border-tech-border/50">
                      <div className="flex items-start gap-4">
                        <div className="text-2xl">📧</div>
                        <div>
                          <h4 className="font-semibold text-tech-text mb-2">Request Form</h4>
                          <p className="text-sm text-tech-text-muted mb-4">
                            Fill out our detailed request form to get started. We'll review your requirements and respond promptly.
                          </p>
                          <Button onClick={onClose} variant="outline" size="sm">
                            Get Started
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-5 rounded-lg border border-tech-border/50">
                      <div className="flex items-start gap-4">
                        <div className="text-2xl">⏱️</div>
                        <div>
                          <h4 className="font-semibold text-tech-text mb-2">Response Time</h4>
                          <p className="text-sm text-tech-text-muted">
                            We typically respond within 24 hours of receiving your request. For urgent matters, please indicate so in your message.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-5 rounded-lg border border-tech-border/50">
                      <div className="flex items-start gap-4">
                        <div className="text-2xl">💼</div>
                        <div>
                          <h4 className="font-semibold text-tech-text mb-2">Consultation</h4>
                          <p className="text-sm text-tech-text-muted">
                            Not sure which service you need? Our team is happy to provide guidance and recommendations based on your goals.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 md:px-8 md:py-4 border-t border-tech-border/50 bg-tech-gray/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-tech-text-muted text-center sm:text-left">
                © {new Date().getFullYear()} 3rd Eye Feel. All rights reserved.
              </p>
              <Button onClick={onClose} variant="outline" size="sm">
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
