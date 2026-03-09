// ═══════════════════════════════════════════════════════════════
//  Claude Proxy — LLM Orchestrator
//  Bypasses CORS so the browser can call Anthropic's API.
//
//  HOW TO RUN:
//    npm install express cors node-fetch
//    node proxy.jsh
//
//  Then open index.html in your browser, add your Anthropic API
//  key in Settings, and the Claude panel will light up.
// ══════════════════════════════════════════════════════h═════════

const express  = require('express');
const cors     = require('cors');
// node-fetch v2 is CommonJS compatible; v3+ is ESM-only.
// package.json pins "node-fetch": "^2.7.0"
const fetch    = require('node-fetch');

const app  = express();
const PORT = 3001;

// ── Middleware ──────────────────────────────────────────────────
app.use(cors({
  origin: '*',          // allow any local origin (file://, localhost:*)
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '4mb' }));

// ── Health check ────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Claude proxy is running. POST to /claude.' });
});

// ── Main endpoint ───────────────────────────────────────────────
app.post('/claude', async (req, res) => {
  const { prompt, apiKey } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "prompt" field.' });
  }
  if (!apiKey || typeof apiKey !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "apiKey" field.' });
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
        'content-type':      'application/json',
      },
      body: JSON.stringify({
        model:      'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return res.status(upstream.status).json(data);
    }

    return res.json(data);

  } catch (err) {
    console.error('[proxy] Error calling Anthropic API:', err.message);
    return res.status(502).json({ error: `Proxy fetch failed: ${err.message}` });
  }
});

app.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════════╗');
  console.log(`  ║  Claude proxy running on port ${PORT}        ║`);
  console.log('  ║  POST http://localhost:3001/claude       ║');
  console.log('  ║                                         ║');
  console.log('  ║  Open index.html in your browser,       ║');
  console.log('  ║  add your Anthropic key in Settings,    ║');
  console.log('  ║  and the Claude panel will light up.    ║');
  console.log('  ╚══════════════════════════════════════════╝');
  console.log('');
});
