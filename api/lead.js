export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' })
    return
  }

  try {
    const lead = req.body || {}
    if (!lead || !lead.contact) {
      res.status(400).json({ ok: false, error: 'Missing contact in payload' })
      return
    }

    // Optional: forward to webhook (Zapier/Make/Slack/etc.)
    const webhook = process.env.LEAD_WEBHOOK_URL
    if (webhook) {
      try {
        await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lead)
        })
      } catch (e) {}
    }

    // Optional: email via Resend
    const resendKey = process.env.RESEND_API_KEY
    const notifyEmail = process.env.LEAD_NOTIFY_EMAIL
    if (resendKey && notifyEmail) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendKey}`
          },
          body: JSON.stringify({
            from: 'Express Protect IQ <noreply@expressprotect.demo>',
            to: [notifyEmail],
            subject: 'New Express Protect IQ Lead',
            text: `New lead captured:\n\n${JSON.stringify(lead, null, 2)}`
          })
        })
      } catch (e) {}
    }

    res.status(200).json({ ok: true })
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Server error' })
  }
}
