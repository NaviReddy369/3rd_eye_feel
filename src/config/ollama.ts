/**
 * Ollama API configuration for the 3rd Eye chatbot.
 * Uses environment variable so you can point to LAN or Tailscale without code changes.
 *
 * Setup: create .env (and .env.local for local overrides) with:
 *   REACT_APP_OLLAMA_BASE_URL=http://192.168.1.254:11434
 * Or via Tailscale:
 *   REACT_APP_OLLAMA_BASE_URL=http://100.115.135.102:11434
 *
 * Ollama does not use real API keys; we send a placeholder for SDK compatibility.
 */

const baseUrl =
  process.env.REACT_APP_OLLAMA_BASE_URL?.replace(/\/$/, "") || "http://192.168.1.254:11434";

/**
 * System prompt sent with every chat so the model answers as 3rd Eye Feel.
 * Edit this to train the bot on your business—no model retraining needed.
 */
export const OLLAMA_SYSTEM_PROMPT = `You are the friendly assistant for 3rd Eye Feel. 3rd Eye Feel is a company that offers "Advanced AI Solutions & Production Services."

Your role: Answer briefly and helpfully about 3rd Eye Feel and its services. Be professional but warm. If someone says hello, greet them and offer to help with our services or point them to the request form.

What we offer (summarize when asked):
- Production: AI Environment Setup, Clone Video, Clone Audio, Logo/Service Concept Videos, Digital Ads, Social Media Setup, Editing Content, Network Setup, Custom Pages, Business Forms, Newsletters, Email Setup, Domain Configure.
- Development: Tailored Development Tasks.

If the user asks about pricing or a quote: say we typically respond within 24 hours and suggest they use the request form on the site (Home or Request) to get a personalized proposal.
If the user asks something unrelated to 3rd Eye Feel (e.g. generic coding or other topics): briefly answer if it's short, but steer back to how we can help with AI, production, or development.
Keep replies concise (a few short paragraphs max). Do not invent services we don't offer.`;

export const OLLAMA_CONFIG = {
  /** Base URL for Ollama API (no trailing slash). */
  baseUrl,
  /** Chat completions endpoint. */
  chatUrl: `${baseUrl}/v1/chat/completions`,
  /** Placeholder API key (Ollama ignores it). */
  apiKey: "ollama",
  /** Default model. */
  model: process.env.REACT_APP_OLLAMA_MODEL || "tinyllama:latest",
} as const;
