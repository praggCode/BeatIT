# BeatIT — API Load Testing & Performance Profiling Tool

> **"Know your API's breaking point before your users find it."**

---

## The Problem

Every developer tests their API with one request at a time. Nobody tests what happens when 500 users hit it simultaneously — until launch day, when it's too late.

Existing tools each have real limitations:

| Tool | Limitation |
|------|-----------|
| **JMeter** | Java-dependent, XML-based test plans, heavy resource usage, steep learning curve |
| **k6** | CLI-only, requires scripting knowledge, no visual feedback during tests |
| **Locust** | Requires Python scripting, no built-in visual dashboard |
| **Postman Load Testing** | Cloud-dependent, rate-limited, requires paid plan for meaningful scale |

**The common gap:** None of them let you paste a URL and get results in under a minute without setup. There's no lightweight, browser-based tool a developer can open, configure in seconds, and get professional-grade results immediately.

---

## The Solution

A web-based API load testing and performance profiling tool that lets developers simulate concurrent traffic, visualize real-time metrics, and generate structured reports — with **zero configuration overhead**.

**One URL. One click. Full performance picture.**

- 100% free to use, host, and deploy
- No accounts. No cloud dependency. Self-hosted on any machine.
- Every feature is powered by a well-known, battle-tested npm module

---

## Module Map — What Powers What

| Feature | npm Module | Why |
|---------|-----------|-----|
| HTTP load generation | `undici` | Fastest Node.js HTTP client, built into Node 18+, connection pooling built-in |
| WebSocket server (live metrics) | `ws` | Lightest production-grade WebSocket library for Node.js |
| Percentile calculation | `hdr-histogram-js` | O(1) HDR histogram — same as Elastic APM and New Relic |
| Worker thread orchestration | `piscina` | Production worker thread pool with built-in back-pressure |
| Rate limiting / token bucket | `limiter` | Token bucket algorithm, zero dependencies |
| Frontend charts | `recharts` | React-native charting, composable, zero config |
| Frontend framework | `vite` + `react` | Instant dev server, fast builds |
| AI diagnostics | `@google/generative-ai` | Official Gemini SDK — free tier, no credit card |
| PDF report generation | `md-to-pdf` | Markdown → PDF in 3 lines, zero system deps |
| Run diff / metric delta | `deep-diff` | Structured object diffing with path-level change detection |
| SLA alerting | `eventemitter3` | High-performance event emitter for threshold breach events |
| CLI / config | `commander` | Standard Node.js CLI argument parsing |

> Every answer to "how does X work?" is a module name. No hand-rolled algorithms to defend.

---

## Core Features

### 1. Real-Time Metrics Dashboard
**Module: `ws` + `recharts`**

Metrics stream live to the browser as the test runs — no polling, no refresh.

```js
const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ port: 8080 });
wss.clients.forEach(client => client.send(JSON.stringify(metrics)));
```

Live data streamed every 500ms:
- **p50 / p95 / p99 latency** — reported by `hdr-histogram-js`
- **Throughput** — requests successfully handled per second
- **Error rate** — percentage of failed or timeout responses
- **Active concurrent users** — live count throughout the test

> p99 = the worst 1% of your users' experience. Average hides this — percentiles don't. This is how Netflix, Google, and Amazon measure API health.

---

### 2. Latency Heatmap
**Module: `recharts` (ScatterChart) or plain Canvas API**

A 2D grid rendered in the browser:
- **X-axis:** time elapsed during the test
- **Y-axis:** latency buckets (0–50ms, 50–100ms, 100–250ms, etc.)
- **Color intensity:** number of requests landing in each bucket at each moment

Reveals patterns invisible to percentile numbers alone — "every 30 seconds there's a latency spike" points to a GC pause or scheduled database job. This is the Grafana/Datadog view senior engineers immediately recognize.

---

### 3. HTTP Load Generation
**Module: `undici`**

`undici` is Node.js's fastest built-in HTTP client — used internally by Node 18+ itself. It supports connection pooling, keep-alive, and concurrent dispatching without the overhead of `axios` or `node-fetch`.

```js
const { Pool } = require('undici');
const pool = new Pool(targetUrl, { connections: 50 });
await pool.request({ method: 'POST', path: '/api/login', body: payload });
```

Each worker thread gets its own `undici` Pool — requests stay isolated per thread, measurements stay accurate.

---

### 4. Three Load Strategies
**Module: `piscina` (worker pool) + custom ramp scheduler**

**Instant Spike** — All virtual users fire simultaneously at second zero. Tests how the API handles a sudden traffic burst (viral post, flash sale). Finds the absolute breaking point fast.

**Gradual Ramp** — Starts at 10% of target users, linearly adds more until full concurrency at the halfway mark, then holds. Reveals the exact concurrency level where degradation begins.

**Step Function** — Hold at 25% → 50% → 75% → 100%, 60 seconds per step. How Netflix and Amazon do capacity planning. Each step provides a stable measurement window; graphs show clean stair-step patterns with visible latency shifts at each level.

