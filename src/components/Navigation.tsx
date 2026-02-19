import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AboutModal from "./AboutModal";
import { useLocalStorage } from "../hooks/useLocalStorage";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/guides", label: "Implementation Guides" },
  { path: "/chat", label: "3rd Eye Chat" },
  { path: "/enroll", label: "Enroll" },
  { path: "/request", label: "Request" },
] as const;

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [hasSeenAbout, setHasSeenAbout] = useLocalStorage("hasSeenAbout", false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!hasSeenAbout && location.pathname === "/") {
      const timer = setTimeout(() => setShowAboutModal(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [hasSeenAbout, location.pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleCloseAbout = () => {
    setShowAboutModal(false);
    if (!hasSeenAbout) setHasSeenAbout(true);
  };

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-40
          transition-all duration-300
          ${isScrolled ? "bg-tech-dark/95 backdrop-blur-xl border-b border-white/10 shadow-lg" : "bg-tech-dark/80 backdrop-blur-sm border-b border-white/5"}
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-tech-text hover:text-tech-cyan transition-colors focus:outline-none focus:ring-2 focus:ring-tech-cyan/50 rounded-lg px-2 py-1.5"
              aria-label="Go to home"
            >
              <span className="text-lg font-bold bg-gradient-to-r from-tech-cyan to-tech-accent bg-clip-text text-transparent">
                3rd Eye Feel
              </span>
            </button>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(({ path, label }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${location.pathname === path ? "text-tech-cyan bg-tech-cyan/10" : "text-tech-text-muted hover:text-tech-cyan hover:bg-white/5"}
                  `}
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => setShowAboutModal(true)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-tech-text-muted hover:text-tech-cyan hover:bg-white/5 transition-colors"
                aria-label="About"
              >
                About
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="md:hidden p-2 rounded-lg text-tech-text hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-tech-cyan/50"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              <span className="text-xl">{mobileMenuOpen ? "✕" : "☰"}</span>
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 py-3 border-t border-white/10 flex flex-col gap-1">
              {navItems.map(({ path, label }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`
                    px-4 py-2.5 rounded-lg text-left text-sm font-medium
                    ${location.pathname === path ? "text-tech-cyan bg-tech-cyan/10" : "text-tech-text hover:bg-white/5"}
                  `}
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => {
                  setShowAboutModal(true);
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2.5 rounded-lg text-left text-sm font-medium text-tech-text hover:bg-white/5"
              >
                About
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="h-14 md:h-16" />

      <AboutModal isOpen={showAboutModal} onClose={handleCloseAbout} />
    </>
  );
};

export default Navigation;
