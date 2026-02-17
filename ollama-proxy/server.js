/**
 * Ollama API proxy for 3rd Eye Feel.
 * Run on the same machine as Ollama. Expose with: tailscale funnel 3456
 * Frontend (Firebase Hosting) calls this URL for chat and /api/tags.
 *
 * If you get 403 from the browser, the 403 may be from Tailscale Funnel
 * (e.g. blocking CORS preflight). Use the Firebase Cloud Function "ollamaProxy"
 * as REACT_APP_OLLAMA_BASE_URL instead so the browser never calls Funnel directly.
 */

const express = require("express");
const cors = require("cors");

const PORT = Number(process.env.PORT) || 3456;
const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434";

// Permissive CORS so any origin can call (no cookies; credentials: false).
// Tailscale Funnel may still return 403 for cross-origin requests; then use Firebase Function.
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean)
  : true; // allow any origin when not set

const app = express();
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: false }));
app.use(express.json({ limit: "1mb" }));

// Log requests (so you can see on the server if 403 is from Funnel or from here)
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// CORS preflight: respond to OPTIONS so browser can then send GET/POST
app.options("/api/tags", (_req, res) => {
  res.set("Access-Control-Allow-Origin", _req.headers.origin || "*");
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(204).end();
});
app.options("/v1/chat/completions", (_req, res) => {
  res.set("Access-Control-Allow-Origin", _req.headers.origin || "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(204).end();
});

// Health check (optional)
app.get("/health", (_, res) => {
  res.json({ ok: true, ollama: OLLAMA_URL });
});

// Proxy: GET /api/tags (list models)
app.get("/api/tags", async (req, res) => {
  try {
    const r = await fetch(`${OLLAMA_URL}/api/tags`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const text = await r.text();
    res.status(r.status).set("Content-Type", "application/json").send(text);
  } catch (err) {
    console.error("Proxy GET /api/tags:", err.message);
    res.status(502).json({ error: "Ollama unreachable", detail: err.message });
  }
});

// Proxy: POST /v1/chat/completions (OpenAI-compatible chat)
app.post("/v1/chat/completions", async (req, res) => {
  try {
    const r = await fetch(`${OLLAMA_URL}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const text = await r.text();
    res.status(r.status).set("Content-Type", "application/json").send(text);
  } catch (err) {
    console.error("Proxy POST /v1/chat/completions:", err.message);
    res.status(502).json({ error: "Ollama unreachable", detail: err.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Ollama proxy listening on http://0.0.0.0:${PORT}`);
  console.log(`Forwarding to ${OLLAMA_URL}`);
  console.log(`CORS: ${ALLOWED_ORIGINS === true ? "any origin" : ALLOWED_ORIGINS.join(", ")}`);
  console.log(`Expose publicly: tailscale funnel ${PORT}`);
});
