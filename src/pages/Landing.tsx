import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ServiceCard from "../components/ServiceCard";
import Button from "../components/Button";
import { SERVICES } from "../config/services";

type ServiceCategory = "all" | "production" | "development";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<ServiceCategory>("all");

  const handleServiceClick = (serviceRoute: string) => {
    navigate(serviceRoute);
  };

  const filteredServices =
    category === "all"
      ? SERVICES
      : SERVICES.filter((s) => s.category === category);

  return (
    <div className="min-h-screen bg-tech-dark relative flex flex-col">
      {/* Compact hero - no long scroll */}
      <header className="flex-shrink-0 border-b border-white/5 bg-tech-dark/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src="/logo.png"
                alt="3rd Eye Feel"
                className="h-14 w-14 md:h-16 md:w-16 object-contain"
                style={{
                  filter: "drop-shadow(0 0 12px rgba(0, 217, 255, 0.35))",
                }}
              />
              <div>
                <h1
                  className="text-2xl md:text-3xl font-bold tracking-tight"
                  style={{
                    color: "#5ec8e0",
                    textShadow: "0 0 20px rgba(0, 217, 255, 0.2)",
                  }}
                >
                  3rd Eye Feel
                </h1>
                <p className="text-sm text-tech-text-muted mt-0.5">
                  Production & development solutions
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/guides")}
                className="border-tech-cyan/40 text-tech-cyan hover:bg-tech-cyan/10"
              >
                Implementation Guides
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/chat")}
                className="border-tech-cyan/40 text-tech-cyan hover:bg-tech-cyan/10"
              >
                3rd Eye Chat
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/enroll")}
                className="bg-tech-cyan/20 text-tech-cyan border border-tech-cyan/50 hover:bg-tech-cyan/30"
              >
                Enroll for guides
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Services dashboard - main content */}
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        <section aria-label="Services">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-tech-text">
              Request a service
            </h2>
            <div className="flex rounded-lg bg-white/5 p-1 border border-white/10">
              {(["all", "production", "development"] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`
                    px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize
                    ${category === cat ? "bg-tech-cyan/20 text-tech-cyan" : "text-tech-text-muted hover:text-tech-text"}
                  `}
                >
                  {cat === "all" ? "All" : cat}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onClick={() => handleServiceClick(service.formRoute)}
              />
            ))}
          </div>
        </section>

        {/* General inquiry - compact */}
        <section className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-sm text-tech-text-muted">
              Not sure which service? Use our general inquiry form and we&apos;ll help you find the right solution.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/request")}
              className="border-tech-accent/40 text-tech-accent hover:bg-tech-accent/10"
            >
              General Inquiry
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
