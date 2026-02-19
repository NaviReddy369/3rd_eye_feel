import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendChat, checkOllamaReachable, type ChatMessage } from "../services/ollamaService";
import { OLLAMA_CONFIG } from "../config/ollama";
import Button from "../components/Button";

const Chatbot: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initialMessageSentRef = useRef(false);

  useEffect(() => {
    checkOllamaReachable()
      .then(setConnected)
      .catch(() => setConnected(false));
  }, []);

  // When navigated from homepage with an initial message, send it once
  useEffect(() => {
    const initial = (location.state as { initialMessage?: string } | null)?.initialMessage?.trim();
    if (!initial || initialMessageSentRef.current) return;
    initialMessageSentRef.current = true;
    navigate(location.pathname, { replace: true, state: {} }); // clear state so refresh doesn't resend
    const userMessage: ChatMessage = { role: "user", content: initial };
    setMessages([userMessage]);
    setLoading(true);
    setError(null);
    sendChat([userMessage])
      .then((reply) => {
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : "Failed to get reply";
        setError(msg);
        setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${msg}` }]);
      })
      .finally(() => setLoading(false));
  }, [location.state, navigate, location.pathname]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setError(null);
    const userMessage: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const newMessages: ChatMessage[] = [...messages, userMessage];
      const reply = await sendChat(newMessages);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to get reply";
      setError(message);
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${message}` }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleClear = () => {
    setMessages([]);
    setError(null);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-tech-dark flex flex-col">
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-tech-text" style={{ background: "linear-gradient(135deg, #0066ff 0%, #00d9ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              3rd Eye Chatbot
            </h1>
            <p className="text-sm text-tech-text-muted mt-0.5">
              Web application info and enrollment/account help · {OLLAMA_CONFIG.model}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {connected === true && (
              <span className="flex items-center gap-1.5 text-tech-accent text-sm">
                <span className="w-2 h-2 rounded-full bg-tech-accent animate-pulse" />
                Connected
              </span>
            )}
            {connected === false && (
              <span className="flex items-center gap-1.5 text-amber-400 text-sm">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Cannot reach Ollama
              </span>
            )}
            {messages.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleClear}>
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-tech-border bg-tech-darker/50 p-4 min-h-[320px] max-h-[60vh]">
          {messages.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center py-8 px-4">
              <p className="text-tech-text-muted mb-2">Ask about this app, our services, or your enrollment.</p>
              <p className="text-tech-text-muted/80 text-sm">Example: &quot;What implementation guides do you offer?&quot;</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-2.5 ${
                  msg.role === "user"
                    ? "bg-tech-cyan/20 border border-tech-cyan/40 text-tech-text"
                    : "bg-tech-gray border border-tech-border text-tech-text"
                }`}
              >
                <p className="text-sm font-medium text-tech-text-muted mb-0.5">
                  {msg.role === "user" ? "You" : "Assistant"}
                </p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start mb-4">
              <div className="bg-tech-gray border border-tech-border rounded-lg px-4 py-2.5">
                <span className="flex items-center gap-2 text-tech-text-muted text-sm">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Thinking...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && (
          <p className="mt-2 text-sm text-amber-400" role="alert">
            {error}
          </p>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Type a message..."
            rows={2}
            className="flex-1 rounded-lg border border-tech-border bg-tech-gray px-4 py-3 text-tech-text placeholder-tech-text-muted/60 focus:outline-none focus:ring-2 focus:ring-tech-cyan/50 focus:border-tech-cyan/50 resize-none"
            disabled={loading}
            aria-label="Chat message"
          />
          <Button type="submit" disabled={loading || !input.trim()} className="self-end">
            Send
          </Button>
        </form>

        <p className="mt-3 text-xs text-tech-text-muted text-center">
          Ollama at {OLLAMA_CONFIG.baseUrl} · No API key required
        </p>
      </div>
    </div>
  );
};

export default Chatbot;
