/**
 * Ollama API configuration for 3rd Eye Feel.
 * Live backend: https://navig96-ai.taila39f08.ts.net (model mistral:latest).
 *
 * Env:
 *   REACT_APP_OLLAMA_BASE_URL           — Backend base (Cloud Function or direct backend URL).
 *   REACT_APP_OLLAMA_MODEL              — e.g. mistral:latest
 *   REACT_APP_OLLAMA_WEB_SEARCH_API_KEY — Optional. Used only for POST /v1/chat/search-guides (web-enhanced guides).
 *                                         Backend uses it to fetch web snippets; your local model then writes the guide.
 */

const rawBase = process.env.REACT_APP_OLLAMA_BASE_URL || "http://100.115.135.102:11434";
const baseUrl = rawBase.replace(/\/v1\/?$/, "").replace(/\/$/, "");

/** True when base URL is plain Ollama (port 11434). Ollama has no /v1/chat/search-guides; use completions for guides. */
export const isOllamaOnlyBackend = /:11434(\/|$)/.test(baseUrl);

export const OLLAMA_CONFIG = {
  baseUrl,
  chatUrl: `${baseUrl}/v1/chat/completions`,
  searchGuidesUrl: `${baseUrl}/v1/chat/search-guides`,
  apiKey: process.env.REACT_APP_OLLAMA_API_KEY || "ollama",
  webSearchApiKey: process.env.REACT_APP_OLLAMA_WEB_SEARCH_API_KEY || "",
  model: process.env.REACT_APP_OLLAMA_MODEL || "mistral:latest",
  chatTimeoutMs: 120000,
  guideTimeoutMs: 180000,
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

/** Implementation Guide: used when falling back to chat completions; search-guides endpoint has its own behavior. */
export const IMPLEMENTATION_GUIDE_CONFIG = {
  model: OLLAMA_CONFIG.model,
  systemPrompt: `You are an expert implementation guide assistant for 3rd Eye Feel. Write a single, complete implementation guide with clear headings and numbered steps. Use markdown.`,
};
