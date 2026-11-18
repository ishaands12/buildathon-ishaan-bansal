# 🚀 Buildathon: Make Wednesdays Great Again

**Masters' Union · For AI Developers · Winner gets Rs. 25,000**

> **Every team must build in a fork of this repository.** Projects not built in a fork of this repo won't be judged.

| | |
|---|---|
| **Date** | Wednesday, 18 November 2026 |
| **Hacking** | **3:00 PM – 7:00 PM IST** (code freeze at 7:00 PM sharp) |
| **Venue** | CDS Audi, 8th floor |
| **Prize** | Rs. 25,000 to the winning team |
| **Register your fork** | 👉 **[https://forms.gle/ZJUYKwTYjsMsVB2b9](https://forms.gle/ZJUYKwTYjsMsVB2b9)** (**deadline 3:30 PM IST**) |
| **Final submission** | Your fork as it stands at **7:00 PM IST**. There's nothing else to submit. |

> 🤖 **Using an AI coding agent?** Point it at [`AGENTS.md`](AGENTS.md). It has the full event brief, tracks, judging and rules in a form agents can read directly. Claude Code loads it automatically through `CLAUDE.md`, and Codex reads `AGENTS.md` natively.

---

## 🎯 Pick one build track

| # | Track | Brief |
|---|---|---|
| **01** | **Build for the Physical World** | Make a real-world task easier, faster or more reliable. Show it in a realistic scenario. |
| **02** | **Build for AI Agents** | Find something an agent struggles with. Build the tool that fixes it, then demo the agent using it. |
| **03** | **Build in Your Area of Expertise** | Pick a field you know firsthand. Ship a working product that improves how people handle it today. |

## ⚖️ How you'll be judged (each criterion is ⅓ of your score)

| Criterion | The question judges ask |
|---|---|
| **Working product** | Does it do what you say it does? Show the core workflow in your demo. |
| **Problem insight** | Who faces this problem, and why does it happen? |
| **Depth of execution** | How well did you solve the hardest part of the build? |

---

## Why fork this repo?

Everyone starts from the same commit (the **genesis commit**) at the same time. Organizers can then check that:
- all code was written **during** the Buildathon and not brought in from an earlier project,
- teams commit steadily instead of pasting in one huge AI-generated dump at the end,
- every repo stays public and visible while you build.

The organizers track every fork automatically: commits, timing and activity. Read [RULES.md](RULES.md) before you write any code.

---

## ✅ Setup (about 5 minutes, do it at 3:00 PM)

**In short:** fork → register your fork in the form **by 3:30 PM** → build → push before 7:00 PM.

### 1. Fork this repo
Click **Fork** (top right). On the fork screen:
- **Owner:** one team member's personal account. Only **one fork per team**.
- **Repository name:** `buildathon-<team-name>`, for example `buildathon-byte-bandits`
- Click **Create fork**.

> ⚠️ Don't download a ZIP or copy the files into a new repo. **It has to be a real GitHub fork**, or the tracker can't see you.

### 2. Keep it public
Forks of a public repo are public. **Don't make it private, archive it, or delete it** until judging is over.

### 3. Add your teammates
In your fork: **Settings → Collaborators → Add people**. Add each teammate's GitHub account so their commits count toward the team.

### 4. Enable Actions
Open the **Actions** tab of your fork and click **"I understand my workflows, go ahead and enable them"**. This runs the automatic check on every push.

### 5. Make your registration commit (your first commit)
Fill in [`team.json`](team.json). `track` must be one of `physical-world`, `ai-agents` or `area-of-expertise`. Then:

```bash
git clone https://github.com/<your-username>/buildathon-<team-name>.git
cd buildathon-<team-name>
# edit team.json
git add team.json
git commit -m "register: <team name>"
git push
```

The **Hackathon check** in the Actions tab should go green ✅. If it's red, open the run to see what's wrong in `team.json`.

### 6. Register your fork (deadline: 3:30 PM IST)
👉 **[https://forms.gle/ZJUYKwTYjsMsVB2b9](https://forms.gle/ZJUYKwTYjsMsVB2b9)**

It's a 4-question Google Form: team name, fork link, track, team members. It connects your repo to the organizers' live tracker.

- Fill it in **once per team**, right after forking, and **no later than 3:30 PM IST**. **Teams that don't register can't be tracked.**
- Paste your **fork's** URL (`https://github.com/<you>/buildathon-<team-name>`), not this starter repo's.
- Need to change something? Use the **"Edit your response"** link on the confirmation page. Don't fill it in twice.
- **Final submission is automatic.** Whatever is pushed to your fork at 7:00 PM IST is what gets judged.

---

## 🛠 While you build (3:00 – 7:00 PM)

- Put your code anywhere in the repo (`app/`, `src/`, `frontend/`, `backend/`…). There's no required layout.
- **Commit early, commit often**, at least every 30 minutes of real work, with messages that say what changed.
- **Push regularly.** Commits you never push don't exist to the tracker.
- AI coding tools (Claude Code, Codex, Cursor, Copilot…) are **allowed and encouraged**. Keep `AGENTS.md` and `CLAUDE.md` in the repo; they keep your agent within the rules.
- Before 7:00 PM, replace the "Your project" section below with your project's README.

## 🧊 Code freeze: 7:00 PM IST

At 7:00 PM the tracker takes a snapshot of every fork. **Commits pushed after code freeze are ignored.** Judges look at your last commit before 7:00 PM.

## ❌ Things that get you flagged

- Rewriting history (`git push --force`, rebasing away the genesis commit, squashing everything into one commit)
- Commits dated before 3:00 PM
- One or two giant commits containing most of the project
- A repo that isn't a fork of this one, or that's private or deleted

See [RULES.md](RULES.md) for the full list.

---

## Your project

### BIz — your dhandha companion

**Team:** Ishaan Bansal  
**Track:** Physical World

**Problem:** Indian shop owners make time-sensitive decisions while sales, cash, UPI, stock and customer credit sit in different places. A busy owner needs a short, trustworthy answer and a next step in a familiar conversation, not another dashboard or a score that blames a staff member.

**What we built:** A WhatsApp-style business companion for a fictional general store. Ask about sales, stock, cash, UPI, udhaar or team activity; edit sample figures and see calculations update. Tap **Zaroori baatein** to inspect the evidence, assumptions and a proposed next action. Review or edit a message and simulate sending it. No real WhatsApp, email, supplier order, or payment connection is active.

**Hardest part:** Turn imperfect operational signals into useful, auditable decisions. The engine calculates cash/UPI differences, days of stock cover and pack-rounded reorder quantities, and overdue balances. It states assumptions, does not infer theft from a mismatch, and requires owner approval. Sales are not profit; staff sales are not an employee performance ranking.

### Run locally

Requires Node.js 18 or newer. No installation or API key is needed.

```bash
npm run dev
```

Open http://localhost:4173. Run `npm test` for the decision-engine checks. The app also consists of static files and can be hosted on a static site provider.

### Two-minute demo

1. Tap **Zaroori baatein**. Open the cash/UPI discrepancy and read the arithmetic and caveat.
2. Open the stock warning: 8 packs ÷ 5 per day = 1.6 days. The suggested reorder covers seven days, rounded to the supplier's 20-pack minimum.
3. Review the supplier message, edit it if desired, and tap **Simulate send**. The transcript explicitly confirms that no message was sent.
4. Tap **Hisaab dekhein**, change sales or stock numbers, save, and ask the question again to see a new calculation.

### Scope and limitations

This is a local, session-only prototype with fictional data. The local server optionally uses a free Ollama model to classify requests and dispatch multiple domain specialists. The specialists are deterministic calculation modules, not independently autonomous language-model agents; supported domains are limited and arbitrary questions may not be answered. When Ollama is unavailable or the site is hosted as static files, a rules-based planner handles supported questions. It does not import accounting files, maintain a real ledger, connect to WhatsApp or email, place orders, or persist changes. Stock cover assumes recent daily sales continue and ignores pending orders; credit reminders require checking for recent payments. Test the workflow with merchants before relying on it for decisions.

The opportunity is grounded in India's large MSME sector, but this prototype's shop, numbers and interactions are illustrative. The [Ministry of MSME annual report](https://www.msme.gov.in/sites/default/files/MSME-ANNUAL-REPORT-2024-25-ENGLISH.pdf) provides broader sector context. The [RBI's research on digital payments](https://rbi.org.in/scripts/PublicationsView.aspx?id=22459) discusses how payment histories can reveal business cash-flow patterns. Neither source validates this prototype or its assumptions.

### Voice and multi-agent orchestration

Press the microphone and allow microphone access. Select Hindi or English for recognition; the browser reads the calculated answer aloud when voice is on. A supported browser and microphone are required. Some browsers use an online speech service and send audio to their provider; speech recognition may not work offline. Voice output uses the browser/system voice and availability varies. Typed chat remains available.

For the local model, start Ollama separately and ensure `qwen2.5-coder:7b` is installed, then start the app with `npm run dev`. Set `BIZ_OLLAMA_MODEL` to use another locally installed model. The browser sends the question to the local server, which asks Ollama for a list of domains only; the server validates this against an allowlist. It does not send shop figures to the model. The orchestrator runs the relevant sales, cash/UPI, stock, udhaar, or staff specialists and combines their deterministic results. The model has no tools to send messages, change data, or invent financial figures. If classification fails, the app falls back to local rules.

**Concrete execution:** Proposed messages remain editable simulated drafts and require the owner to confirm. There are no actual payments, orders, messages or staffing actions. A static host can serve the interface and rule-based mode, but does not provide the Node server or local Ollama classifier.