```js
// Step function scheduler
for (const step of [0.25, 0.5, 0.75, 1.0]) {
  await pool.run({ concurrency: Math.floor(targetUsers * step) });
  await sleep(60_000);
}
```

---

### 5. Bottleneck Detection Engine
**Module: `eventemitter3`**

Automatic post-test analysis using three proven signals. When any signal trips, `eventemitter3` fires a breach event that updates the dashboard in real time.

```js
const EventEmitter = require('eventemitter3');
const ee = new EventEmitter();
ee.on('breach', ({ metric, value, threshold }) => wss.broadcast(alert));
```

| Signal | What it means |
|--------|--------------|
| **p99 > 3× p50** | Occasional slow code path — cache miss, slow DB query, third-party call |
| **Error rate > 2%** | Resource limit hit — connection pool, file descriptors, OOM |
| **Throughput drops as concurrency rises** | Lock contention or thread starvation |

Output: *"BeatIT detected saturation at ~80 concurrent users. Beyond this point, throughput drops and p99 spikes — consistent with connection pool exhaustion."*

---

### 6. HDR Histogram for Latency (O(1) Percentile Calculation)
**Module: `hdr-histogram-js`**

Naive percentile implementations store every latency value in an array and call `.sort()`. At 100,000 requests that's O(n log n) every tick — the tool becomes the bottleneck.

`hdr-histogram-js` maintains a fixed array of exponential buckets. Recording a latency value is one O(1) counter increment. Percentile lookup is one O(1) bucket scan. Memory footprint is constant regardless of request count.

```js
const { build } = require('hdr-histogram-js');
const histogram = build({ lowestDiscernibleValue: 1, highestTrackableValue: 30000 });

histogram.recordValue(responseTimeMs);    // O(1)
histogram.getValueAtPercentile(99);        // O(1) — p99
```

Used in production by Elastic APM and New Relic. BSD-2-Clause licensed.

> When a judge asks *"how do you calculate percentiles?"* — "O(1) HDR histogram via `hdr-histogram-js`" is a complete, defensible answer.

---

### 7. Worker Thread Pool with Back-Pressure Control
**Module: `piscina`**

Node.js is single-threaded. `Promise.all(500 requests)` creates event-loop lag that contaminates latency measurements — you end up measuring your own tool's overhead, not the API's real performance.

`piscina` is the standard production worker thread pool for Node.js — used internally by Vite and ESBuild. It distributes tasks across CPU cores and has built-in back-pressure: when the queue fills faster than workers can drain it, `piscina` automatically applies backpressure so the tool doesn't crash mid-test.

```js
const Piscina = require('piscina');
const pool = new Piscina({ filename: './worker.js', maxThreads: 8 });

const results = await Promise.all(
  virtualUsers.map(user => pool.run({ userId: user.id, target: url }))
);
```

Virtual user ceiling: **500 for single-machine build.** For production use beyond 500, horizontal scaling across multiple BeatIT instances is the path.

---

### 8. Token Bucket Rate Limiter
**Module: `limiter`**

Optionally cap requests per second to simulate realistic traffic shaping — useful for testing "what if we throttle to 100 req/s, does tail latency improve?"

```js
const { RateLimiter } = require('limiter');
const limiter = new RateLimiter({ tokensPerInterval: 100, interval: 'second' });

await limiter.removeTokens(1); // blocks until a token is available
await pool.request(req);
```

One npm install. No manual token bucket math to explain.

---

### 9. Adaptive Saturation Detection — Auto-Find the Breaking Point
**Module: `piscina` + `hdr-histogram-js` (feeds the probe loop)**

BeatIT finds the API breaking point automatically using an additive-increase probe — the same algorithm family as TCP congestion control. No other free tool does this automatically.

```js
let concurrency = 10;
while (true) {
  const metrics = await runWindow({ concurrency, duration: 15_000 });
  if (metrics.p99 > P99_THRESHOLD || metrics.errorRate > 0.02) {
    console.log(`Saturation point: ~${concurrency} users`);
    break;
  }
  concurrency += STEP_SIZE; // additive increase
}
```

Output: *"BeatIT found your API's saturation point at ~80 concurrent users. Above this, response times become unstable."*

---

### 10. AI-Powered Diagnostic Engine
**Module: `@google/generative-ai` (Gemini 2.5 Flash — genuinely free)**

After test completion, BeatIT sends structured JSON metrics to Gemini 2.5 Flash and receives a root-cause diagnostic report.

```js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const result = await model.generateContent(`
  API performance metrics: ${JSON.stringify(metrics)}
  Diagnose the root cause and provide specific fix recommendations.
`);
```

**Output includes:**
- Root cause hypothesis (connection pool exhaustion, N+1 query, GC pressure, etc.)
- Specific fix recommendations
- Production risk assessment

