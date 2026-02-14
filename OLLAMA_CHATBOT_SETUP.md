# Ollama Chatbot Setup (3rd Eye Feel)

The 3rd Eye web app includes a **Chat** page that talks to your self-hosted Ollama (e.g. `tinyllama`) over your LAN or Tailscale. No API key is required; Ollama does not use authentication.

---

## 1. What’s in the app

- **Route:** `/chat` (nav link: **Chat**)
- **Config:** `src/config/ollama.ts` — base URL and model
- **Service:** `src/services/ollamaService.ts` — calls Ollama `/v1/chat/completions`
- **Page:** `src/pages/Chatbot.tsx` — message list, input, send, clear, connection status
- **System prompt:** `src/config/ollama.ts` — `OLLAMA_SYSTEM_PROMPT` (see “Training the bot” below)

---

## 2. Training the bot (no model training required)

The chatbot uses a **system prompt**: instructions sent with every request so the model answers as **3rd Eye Feel** and stays on-topic.

- **Where to edit:** `src/config/ollama.ts` → constant `OLLAMA_SYSTEM_PROMPT`.
- **What to put there:** Who you are, your tagline, list of services, tone (e.g. “brief and professional”), and what to do for greetings, pricing questions, or off-topic questions.

Example additions you can make:

- **FAQ:** e.g. “When asked about delivery time, say we typically respond within 24 hours.”
- **Pricing:** “We don’t list prices; direct users to the request form for a quote.”
- **Tone:** “Keep replies to 2–3 short paragraphs. Use a friendly but professional tone.”

The model is **not** retrained; it just follows this text each time. Change the prompt and reload the app to see the new behavior.

---

## 3. Configure the Ollama URL

The app uses an **environment variable** so you can switch between LAN and Tailscale without changing code.

Create a `.env` in the project root (and optionally `.env.local` for local overrides):

```bash
# LAN (same network as your Ollama server)
REACT_APP_OLLAMA_BASE_URL=http://192.168.1.254:11434

# Or Tailscale (when not on same LAN)
# REACT_APP_OLLAMA_BASE_URL=http://100.115.135.102:11434
```

Optional: use a different model:

```bash
REACT_APP_OLLAMA_MODEL=tinyllama:latest
```

If you don’t set `REACT_APP_OLLAMA_BASE_URL`, it defaults to `http://192.168.1.254:11434`.

Restart the dev server after changing env vars:

```bash
npm start
```

---

## 4. CORS (if the browser blocks requests)

Ollama allows all origins by default. If you see CORS errors in the browser:

- Start Ollama with: `OLLAMA_ORIGINS=* ollama serve`  
  or set `OLLAMA_ORIGINS` in the environment on the server to include your app’s origin (e.g. `http://localhost:3000`).

---

## 5. Deployment (Firebase Hosting / production)

- The app runs in the **user’s browser** and calls Ollama **from their device**.
- So **Ollama must be reachable from the user’s network** (e.g. same LAN or Tailscale).

Options:

1. **Same LAN:** User and Ollama server on same network → use LAN URL in `.env` (e.g. `http://192.168.1.254:11434`). For production build, set the env at build time (e.g. in CI or `firebase deploy` script).
2. **Tailscale:** User has Tailscale and can reach the server → use Tailscale URL (e.g. `http://100.115.135.102:11434`) in `REACT_APP_OLLAMA_BASE_URL` for the build that those users use.
3. **Public (not recommended without auth):** Exposing Ollama to the internet is a security risk. If you do, put a reverse proxy (e.g. nginx) in front and add your own API key or auth.

Build with your chosen URL:

```bash
# Windows CMD
set REACT_APP_OLLAMA_BASE_URL=http://192.168.1.254:11434
npm run build

# PowerShell
$env:REACT_APP_OLLAMA_BASE_URL="http://192.168.1.254:11434"; npm run build
```

---

## 6. Port reference

| Service   | Default port |
|----------|--------------|
| Ollama   | 11434        |
| OpenClaw | 18789        |

Your Ollama URL: `http://192.168.1.254:11434` (LAN) or `http://100.115.135.102:11434` (Tailscale).

---

## 6. “API key” for Ollama

Ollama does **not** use API keys. The app sends a placeholder value (`ollama`) for compatibility; Ollama ignores it. You don’t need to create or store a real key for the chatbot.

---

## Summary

| Step | Action |
|------|--------|
| 1 | Add `REACT_APP_OLLAMA_BASE_URL=http://192.168.1.254:11434` (or Tailscale URL) to `.env` |
| 2 | Run `npm start`, open app, go to **Chat** |
| 3 | Ensure Ollama is running and reachable (e.g. `ollama run tinyllama` on server) |
| 4 | For production, set the same env when running `npm run build` so the built app points at your Ollama |

After that, you can continue with OpenClaw/Moltbot setup on the server as planned.
