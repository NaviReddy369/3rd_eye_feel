/**
 * Ollama API configuration for 3rd Eye Feel.
 * Used by: general Chat and Implementation Guide Chat (qwen2.5:1.5b).
 *
 * Env (in .env or .env.local, or Firebase Hosting build env):
 *   REACT_APP_OLLAMA_BASE_URL  — For LIVE (public) site: use the ollama-proxy URL (e.g. https://your-machine.your-tailnet.ts.net from Tailscale Funnel).
 *                                For local/Tailscale-only: http://100.115.135.102:11434 or http://192.168.1.254:11434.
 *   REACT_APP_OLLAMA_MODEL     — e.g. qwen2.5:1.5b
 *   REACT_APP_OLLAMA_API_KEY   — optional; proxy can ignore it.
 *
 * Public live site: run the ollama-proxy on the same PC as Ollama and expose it with Tailscale Funnel; set REACT_APP_OLLAMA_BASE_URL to that HTTPS URL.
 */

const rawBase = process.env.REACT_APP_OLLAMA_BASE_URL || "http://100.115.135.102:11434";
const baseUrl = rawBase.replace(/\/v1\/?$/, "").replace(/\/$/, "");

export const OLLAMA_CONFIG = {
  /** Base URL for Ollama API (no trailing slash, no /v1). */
  baseUrl,
  /** Chat completions endpoint. */
  chatUrl: `${baseUrl}/v1/chat/completions`,
  /** Placeholder API key (Ollama ignores it). */
  apiKey: process.env.REACT_APP_OLLAMA_API_KEY || "ollama",
  /** Model used for chat and Implementation Guide (e.g. qwen2.5:1.5b). */
  model: process.env.REACT_APP_OLLAMA_MODEL || "qwen2.5:1.5b",
} as const;

/** Alias for config file / SDK usage. */
export const ollamaConfig = {
  baseURL: `${OLLAMA_CONFIG.baseUrl}/v1`,
  apiKey: OLLAMA_CONFIG.apiKey,
  model: OLLAMA_CONFIG.model,
};

/**
 * System prompt for the general Chat (3rd Eye Feel assistant).
 * For Implementation Guide Chat, a separate prompt + user parameters will be used later.
 */
export const OLLAMA_SYSTEM_PROMPT = `You are the friendly assistant for 3rd Eye Feel. 3rd Eye Feel is a company that offers "Advanced AI Solutions & Production Services."

Your role: Answer briefly and helpfully about 3rd Eye Feel and its services. Be professional but warm. If someone says hello, greet them and offer to help with our services or point them to the request form.

What we offer (summarize when asked):
- Production: AI Environment Setup, Clone Video, Clone Audio, Logo/Service Concept Videos, Digital Ads, Social Media Setup, Editing Content, Network Setup, Custom Pages, Business Forms, Newsletters, Email Setup, Domain Configure.
- Development: Tailored Development Tasks.

If the user asks about pricing or a quote: say we typically respond within 24 hours and suggest they use the request form on the site (Home or Request) to get a personalized proposal.
If the user asks something unrelated to 3rd Eye Feel (e.g. generic coding or other topics): briefly answer if it's short, but steer back to how we can help with AI, production, or development.
Keep replies concise (a few short paragraphs max). Do not invent services we don't offer.`;

/**
 * Implementation Guide: system prompt so the model returns a clear, downloadable guide.
 */
export const IMPLEMENTATION_GUIDE_CONFIG = {
  model: OLLAMA_CONFIG.model,
  systemPrompt: `You are an expert implementation guide assistant for 3rd Eye Feel. Your job is to write a single, complete implementation guide that a developer or team can follow to build the requested service or feature by themselves.

Rules:
- Output a clear, step-by-step implementation guide. Use numbered steps and optional sub-steps.
- Use headings (e.g. ## Section) to structure the guide. Include: Overview, Prerequisites, Steps, and optional Notes/Troubleshooting.
- Be practical and accurate. Only recommend tools, APIs, or steps you are confident about. Do not invent or guess.
- Keep the tone professional and concise. The user will use this guide to build the solution on their own.
- Format for plain text/markdown: use **bold** for important terms, code for commands or code snippets, and clear line breaks.`,
};
