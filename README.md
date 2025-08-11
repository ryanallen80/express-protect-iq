# Express Protect IQ (Demo)

A lightweight React (Vite) demo chatbot to qualify users for auto warranty coverage and capture lead intent.

## Local Dev

```bash
npm install
npm run dev
```
Open the printed local URL in your browser.

## Deploy to Vercel

1. Create a new Git repo and push:
```bash
git init
git add .
git commit -m "init"
git branch -M main
git remote add origin <your_github_repo_url>
git push -u origin main
```

2. Go to https://vercel.com → **New Project** → Import your repo → **Deploy** (defaults are fine).

That’s it. You’ll get a live URL in ~1 minute.

---

## Lead Capture (Serverless)

This project includes a Vercel serverless function at `/api/lead` that accepts `POST` JSON and forwards it to:

- An optional webhook (`LEAD_WEBHOOK_URL`) — perfect for Zapier/Make/Slack/Google Sheets.
- Optional email via Resend if you set `RESEND_API_KEY` and `LEAD_NOTIFY_EMAIL`.

### Configure on Vercel

In your Vercel Project → **Settings → Environment Variables**, add any of the following:

- `LEAD_WEBHOOK_URL` = `https://hooks.zapier.com/...` (or any HTTPS endpoint that accepts JSON)
- `RESEND_API_KEY` = your Resend API key (optional)
- `LEAD_NOTIFY_EMAIL` = your email address to receive lead notifications (optional)

Deploy, and the chatbot will `POST` leads automatically when the user shares their contact method.
