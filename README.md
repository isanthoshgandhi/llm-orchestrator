# ⚡ LLM Orchestrator

> **Query 6 AI models + Google Search simultaneously. Free to start. No backend required.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Free to Start](https://img.shields.io/badge/Free%20to%20Start-Groq%20%2B%20Google-orange)](https://console.groq.com)
[![No Build Required](https://img.shields.io/badge/No%20Build-Single%20HTML%20File-blue)](#)

---

<!-- SCREENSHOT PLACEHOLDER -->
<!--
  Free Mode (2 panels active):
  [Insert screenshot: free-mode.png]

  Full 6-Panel Mode:
  [Insert screenshot: full-mode.png]
-->

## What It Does

Open a single `index.html` file in your browser. Type one prompt. Hit **Send to All**. Watch responses stream in side-by-side from:

| Panel | Provider | Model | Cost |
|-------|----------|-------|------|
| 🤖 | OpenAI | GPT-4o | Paid |
| ✨ | Google Gemini | gemini-1.5-pro | Paid |
| 🔍 | Perplexity | sonar-large-128k-online | Paid |
| ⚡ | **Groq** | llama-3.1-70b-versatile | **Free tier** |
| 🌐 | **Google Search** | Custom Search API | **Free (100/day)** |
| 🧠 | Claude (Anthropic) | claude-3-5-sonnet | Paid + proxy |

All calls fire **in parallel** via `Promise.all`. Response times shown per panel.

---

## Start in 60 Seconds (Free Mode)

No paid account, no credit card. Just Groq + Google Search.

**Step 1 — Get a free Groq key (30 seconds)**

1. Go to [console.groq.com/keys](https://console.groq.com/keys)
2. Sign up (email + Google, no card needed)
3. Click "Create API Key" → copy it

**Step 2 — Get a free Google Custom Search setup**

1. Go to [programmablesearchengine.google.com](https://programmablesearchengine.google.com/)
2. Create a new search engine → copy the **Search Engine ID (cx)**
3. Go to [console.developers.google.com](https://console.cloud.google.com/apis/library/customsearch.googleapis.com), enable the **Custom Search API**, create a key → copy it

**Step 3 — Open the app**

```
# No install needed — just open the file
open index.html
# or double-click it in Finder/Explorer
```

**Step 4 — Add keys in Settings**

Click ⚙ Settings at the top right. Paste your Groq key and both Google Search credentials. Click Save for each.

**Step 5 — Type a prompt and hit "Send to All"**

The Groq and Google Search panels light up instantly. The other 4 panels show a clean "Add API key to unlock" state — not errors.

---

## Full Setup — All 6 Providers

### 1. OpenAI (GPT-4o)

- Get key: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Requires a paid account (usage-based billing)
- Model: `gpt-4o`

### 2. Google Gemini

- Get key: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- Google AI Studio has a free tier with rate limits
- Model: `gemini-1.5-pro`

### 3. Perplexity

- Get key: [perplexity.ai/settings/api](https://www.perplexity.ai/settings/api)
- Requires a paid Perplexity API subscription
- Model: `llama-3.1-sonar-large-128k-online` (web-grounded)

### 4. Groq — Free Tier ✅

- Get key: [console.groq.com/keys](https://console.groq.com/keys)
- No credit card required
- Model: `llama-3.1-70b-versatile`
- Rate limits apply on free tier (generous for personal use)

### 5. Google Custom Search — Free Tier ✅

- **API Key**: [Google Cloud Console](https://console.cloud.google.com/apis/library/customsearch.googleapis.com) → Enable API → Create credentials
- **Search Engine ID (cx)**: [Programmable Search Engine](https://programmablesearchengine.google.com/) → New search engine → copy ID
- Free tier: 100 queries/day
- Panel displays top 5 results as clickable links with title + snippet

### 6. Claude (Anthropic) — Requires Local Proxy

Claude's API blocks direct browser requests due to CORS. A tiny local proxy solves this.

See the **Enabling Claude Panel** section below.

---

## Enabling Claude Panel

The Claude panel requires two things: your Anthropic API key and a running local proxy.

### Step 1 — Install proxy dependencies

```bash
cd /path/to/llm-orchestrator
npm install
```

### Step 2 — Start the proxy

```bash
node proxy.js
```

You should see:

```
  ╔══════════════════════════════════════════╗
  ║  Claude proxy running on port 3001       ║
  ║  POST http://localhost:3001/claude       ║
  ...
  ╚══════════════════════════════════════════╝
```

### Step 3 — Add your Anthropic API key

- Get key: [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
- In the app: ⚙ Settings → Claude → paste key → Save

### Step 4 — Reload the app

The Claude panel will now respond alongside the others.

**Note:** `proxy.js` only runs locally. Your API key is sent from the browser to `localhost:3001`, which forwards it to Anthropic. It never touches any external server you don't control.

---

## Security & Privacy

- **API keys stored in `localStorage`** — they never leave your browser (except to go directly to each provider's API)
- **No analytics, no telemetry, no backend**
- **Claude is the only exception**: your key travels from browser → localhost:3001 → Anthropic. The proxy runs on your machine.
- Keys can be cleared at any time by removing them in Settings or running `localStorage.clear()` in the browser console

---

## Architecture

```
┌─────────────────────────────────┐
│          index.html             │
│   (runs entirely in browser)    │
│                                 │
│  ┌──────┐  Promise.all fires   │
│  │Prompt│─────────────────────►│
│  └──────┘                      │
│      │                         │
│      ├─── OpenAI API ─────────►│ direct
│      ├─── Gemini API ─────────►│ direct
│      ├─── Perplexity API ─────►│ direct
│      ├─── Groq API ───────────►│ direct
│      ├─── Google Search API ──►│ direct
│      └─── localhost:3001 ──────┤ proxy
│                                 │     │
└─────────────────────────────────┘     ▼
                               ┌────────────────┐
                               │   proxy.js     │
                               │ (Node.js local)│
                               └────────┬───────┘
                                        │
                                        ▼
                               Anthropic API
```

---

## File Structure

```
llm-orchestrator/
├── index.html      # The entire app — open this in any browser
├── proxy.js        # Tiny Express proxy for Claude/Anthropic CORS
├── package.json    # Proxy dependencies only
├── .gitignore
├── LICENSE
└── README.md
```

---

## Running in Different Environments

**Local file** (simplest):
```
open index.html   # macOS
start index.html  # Windows
xdg-open index.html  # Linux
```

**Local web server** (if you need to test service workers, etc.):
```bash
npx serve .
# or
python3 -m http.server 8080
```

**GitHub Pages / Netlify / Vercel**: Just push the repo. `index.html` is fully static — it works without any server.

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Enter` / `Cmd+Enter` | Send to all |
| Settings gear | Toggle API key panel |

---

## Extending the App

To add a new provider, add a panel section in `index.html` and a new `callXxx()` function following the existing pattern. All calls participate in the same `Promise.all` flow.

---

## Contributing

PRs welcome. Key areas for improvement:

- Streaming responses (SSE / chunked)
- Token count display per panel
- Response export (JSON, Markdown)
- Prompt history
- Side-by-side diff view

---

## License

MIT — see [LICENSE](LICENSE). Use it, fork it, build on it.
