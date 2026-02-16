import React from "react";
import { useNavigate } from "react-router-dom";
import ServiceCard from "../components/ServiceCard";
import Button from "../components/Button";
import { SERVICES } from "../config/services";

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const handleServiceClick = (serviceRoute: string) => {
    navigate(serviceRoute);
  };

  const handleGetStarted = () => {
    navigate("/request");
  };

  const productionServices = SERVICES.filter((s) => s.category === "production");
  const developmentServices = SERVICES.filter((s) => s.category === "development");

  return (
    <div className="min-h-screen bg-tech-dark relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 relative z-10">
        {/* Hero: centered glowing eye logo + neon cyan title + taglines (minimal, dark) */}
        <div className="mb-10 sm:mb-12 md:mb-16 animate-fadeIn text-center">
          {/* Logo: larger eye with soft cyan glow */}
          <div className="flex justify-center mb-8 md:mb-10">
            <img
              src="/logo.png"
              alt="3rd Eye Feel"
              className="h-36 w-36 sm:h-44 sm:w-44 md:h-56 md:w-56 lg:h-64 lg:w-64 object-contain"
              style={{
                filter:
                  "drop-shadow(0 0 16px rgba(0, 217, 255, 0.4)) drop-shadow(0 0 32px rgba(0, 217, 255, 0.2)) brightness(1.05)",
              }}
            />
          </div>
          {/* Site name: softer cyan, subtle glow */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 md:mb-5"
            style={{
              color: "#5ec8e0",
              textShadow: "0 0 24px rgba(0, 217, 255, 0.35), 0 0 48px rgba(0, 217, 255, 0.15)",
            }}
          >
            3rd Eye Feel
          </h1>
          {/* Tagline */}
          <p className="text-base sm:text-lg md:text-xl text-tech-text-muted font-normal max-w-xl mx-auto leading-relaxed">
            Advanced solutions for production and development needs
          </p>
          {/* CTA line */}
          <p className="text-sm sm:text-base text-tech-text-muted/90 mt-3 max-w-lg mx-auto">
            Select a service to get started. Our team will reach out within 24 hours.
          </p>
          <button
            type="button"
            onClick={() => navigate("/guide")}
            className="mt-4 text-sm text-tech-cyan hover:text-tech-cyan-dark focus:outline-none focus:ring-2 focus:ring-tech-cyan/50 rounded px-2 py-1"
          >
            Want to build it yourself? Get a step-by-step implementation guide →
          </button>
        </div>

        {/* Production Services */}
        <div className="mb-10 sm:mb-12 md:mb-16 animate-fadeIn">
          <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
            <div
              className="h-px flex-1 rounded-full"
              style={{ background: "linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.4), transparent)" }}
            />
            <h2
              className="text-xl sm:text-2xl md:text-3xl font-bold whitespace-nowrap"
              style={{
                color: "#e5e5e5",
                textShadow: "0 0 20px rgba(0, 217, 255, 0.2)",
              }}
            >
              Production
            </h2>
            <div
              className="h-px flex-1 rounded-full"
              style={{ background: "linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.4), transparent)" }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 max-w-7xl mx-auto">
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

        {/* Development Services */}
        <div className="mb-8 sm:mb-10 md:mb-12 animate-fadeIn">
          <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
            <div
              className="h-px flex-1 rounded-full"
              style={{ background: "linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.4), transparent)" }}
            />
            <h2
              className="text-xl sm:text-2xl md:text-3xl font-bold whitespace-nowrap"
              style={{
                color: "#e5e5e5",
                textShadow: "0 0 20px rgba(0, 255, 136, 0.2)",
              }}
            >
              Development
            </h2>
            <div
              className="h-px flex-1 rounded-full"
              style={{ background: "linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.4), transparent)" }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 max-w-7xl mx-auto">
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

        {/* General Inquiry CTA - enhanced card */}
        <div className="text-center mt-10 sm:mt-12 md:mt-16 animate-fadeIn px-4">
          <div
            className="rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 max-w-xl mx-auto"
            style={{
              background: "linear-gradient(145deg, rgba(26, 26, 26, 0.9) 0%, rgba(20, 20, 20, 0.95) 100%)",
              border: "1px solid rgba(0, 255, 136, 0.2)",
              boxShadow: "0 0 30px rgba(0, 255, 136, 0.06), inset 0 1px 0 rgba(255,255,255,0.03)",
            }}
          >
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-tech-text mb-3">
              Not sure which service?
            </h3>
            <p className="text-tech-text-muted mb-5 sm:mb-6 text-sm sm:text-base leading-relaxed">
              Use our general inquiry form and we&apos;ll help you find the right solution.
            </p>
            <Button
              size="md"
              onClick={handleGetStarted}
              variant="outline"
              className="w-full sm:w-auto min-h-[44px] touch-manipulation border-tech-accent/40 hover:border-tech-accent/70 hover:bg-tech-accent/10"
            >
              General Inquiry
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
