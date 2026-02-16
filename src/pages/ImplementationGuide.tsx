import React, { useState, useEffect } from "react";
import {
  generateImplementationGuide,
  checkOllamaReachable,
  type ImplementationGuideParams,
} from "../services/ollamaService";
import { GUIDE_SERVICE_OPTIONS, GUIDE_TECH_STACK_OPTIONS } from "../config/guideOptions";
import Button from "../components/Button";

const ImplementationGuide: React.FC = () => {
  const [serviceType, setServiceType] = useState("");
  const [techStack, setTechStack] = useState("No preference");
  const [additionalContext, setAdditionalContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guide, setGuide] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    checkOllamaReachable()
      .then(setConnected)
      .catch(() => setConnected(false));
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceType.trim()) return;
    setError(null);
    setGuide(null);
    setLoading(true);
    try {
      const params: ImplementationGuideParams = {
        serviceType: serviceType.trim(),
        techStack: techStack !== "No preference" ? techStack : undefined,
        additionalContext: additionalContext.trim() || undefined,
      };
      const text = await generateImplementationGuide(params);
      setGuide(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate guide");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!guide) return;
    const sanitized = serviceType.replace(/[^a-z0-9-]/gi, "-").replace(/-+/g, "-").slice(0, 40);
    const date = new Date().toISOString().slice(0, 10);
    const filename = `implementation-guide-${sanitized}-${date}.md`;
    const blob = new Blob([guide], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!guide) return;
    try {
      await navigator.clipboard.writeText(guide);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Copy failed");
    }
  };

  return (
    <div className="min-h-screen bg-tech-dark">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2"
            style={{
              color: "#5ec8e0",
              textShadow: "0 0 24px rgba(0, 217, 255, 0.35)",
            }}
          >
            Implementation Guide
          </h1>
          <p className="text-tech-text-muted text-sm sm:text-base max-w-xl mx-auto">
            Select your service and options below. We&apos;ll generate a step-by-step guide you can use to build it yourself. You can download the guide when done.
          </p>
        </div>

        {/* Status */}
        <div className="flex justify-center gap-4 mb-6">
          {connected === true && (
            <span className="flex items-center gap-1.5 text-tech-accent text-sm">
              <span className="w-2 h-2 rounded-full bg-tech-accent animate-pulse" />
              Model ready
            </span>
          )}
          {connected === false && (
            <span className="flex items-center gap-1.5 text-amber-400 text-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Cannot reach model — check network or Ollama URL
            </span>
          )}
        </div>

        {/* Form */}
        <form
          onSubmit={handleGenerate}
          className="rounded-xl border border-tech-border bg-tech-gray/50 p-5 sm:p-6 mb-8"
        >
          <div className="space-y-5">
            <div>
              <label htmlFor="guide-service" className="block text-sm font-medium text-tech-text mb-2">
                Service or feature <span className="text-tech-cyan">*</span>
              </label>
              <select
                id="guide-service"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                required
                className="w-full rounded-lg border border-tech-border bg-tech-dark px-4 py-3 text-tech-text focus:outline-none focus:ring-2 focus:ring-tech-cyan/50 focus:border-tech-cyan/50"
              >
                <option value="">Select a service</option>
                {GUIDE_SERVICE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="guide-tech" className="block text-sm font-medium text-tech-text mb-2">
                Tech stack (optional)
              </label>
              <select
                id="guide-tech"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                className="w-full rounded-lg border border-tech-border bg-tech-dark px-4 py-3 text-tech-text focus:outline-none focus:ring-2 focus:ring-tech-cyan/50 focus:border-tech-cyan/50"
              >
                {GUIDE_TECH_STACK_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="guide-context" className="block text-sm font-medium text-tech-text mb-2">
                Additional context (optional)
              </label>
              <textarea
                id="guide-context"
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder="e.g. small team, budget-conscious, need it in 2 weeks"
                rows={3}
                className="w-full rounded-lg border border-tech-border bg-tech-dark px-4 py-3 text-tech-text placeholder-tech-text-muted/60 focus:outline-none focus:ring-2 focus:ring-tech-cyan/50 focus:border-tech-cyan/50 resize-none"
              />
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              disabled={loading || !serviceType.trim() || connected === false}
              isLoading={loading}
              className="w-full sm:w-auto min-w-[200px]"
            >
              {loading ? "Generating…" : "Generate implementation guide"}
            </Button>
          </div>
        </form>

        {error && (
          <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-amber-400 text-sm mb-6" role="alert">
            {error}
          </div>
        )}

        {/* Result */}
        {guide && (
          <div className="animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <h2 className="text-lg font-semibold text-tech-text">Your guide</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} disabled={copied}>
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button variant="secondary" size="sm" onClick={handleDownload}>
                  Download .md
                </Button>
              </div>
            </div>
            <div
              className="rounded-xl border border-tech-border bg-tech-darker/80 p-5 sm:p-6 overflow-auto max-h-[60vh]"
              style={{ minHeight: "280px" }}
            >
              <pre className="text-tech-text text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans">
                {guide}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImplementationGuide;