**Cost:** Google AI Studio free tier — no credit card, no expiry, 1,000 requests/day. API key at aistudio.google.com in 5 minutes.

---

### 11. PDF Report Generation
**Module: `md-to-pdf`**

After every test, BeatIT builds a Markdown string from live test data and converts it to a professionally formatted PDF — one-click download, no templating engines, no HTML wrangling.

```js
const { mdToPdf } = require('md-to-pdf');

const markdownReport = buildReportMarkdown(testResults); // plain string interpolation
const pdf = await mdToPdf({ content: markdownReport });
fs.writeFileSync('beatit-report.pdf', pdf.content);
```

**Report contains:** test config, p50/p95/p99 summary, throughput, error rate, bottleneck findings, saturation point, AI diagnostic output, SLA breach log, and comparative diff.

Single `npm install md-to-pdf`. MIT licensed. No Puppeteer configuration, no system Chrome dependency to manage.

---

### 12. Comparative Run Diffing
**Module: `deep-diff`**

Run the same test before and after an optimization. `deep-diff` produces a structured, path-level diff of every metric object — percentage deltas, regressions flagged in red, improvements in green.

```js
const { diff } = require('deep-diff');
const changes = diff(runA.metrics, runB.metrics);
// returns structured array: { kind, path, lhs, rhs } for every changed value
```

Mirrors how real performance engineers validate fixes — every optimization is verified by a before/after test.

---

### 13. SLA Threshold Enforcement with Live Alerts
**Module: `eventemitter3`**

Industry-standard thresholds baked in — no configuration required:

| Metric | Warning | Critical |
|--------|---------|----------|
| p95 latency | > 500ms | > 1000ms |
| p99 latency | > 1000ms | > 3000ms |
| Error rate | > 1% | > 5% |
| Throughput drop | > 20% | > 50% |

Evaluated on every WebSocket tick. Breach events fire instantly to the dashboard via `eventemitter3`. Users can override defaults — but the tool works intelligently out of the box.

---

## Full Install

```bash
npm install undici ws piscina hdr-histogram-js limiter eventemitter3 \
            deep-diff md-to-pdf @google/generative-ai commander

# Frontend
npm install react recharts vite
```

Everything above is free, MIT or BSD licensed, and actively maintained.

---

## Architecture

```
Browser (React + Recharts + Canvas)
        │  WebSocket — ws
        ▼
Express Server (Node.js)
        │
        ├── Test Orchestrator
        │       ├── piscina  ──── Worker Thread Pool (8 threads)
        │       │       └── undici Pool ── virtual users per thread
        │       ├── limiter  ──── Token Bucket Rate Limiter
        │       └── Saturation Probe ── additive-increase loop
        │
        ├── Metric Aggregator
        │       ├── hdr-histogram-js ── O(1) percentiles
        │       ├── eventemitter3 ─────  SLA breach events
        │       └── deep-diff ─────────  comparative run diffing
        │
        ├── AI Diagnostic Engine
        │       └── @google/generative-ai → Gemini 2.5 Flash (free)
        │
        └── Report Generator
                └── md-to-pdf → PDF download
```

**Deployment:** `npm install && npm start` — no Docker, no cloud account, no config files.

---

## Competitive Positioning

| | BeatIT | k6 | JMeter | Locust | Postman |
|---|---|---|---|---|---|
| Browser UI | ✅ | ❌ | ✅ (desktop) | ❌ | ✅ |
| Zero setup | ✅ | ❌ | ❌ | ❌ | ❌ |
| Live heatmap | ✅ | ❌ | ❌ | ❌ | ❌ |
| HDR percentiles | ✅ | ✅ | ❌ | ❌ | ❌ |
| Auto saturation detection | ✅ | ❌ | ❌ | ❌ | ❌ |
| AI diagnostics | ✅ | ❌ | ❌ | ❌ | ❌ |
| 100% free + self-hosted | ✅ | ✅ | ✅ | ✅ | ❌ |

---

## 12-Hour Build Plan

| Hours | Person A (Backend) | Person B (Frontend) |
|-------|-------------------|---------------------|
| 0–2 | Express + `ws` server + `undici` request engine | React + Vite scaffold + live metrics UI |
| 2–4 | `piscina` worker pool + `hdr-histogram-js` | `recharts` real-time charts wired to WebSocket |
| 4–6 | Saturation probe loop + `eventemitter3` bottleneck alerts | Latency heatmap (Canvas API) |
| 6–8 | `@google/generative-ai` diagnostic engine + SLA alerting | Alert UI + load strategy selector |
| 8–10 | `deep-diff` run diffing + `md-to-pdf` report export | Report view + diff display |
| 10–12 | `limiter` rate limiter + integration + edge cases | Polish, demo flow, presentation prep |

---

## One-Line Pitch

> *"BeatIT is a free, self-hosted API load testing tool built entirely on battle-tested npm modules — delivering adaptive saturation detection, HDR histogram latency analysis, and AI-powered diagnostics in 90 seconds, with zero configuration."*