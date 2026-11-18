# BIz

**Your business. Unblurred.**

BIz is a conversational business companion for Indian shop and café owners. Ask a question in English, Hindi or Hinglish and explore sales, cash, inventory, receivables and café operations in a simple chat. BIz combines specialist calculations with an AI-written explanation, so an owner can see both the answer and the figures behind it.

[**Open BIz**](https://biz-meltado-assistant.vercel.app/) · [**Watch the demo video**](https://biz-meltado-assistant.vercel.app/biz-demo.mp4) · [Agent reference](docs/AGENT-REFERENCE.md)

> The Meltado café is an independent **simulation**. Sales, staff, expenses and operations are fictional. Selected public menu prices are a snapshot, not a complete or current menu. BIz is not connected to Meltado or endorsed by it.

## Try it

1. Open the [chat](https://biz-meltado-assistant.vercel.app/) and select **Enable AI**. Enter the private demo access code from the project owner.
2. Try “Cash aur UPI mein kya difference hai?”, “Milk stock kab khatam hoga?” or ask a follow-up. BIz shows the model's response and the calculations it used. Message tone is an estimate of the current message, not a diagnosis.
3. Choose **Upload sales** to analyse your own CSV, or **Dashboard** for the fictional café's trends, decisions and agent activity.
4. Review a suggested message and simulate sending it. **No real messages, orders or payments are sent.**

## How it works

The chat orchestrator routes supported questions to deterministic sales, cash, stock, receivables, staff, menu and finance specialists. Those specialists calculate figures and supply evidence. When enabled, an Inception Mercury model receives the question, recent chat and relevant calculated evidence and writes a contextual response with a coarse sentiment estimate. It does not perform actions. If the model cannot respond, the interface identifies the fallback and shows the local calculation instead. Model explanations can still be wrong; check the figures and assumptions.

The dashboard and ordinary chat use the illustrative Meltado dataset. CSV analysis is a separate path and does not update the dashboard. Voice input and output depend on the browser; audio may be processed by the browser's provider. WhatsApp adapters are experimental and not connected to this deployment.

## Upload a sales file

Choose **Upload sales** and select a UTF-8 CSV containing an `amount` column in rupees. Optional `item` and `date` columns add item totals and distinct date values. Negative values are included, for example as refunds. [Download the sample](docs/sample-sales.csv).

The file itself is read in browser memory. When AI is enabled and you ask about the uploaded file, its calculated summary and your question are sent to Inception to generate a response. Check that the rows cover the intended period and don't contain duplicates; sales totals are not profit. PDF, Excel, scanned receipts and general document analysis are not supported.

## Run locally

Requires Node.js 18 or newer:

```sh
npm install
npm run dev
```

Open [localhost:4173](http://localhost:4173/) for chat or [the dashboard](http://localhost:4173/dashboard.html). With an AI access code, the local server forwards chat requests to the hosted BIz endpoint; otherwise the app uses the local rule-based demo. Demo changes and activity stay in the current browser.

```sh
npm test       # calculation, routing, API and adapter checks
npm run build  # create static assets in dist/
```

The Vercel deployment also needs the `api/` functions and sensitive `INCEPTION_API_KEY` and `BIZ_ACCESS_CODE` environment variables. Never commit secrets. The shared access code is a demo gate, not production authentication or rate limiting.

## Data, privacy and limitations

- The café's inventory, sales volumes, costs, staff, customers and actions are invented. Menu prices come from a limited [public menu snapshot](https://www.zomato.com/ncr/meltado-1-karkardooma-new-delhi/order), accessed 18 November 2026.
- When AI is enabled, questions, recent chat and relevant evidence are sent to Inception. Avoid entering sensitive information you don't want sent to the model provider.
- Sentiment estimates are fallible, especially for short, mixed-language messages. They should not be used to judge staff, customers or mental health.
- The prototype has no production-grade user authentication, persistent multi-user database, live accounting integration, WhatsApp delivery, or real-world action execution. Do not rely on it for financial decisions without checking the source records.

## Project map

- `app/` — chat, dashboard, business calculations and CSV analysis.
- `api/` — protected Inception chat and intent endpoints for Vercel.
- `docs/` — agent reference and example CSV.
- `whatsapp/` and `twilio/` — experimental messaging adapters.
