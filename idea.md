# BeatIT — API Load Testing & Performance Profiling Tool

> **"Know your API's breaking point before your users find it."**

---

## 1. Problem Statement

**Problem Title:** Developers have no lightweight, zero-setup tool to test how their API performs under concurrent load.

**Problem Description:**
Every developer tests their API with one request at a time. Nobody tests what happens when 500 users hit it simultaneously — until launch day, when it's too late. Load testing is either skipped entirely or done with heavy enterprise tools that take hours to configure.

**Target Users:** Backend developers, full-stack developers, and DevOps engineers who need to validate API performance before shipping.

**Existing Gaps:**

| Tool | Limitation |
|------|-----------|
| **JMeter** | Java-dependent, XML-based test plans, heavy resource usage, steep learning curve |
| **k6** | CLI-only, requires scripting knowledge, no visual feedback during tests |
| **Locust** | Requires Python scripting, no built-in visual dashboard |
| **Postman Load Testing** | Cloud-dependent, rate-limited, requires paid plan for meaningful scale |

None of them let you paste a URL and get results in under a minute without setup.

---

## 2. Problem Understanding & Approach

**Root Cause Analysis:**
Load testing has a high barrier to entry. Existing tools require environment setup (Java, Python, scripting), have no real-time visual feedback, and are built for DevOps specialists — not the average developer shipping a feature.

**Solution Strategy:**
Build a browser-based tool where every technical feature is delegated to a well-known npm module. Zero hand-rolled algorithms. Every judge question about internals is answered with a module name. The tool works out of the box with a single URL input.

---

## 3. Proposed Solution

**Solution Overview:**
A web-based API load testing and performance profiling tool that lets developers simulate concurrent traffic, visualize real-time metrics, and generate structured reports — with zero configuration overhead.

**Core Idea:** One URL. One click. Full performance picture.
- 100% free, self-hosted, no accounts, no cloud dependency
- Every feature powered by a battle-tested npm module
- Results in under 90 seconds

**Key Features:**
1. Real-Time Metrics Dashboard (p50/p95/p99, throughput, error rate)
2. Latency Heatmap (time vs latency buckets, Canvas API)
3. Three Load Strategies — Instant Spike, Gradual Ramp, Step Function
4. Bottleneck Detection Engine (automatic signal-based analysis)
5. HDR Histogram for O(1) percentile calculation
6. Worker Thread Pool with back-pressure control
7. Token Bucket Rate Limiter
8. Adaptive Saturation Detection (auto-finds breaking point)
9. AI-Powered Diagnostic Engine (Gemini 2.5 Flash)
10. PDF Report Generation (one-click download)
11. Comparative Run Diffing (before/after optimization)
12. SLA Threshold Enforcement with Live Alerts

---

## 4. System Architecture

**High-Level Flow:**

```
Developer (Browser) → React Frontend → Express Backend → Worker Threads → Target API
                             ↑                  ↓
                        WebSocket (ws)    Metric Aggregator
                                               ↓
                                        Gemini AI + PDF Report
```

**Architecture Description:**
The frontend (React + Vite) connects to the Express server via WebSocket. When a test starts, the orchestrator initializes a piscina worker thread pool. Each worker gets its own undici connection pool and fires HTTP requests to the target API. Latency values are recorded in an HDR histogram (O(1)). Every 500ms, aggregated metrics are broadcast over WebSocket to the live dashboard. After the test, metrics are sent to Gemini 2.5 Flash for AI diagnosis and converted to a PDF report via md-to-pdf.

**Architecture Diagram:**

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

---

## 5. Database Design

BeatIT is a **stateless tool** — there is no persistent database. All test data lives in memory during the test session. Test results are exported as PDF reports for persistence. No ER diagram required.

---

## 6. Model Selected

**Model Name:** Gemini 2.5 Flash (`gemini-2.5-flash` via `@google/generative-ai`)

**Selection Reasoning:** Genuinely free on Google AI Studio (1,000 requests/day, no credit card, no expiry). Fast inference suitable for post-test analysis. Official SDK available as a single npm package.

**Evaluation Metrics:** Quality of root-cause hypothesis, specificity of fix recommendations, response latency after test completion.

```js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
const result = await model.generateContent(`
  API performance metrics: ${JSON.stringify(metrics)}
  Diagnose the root cause and provide specific fix recommendations.
`);
```

---

## 7. Technology Stack

**Frontend:** React, Vite, Recharts, Canvas API

**Backend:** Node.js, Express, ws (WebSocket), piscina, undici, hdr-histogram-js, eventemitter3, limiter, deep-diff, md-to-pdf, commander

**ML/AI:** Gemini 2.5 Flash via `@google/generative-ai` (Google AI Studio free tier)

**Database:** None (stateless, in-memory)

**Deployment:** `npm install && npm start` — no Docker, no cloud account, no config files

**Full Install:**
```bash
npm install undici ws piscina hdr-histogram-js limiter eventemitter3 \
            deep-diff md-to-pdf @google/generative-ai commander

# Frontend
npm install react recharts vite
```

