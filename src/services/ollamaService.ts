/**
 * Ollama chat API service for 3rd Eye chatbot.
 * Calls your self-hosted Ollama (e.g. tinyllama) - no real API key required.
 */

import { OLLAMA_CONFIG, OLLAMA_SYSTEM_PROMPT } from "../config/ollama";

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
      // Ollama doesn't require auth; some proxies might expect a key
      ...(OLLAMA_CONFIG.apiKey
        ? { Authorization: `Bearer ${OLLAMA_CONFIG.apiKey}` }
        : {}),
    },
    body: JSON.stringify({
      model: OLLAMA_CONFIG.model,
      messages: withSystem.map((m) => ({ role: m.role, content: m.content })),
      stream: false,
    }),
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
