# Ollama proxy (public API for live site)

This proxy runs on the **same machine as Ollama** and forwards chat requests from your Firebase Hosting site. Expose it with **Tailscale Funnel** so anyone on the internet can use your AI features.

## Why you need it

- **Firebase Hosting** serves static files. Visitors’ browsers call your API from the **public internet**.
- **Ollama** is on your PC (or a Tailscale IP). It’s not reachable from the public internet.
- The **proxy** runs next to Ollama and is exposed via **Tailscale Funnel** with a public HTTPS URL. Your live site calls that URL → proxy forwards to Ollama → response goes back to the user.

**If the live site gets 403** when calling the Funnel URL, Tailscale Funnel may be blocking cross-origin requests. Use the **Firebase Cloud Function** `ollamaProxy` instead: set `REACT_APP_OLLAMA_BASE_URL` to your Cloud Function URL (see root README or “Live site: public AI API”) and set `OLLAMA_PROXY_URL=https://your-funnel-url` in `functions/.env`, then run `firebase deploy --only functions`. The function reads the proxy URL from `functions/.env` (no deprecated `functions.config()`).

## Quick setup

### 1. Install and run Ollama (if not already)

- Install [Ollama](https://ollama.com).
- Run and pull a small model (e.g. for 4 GB VRAM):

  ```bash
  ollama serve
  ollama run qwen2.5:1.5b
  ```

- Keep `ollama serve` running (or run a model so the server is up).

### 2. Run the proxy (this folder)

```bash
cd ollama-proxy
npm install
npm start
```

Default: listens on **port 3456**, forwards to `http://127.0.0.1:11434`.  
To change port: `PORT=8080 npm start`.  
To change Ollama URL: `OLLAMA_URL=http://127.0.0.1:11434 npm start`.

### 3. Expose the proxy with Tailscale Funnel

On the **same machine** (Windows: open PowerShell or CMD **as Administrator**):

```bash
tailscale funnel 3456
```

You’ll see something like:

```text
Available on the internet:
https://your-machine.your-tailnet.ts.net
|-- / proxy http://127.0.0.1:3456
```

That **HTTPS URL** is your public API base. Copy it (no path, no trailing slash).

### 4. Point the live site at the proxy

When building the React app for production, set:

- **`REACT_APP_OLLAMA_BASE_URL`** = the Funnel URL, e.g. `https://your-machine.your-tailnet.ts.net`

Options:

- **Local build:** Create `.env.production` in the project root with:
  ```env
  REACT_APP_OLLAMA_BASE_URL=https://your-machine.your-tailnet.ts.net
  REACT_APP_OLLAMA_MODEL=qwen2.5:1.5b
  ```
  Then run `npm run build` and deploy (e.g. `firebase deploy --only hosting`).

- **Firebase / CI:** In your build config, set the same env vars so the built app uses the proxy URL.

### 5. Allowed origins (CORS)

The proxy allows requests from:

- `https://3rdeyefeel.web.app`
- `https://3rdeyefeel.firebaseapp.com`
- `http://localhost:3000`

To add more (e.g. custom domain), set **`ALLOWED_ORIGINS`** when starting the proxy:

```bash
set ALLOWED_ORIGINS=https://3rdeyefeel.web.app,https://yourdomain.com
npm start
```

## Checklist for “live site works for everyone”

1. Ollama is running on your PC (`ollama serve` or model running).
2. Proxy is running (`cd ollama-proxy && npm start`).
3. Tailscale is connected on that PC and Funnel is on: `tailscale funnel 3456`.
4. The React app was built with `REACT_APP_OLLAMA_BASE_URL` = your Funnel URL.
5. Deployed to Firebase Hosting (`firebase deploy --only hosting`).

## Optional: run proxy in the background (Windows)

- Use **NSSM** or **pm2** to run `node server.js` as a service so it restarts on reboot.
- Or run it in a terminal and leave it open while you want the live site’s AI to work.

## Security note

The Funnel URL is public. Anyone who knows it could send requests to your model. For production you can later add a simple API key in the proxy and send it from the frontend (or use Firebase Auth and have a Cloud Function call the proxy with a server-side key).