---

## 8. API Documentation & Testing

**API Endpoints:**

- **Endpoint 1:** `POST /start-test` — Accepts `{ url, concurrency, strategy, duration }`, initializes piscina pool, starts load generation, opens WebSocket stream
- **Endpoint 2:** `GET /results/:testId` — Returns final aggregated metrics object `{ p50, p95, p99, throughput, errorRate, saturationPoint }`
- **Endpoint 3:** `POST /report` — Accepts metrics JSON, generates PDF via md-to-pdf, returns file download

**WebSocket Events:**
- `metrics` — Streamed every 500ms: `{ p50, p95, p99, throughput, errorRate, activeUsers }`
- `breach` — Fired by eventemitter3 when SLA threshold is crossed: `{ metric, value, threshold, severity }`
- `saturation` — Fired when additive-increase probe detects breaking point: `{ concurrency }`

---

## 9. Module-wise Development & Deliverables

**Checkpoint 1: Research & Planning**
- Deliverables: idea.md, sequence diagram,  module map finalized

**Checkpoint 2: Backend Development**
- Deliverables: Express server + WebSocket server (`ws`), undici HTTP load engine, piscina worker pool, HDR histogram integration

**Checkpoint 3: Frontend Development**
- Deliverables: React + Vite scaffold, recharts real-time dashboard wired to WebSocket, latency heatmap (Canvas API)

**Checkpoint 4: Model Integration**
- Deliverables: Gemini 2.5 Flash integration, structured JSON → AI diagnosis, saturation probe loop (additive-increase), eventemitter3 SLA alerting

**Checkpoint 5: Reports & Diffing**
- Deliverables: md-to-pdf report generation, deep-diff comparative run view, limiter rate-limiting integration

**Checkpoint 6: Deployment**
- Deliverables: End-to-end integration tested, demo flow rehearsed, single `npm install && npm start` verified

---

## 10. End-to-End Workflow

1. Developer opens BeatIT in browser, enters target API URL and test config (concurrency, strategy, duration)
2. Browser connects to WebSocket server; Developer clicks "Run Test"
3. Express server initializes piscina worker pool (8 threads); each worker creates an undici Pool
4. Workers fire concurrent HTTP requests; every response latency is recorded into HDR histogram (`O(1)`)
5. Every 500ms, aggregated metrics (p50/p95/p99, throughput, error rate) are broadcast over WebSocket to the live dashboard
6. eventemitter3 checks SLA thresholds on every tick; breach events fire live alerts to the UI
7. Saturation probe runs additive-increase loop; detects and reports the breaking point automatically
8. On test completion, metrics JSON is sent to Gemini 2.5 Flash for AI root-cause diagnosis
9. md-to-pdf builds a full PDF report (metrics + AI output + SLA log); Developer downloads with one click
10. Developer optionally loads a previous run; deep-diff shows metric deltas (improvements green, regressions red)

---

## 11. Demo & Video

- **Live Demo Link:** *(to be added)*
- **Demo Video Link:** *(to be added)*
- **GitHub Repository:** https://github.com/praggCode/BeatIT

---

## 12. Hackathon Deliverables Summary

- Fully functional browser-based load testing tool (zero setup, one URL input)
- Real-time WebSocket dashboard with recharts + latency heatmap
- Adaptive saturation detection via additive-increase probe
- AI-powered PDF diagnostic report (Gemini 2.5 Flash + md-to-pdf)

---

## 13. Team Roles & Responsibilities

| Member Name | Role | Responsibilities |
|-------------|------|-----------------|
| Person A, Person B | Backend Engineer | Express server, piscina worker pool, undici load engine, HDR histogram, saturation probe, Gemini AI integration, md-to-pdf report |
| Person C | Frontend Engineer | React + Vite scaffold, recharts real-time charts, Canvas latency heatmap, SLA alert UI, load strategy selector, diff display |

---

## 14. Future Scope & Scalability

**Short-Term:**
- Support for authenticated endpoints (Bearer token, API key headers)
- Exportable test config files for repeatable runs
- Support for POST/PUT/PATCH with custom request bodies

**Long-Term:**
- Horizontal scaling beyond 500 virtual users across multiple BeatIT instances
- Scheduled/recurring load tests with historical trend tracking
- Customer can change their models

---

## 15. Known Limitations

- Maximum 500 virtual users per single-machine instance (piscina ceiling on consumer hardware)
- No persistent test history — results must be saved as PDF before closing the session
- AI diagnosis requires a Gemini API key (free, but manual setup required at aistudio.google.com)
- Latency heatmap is browser-rendered — very long tests (>30 min) may cause canvas memory pressure

---

## 16. Impact

- Eliminates the "I'll test load later" excuse — any developer can run a professional load test in under 90 seconds
- Free and self-hosted — no vendor lock-in, no paid plan required, works on a laptop
- Brings Grafana/Datadog-grade visibility (HDR percentiles, latency heatmaps) to developers who can't afford enterprise APM tools
- Every answer to "how does X work?" is an npm module name — fully transparent, auditable, and open source