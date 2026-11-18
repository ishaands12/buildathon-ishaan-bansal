# BIz hackathon evaluation

**Evaluation date:** 18 November 2026. The official event has three equally weighted criteria. The scores below are internal, evidence-based judgments out of 5, not organizer scores or a claim of market validation. Test cases are curated by the same builder and are not an independent benchmark.

| Official criterion | Rubric (0–5) | Evidence | Current assessment |
|---|---|---|---|
| Working product | 0 = unavailable; 3 = repeatable narrow path; 5 = independently tested end-to-end on target devices | Local chat, dashboard, editable sample figures, calculator and simulated approval; 26 automated tests pass. Voice microphone and live Meta delivery not verified end-to-end. | **3/5**: coherent local demo, not production nor live WhatsApp. |
| Problem insight | 0 = unclear user; 3 = concrete owner workflow and data fragmentation; 5 = validated by owner interviews and observed outcomes | Café scenario; public menu price snapshot; reconciles payments, stock and owner review. Fictional operational figures; no actual Meltado data or validated interviews. | **3/5**: clear hypothesis, no first-hand validation documented here. |
| Depth of execution | 0 = presentation only; 3 = inspectable orchestration plus deterministic evidence; 5 = robust evaluation, recovery, durable actions and independent verification | Model routes allowlisted labels; seven deterministic specialists, formula examples, voice, fallback and tests. No durable execution, persistent queue, broad agent evaluation or real deployment. | **3/5**: meaningful technical depth within narrow scope. |

## Concrete acceptance rubric

| Dimension | Pass condition | Observed evidence / status |
|---|---|---|
| Provenance | Every operational number is identified as simulated; public prices linked | Pass in dashboard and README; 12 items, not complete or guaranteed current. |
| Arithmetic | All category totals reconcile to item totals; stock reorder quantities and costs independently check | Pass in `app/meltado.test.js`; ₹33,470 revenue; ₹13,907 assumed ingredients; ₹19,563 contribution. |
| Decision explanation | Recommendation includes inputs, formula and caveat | Pass for stock and payment evidence cards; not every answer includes detailed evidence. |
| Owner control | No money, messages or orders actually sent by chat | Pass for UI simulated action; API adapters are capable of replying to allowlisted incoming users when configured. |
| Routing | Exact task set for curated questions; reject unsupported tasks | 20/20 on `docs/EVAL-CASES.json` after fixing missing “inventory”; small, hand-authored in-sample set, not accuracy in the wild. |
| Model resilience | Bad or unavailable classifier falls back to safe rules | Unit test passes; model can still misclassify valid or adversarial text, and fallback union can add false positives. |
| Voice | Speech input, Hindi/English, speech output on a real device | **Not verified** with real microphone; simulated browser events only. Provider, privacy and browser support vary. |
| Messaging | Real user asks on WhatsApp and receives BIz answer | **Not achieved**: Meta account restriction; Twilio trial received inbound but did not deliver custom reply. |
| Security & privacy | No secrets in git; signed webhooks and allowlists; sensitive data not exposed | Unit tests cover signature/allowlist. Not audited for production; browser storage unencrypted; dedupe in memory. |
| Experience | First-time owner completes the task without coaching | **Not tested** with a real owner or accessibility audit. |
| Reliability | Repeatable cold-start run on demo hardware | Unit suite passes; real model cold start, permissions, offline voice and browser device matrix not measured. |
| Business validation | Owners verify usefulness and willingness to pay | **Not tested**; no claim of pilots, paid customers or saved money. |

## Reproducible checks

- `npm test`: **26/26 passed** on 18 Nov 2026 in the local development environment. Tests include formulas, model-plan validation, fallback, local state, webhook signatures, allowlists and deduplication.
- `node docs/evaluate.mjs`: **20/20 exact label matches** on the hand-written set after a missing “inventory” synonym was fixed. This measures the rules fallback only, not the local model. One thousand in-process fallback orchestrations took about 26 ms in one run; this excludes browser, network, local model and voice latency and is not a benchmark.
- One local-model call previously routed “cash and stock” to both specialists. This is a smoke test, not a measured classifier score.
- Simulated DOM tests checked chat-to-dashboard state and staged approval. Native browser visuals, microphone permissions and real end-to-end WhatsApp remain unverified.

## Demo failure playbook

1. **Ollama slow/offline:** classifier times out and rules fallback handles supported keywords. Show the routing source in dashboard activity; do not say the LLM ran if it did not.
2. **Mic unavailable:** type the same question. Do not claim voice is offline or private by default.
3. **WhatsApp unavailable:** use browser chat and explicitly say integration is prepared, not connected. Do not claim a real message was sent.
4. **Changed data looks wrong:** reset the demo; state is per browser. Browser edits are not sent to the messaging adapter.
5. **Question outside coverage:** say the agent cannot answer reliably. Avoid profit, staff blame, or real operational claims without source data.

## Next evaluation priorities

Before real use, obtain permissioned transaction and inventory data; validate with café owners; build a held-out Hindi/Hinglish query set including ambiguous and adversarial prompts; measure classifier precision/recall by specialist, numerical correctness and end-to-end latency; test real voice across devices and privacy settings; add durable delivery and consent; perform independent security and accessibility reviews. Do not infer real-world performance from this demo set.

## Update: sales CSV analysis and deployment preparation

A browser-local CSV path now sums the required amount column using integer paise, supports optional item and date columns, includes negative values, rejects malformed or ambiguous input and states its assumptions. Four unit tests cover quoted fields, refunds, invalid inputs and exact totals; the full suite passes 30 tests. This is a narrow, deterministic file analysis, not general document understanding: no PDF/OCR/Excel, accounting reconciliation, tax, profit or automated classification. The dashboard and other specialist answers continue to use simulated Meltado data and do not ingest this file. Browser upload and independent owner testing remain unverified.

`npm run build` creates a static-only `dist/` directory; the hosted app will use rules rather than local Ollama. There is no verified public deployment or end-to-end WhatsApp service yet. The earlier rubric scores remain provisional; no owner research or independent evaluation has been added.
