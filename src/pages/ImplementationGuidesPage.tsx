import React from "react";
import { useNavigate } from "react-router-dom";
import { NOTION_GUIDES } from "../config/notionGuides";
import Button from "../components/Button";
import ImplementationGuide from "./ImplementationGuide";

const ImplementationGuidesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-tech-dark">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1
          className="text-2xl sm:text-3xl font-bold mb-2"
          style={{
            color: "#5ec8e0",
            textShadow: "0 0 20px rgba(0, 217, 255, 0.2)",
          }}
        >
          Implementation Guides
        </h1>
        <p className="text-tech-text-muted text-sm sm:text-base mb-8">
          Enroll to receive Notion guide links by email, or use Guide AI to generate step-by-step implementation help.
        </p>

        {/* Notion guides – enroll for links */}
        <section className="mb-10" aria-label="Notion guides">
          <h2 className="text-lg font-semibold text-tech-text mb-4">
            Notion guides
          </h2>
          <p className="text-tech-text-muted text-sm mb-4">
            Enroll with your email to get the full Notion guide links. We’ll send them to your inbox so you can follow along step by step.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 mb-6">
            {NOTION_GUIDES.map((guide) => (
              <div
                key={guide.id}
                className="rounded-xl border border-white/10 bg-white/5 p-4 hover:border-tech-cyan/30 transition-colors"
              >
                <h3 className="font-medium text-tech-text mb-1">{guide.title}</h3>
                <p className="text-sm text-tech-text-muted mb-3">
                  {guide.description}
                </p>
                {!guide.isFree && (
                  <span className="text-xs text-amber-400">Paid</span>
                )}
              </div>
            ))}
          </div>
          <Button
            onClick={() => navigate("/enroll")}
            className="bg-tech-cyan/20 text-tech-cyan border border-tech-cyan/50 hover:bg-tech-cyan/30"
          >
            Enroll for free – get guide links by email
          </Button>
        </section>

        {/* Guide AI */}
        <section className="pt-8 border-t border-white/10" aria-label="Guide AI">
          <h2 className="text-lg font-semibold text-tech-text mb-2">
            Guide AI
          </h2>
          <p className="text-tech-text-muted text-sm mb-6">
            Ask for a step-by-step implementation guide. Describe the service or feature and we’ll generate a guide you can download.
          </p>
          <ImplementationGuide embedded />
        </section>
      </div>
    </div>
  );
};

export default ImplementationGuidesPage;
