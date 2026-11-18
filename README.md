# BIz

**Your business. Unblurred.**

BIz is a conversational business companion for Indian shop and café owners. Ask a question in English, Hindi or Hinglish and explore sales, cash, inventory, receivables and café operations in a simple chat. BIz combines specialist calculations with an AI-written explanation, so an owner can see both the answer and the figures behind it.

[**Open BIz**](https://biz-meltado-assistant.vercel.app/) · [**Watch the demo video**](https://biz-meltado-assistant.vercel.app/biz-demo.mp4) · [Agent reference](docs/AGENT-REFERENCE.md)

> The Meltado café is an independent **simulation**. Sales, staff, expenses and operations are fictional. Selected public menu prices are a snapshot, not a complete or current menu. BIz is not connected to Meltado or endorsed by it.

## Try it

1. Open the [chat](https://biz-meltado-assistant.vercel.app/). AI responses are available automatically.
2. Try “Cash aur UPI mein kya difference hai?”, “Milk stock kab khatam hoga?” or ask a follow-up. BIz shows the model's response and the calculations it used. Message tone is an estimate of the current message, not a diagnosis.
3. Choose **Upload document** to analyse a CSV, text file or text-based PDF, or **Dashboard** for the fictional café's trends, decisions and agent activity.
4. Review a suggested message and simulate sending it. **No real messages, orders or payments are sent.**

## How it works

A rule-based chat orchestrator routes supported questions to deterministic sales, cash, stock, receivables, staff, menu and finance specialists. Those specialists calculate figures and supply evidence; the model does not independently call them as tools. An Inception Mercury model receives the question, recent chat and relevant calculated evidence and writes a contextual response with a coarse sentiment estimate. It does not perform actions. If the model cannot respond, the interface identifies the fallback and shows the local calculation instead. Model explanations can still be wrong; check the figures and assumptions.

The dashboard and ordinary chat use the illustrative Meltado dataset. CSV analysis is a separate path and does not update the dashboard. Voice input and output depend on the browser; audio may be processed by the browser's provider. WhatsApp adapters are experimental and not connected to this deployment.

## Analyse a document

Choose **Upload document** and select a CSV, TXT, Markdown or text-based PDF under 2 MB. BIz extracts up to the first 20 PDF pages and first 12,000 characters, sends that text to Inception for analysis, and keeps the document active for follow-up questions. Remove it using the upload dialog to return to the Meltado simulation. The dashboard is not updated by uploads.

A CSV with an `amount` column also gets an exact rupee calculation; other CSV formats are still analysed by AI. Confirm any generated figures and conclusions against the source. Scanned PDFs, OCR and Excel are not supported. PDF text extraction uses PDF.js loaded from a public CDN. Do not upload sensitive information you are not comfortable sending to Inception.

## Run locally

Requires Node.js 18 or newer:

```sh
npm install
npm run dev
```

Open [localhost:4173](http://localhost:4173/) for chat or [the dashboard](http://localhost:4173/dashboard.html). The local server forwards chat requests to the hosted BIz endpoint; if it is unavailable, the app uses the local rule-based demo. Demo changes and activity stay in the current browser.

```sh
npm test       # calculation, routing, API and adapter checks
npm run build  # create static assets in dist/
```

The Vercel deployment also needs the `api/` functions and sensitive `INCEPTION_API_KEY` environment variable. Never commit secrets. The public demo has no user authentication or durable rate limiting; restrict access before using it beyond the demonstration.

## Data, privacy and limitations

- The café's inventory, sales volumes, costs, staff, customers and actions are invented. Menu prices come from a limited [public menu snapshot](https://www.zomato.com/ncr/meltado-1-karkardooma-new-delhi/order), accessed 18 November 2026.
- Questions, recent chat and relevant evidence are sent to Inception. Avoid entering sensitive information you don't want sent to the model provider.
- Sentiment estimates are fallible, especially for short, mixed-language messages. They should not be used to judge staff, customers or mental health.
- The prototype has no production-grade user authentication, persistent multi-user database, live accounting integration, WhatsApp delivery, or real-world action execution. Do not rely on it for financial decisions without checking the source records.

## Project map

- `app/` — chat, dashboard, business calculations and document analysis.
- `api/` — Inception chat and intent endpoints for Vercel.
- `docs/` — agent reference and example CSV.
- `whatsapp/` and `twilio/` — experimental messaging adapters.
