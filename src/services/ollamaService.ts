/**
 * Ollama chat API service for 3rd Eye chatbot.
 * Calls your self-hosted Ollama (e.g. tinyllama) - no real API key required.
 */

import { OLLAMA_CONFIG, OLLAMA_SYSTEM_PROMPT, IMPLEMENTATION_GUIDE_CONFIG, isOllamaOnlyBackend } from "../config/ollama";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface OllamaChatResponse {
  id: string;
  model: string;
  choices: Array<{
    message: { role: string; content: string };
    finish_reason: string;
  }>;
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

/**
 * Send a chat request to Ollama and return the assistant reply.
 * Prepends the system prompt so the model answers as 3rd Eye Feel.
 * Uses full message history for context (Ollama supports multi-turn).
 */
export async function sendChat(messages: ChatMessage[]): Promise<string> {
  const withSystem: ChatMessage[] = [
    { role: "system", content: OLLAMA_SYSTEM_PROMPT },
    ...messages,
  ];
  const res = await fetch(OLLAMA_CONFIG.chatUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(OLLAMA_CONFIG.apiKey ? { Authorization: `Bearer ${OLLAMA_CONFIG.apiKey}` } : {}),
    },
    body: JSON.stringify({
      model: OLLAMA_CONFIG.model,
      messages: withSystem.map((m) => ({ role: m.role, content: m.content })),
      stream: false,
    }),
    signal: AbortSignal.timeout(OLLAMA_CONFIG.chatTimeoutMs),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Ollama API error ${res.status}: ${text || res.statusText}`
    );
  }

  const data: OllamaChatResponse = await res.json();
  const choice = data.choices?.[0];
  if (!choice?.message?.content) {
    throw new Error("Ollama returned no reply");
  }
  return choice.message.content.trim();
}

/**
 * Check if the Ollama API is reachable (e.g. for connection status in UI).
 */
export async function checkOllamaReachable(): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_CONFIG.baseUrl}/api/tags`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Parameters for implementation / search-guides. */
export interface ImplementationGuideParams {
  serviceType: string;
  techStack?: string;
  additionalContext?: string;
}

/**
 * Implementation guide: uses POST /v1/chat/search-guides when the backend supports it (e.g. Cloud Function
 * or custom backend). When the backend is plain Ollama (port 11434), Ollama has no search-guides endpoint,
 * so we use POST /v1/chat/completions directly to avoid 404.
 */
export async function generateImplementationGuide(
  params: ImplementationGuideParams
): Promise<string> {
  const parts: string[] = [
    `Service or feature: ${params.serviceType}`,
  ];
  if (params.techStack && params.techStack !== "No preference") {
    parts.push(`Preferred tech stack: ${params.techStack}`);
  }
  if (params.additionalContext?.trim()) {
    parts.push(`Additional context: ${params.additionalContext.trim()}`);
  }
  parts.push("\nPlease provide a complete implementation guide that I can follow to build this by myself. Use clear headings and numbered steps.");
  const userContent = parts.join("\n");

  const guideSignal = () => AbortSignal.timeout(OLLAMA_CONFIG.guideTimeoutMs);
  const completionsPayload = {
    model: OLLAMA_CONFIG.model,
    messages: [
      { role: "system" as const, content: IMPLEMENTATION_GUIDE_CONFIG.systemPrompt },
      { role: "user" as const, content: userContent },
    ],
    stream: false,
  };
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(OLLAMA_CONFIG.apiKey ? { Authorization: `Bearer ${OLLAMA_CONFIG.apiKey}` } : {}),
  };

  if (isOllamaOnlyBackend) {
    const res = await fetch(OLLAMA_CONFIG.chatUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(completionsPayload),
      signal: guideSignal(),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Guide API error ${res.status}: ${text || res.statusText}`);
    }
    const data: OllamaChatResponse = await res.json();
    const choice = data.choices?.[0];
    if (!choice?.message?.content) throw new Error("Guide returned no reply");
    return choice.message.content.trim();
  }

  const searchGuidesHeaders: Record<string, string> = { ...headers };
  if (OLLAMA_CONFIG.webSearchApiKey) {
    searchGuidesHeaders["X-API-Key"] = OLLAMA_CONFIG.webSearchApiKey;
    searchGuidesHeaders["Authorization"] = `Bearer ${OLLAMA_CONFIG.webSearchApiKey}`;
  }
  const res = await fetch(OLLAMA_CONFIG.searchGuidesUrl, {
    method: "POST",
    headers: searchGuidesHeaders,
    body: JSON.stringify({
      model: OLLAMA_CONFIG.model,
      messages: [{ role: "user" as const, content: userContent }],
      stream: false,
    }),
    signal: guideSignal(),
  });

  if (res.ok) {
    const data: OllamaChatResponse = await res.json();
    const choice = data.choices?.[0];
    if (choice?.message?.content) return choice.message.content.trim();
  }

  if (res.status === 400 || res.status === 404 || res.status === 422) {
    const fallbackRes = await fetch(OLLAMA_CONFIG.chatUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(completionsPayload),
      signal: guideSignal(),
    });
    if (!fallbackRes.ok) {
      const text = await fallbackRes.text();
      throw new Error(`Guide API error ${fallbackRes.status}: ${text || fallbackRes.statusText}`);
    }
    const data: OllamaChatResponse = await fallbackRes.json();
    const choice = data.choices?.[0];
    if (!choice?.message?.content) throw new Error("Guide returned no reply");
    return choice.message.content.trim();
  }

  const text = await res.text();
  throw new Error(`Search-guides API error ${res.status}: ${text || res.statusText}`);
}
