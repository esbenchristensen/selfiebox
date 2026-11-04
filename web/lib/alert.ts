// Alarm til Selfi, når noget går galt, som en kunde ellers ville opdage først: en mail, der ikke kom ud, en
// Stripe-betaling, der ikke kunne gemmes, en morgenkørsel, der fejlede. Sendes til ALERT_WEBHOOK (samme som
// fleet: ntfy.sh-emne eller Slack-webhook, der tager {"text": …}). Uden ALERT_WEBHOOK logges det kun.
//
// Samme fil i selfiebox (web/lib/) og selfiebox-platform (web/src/lib/). Hold de to kopier ens.

export async function alert(text: string): Promise<void> {
  console.error("ALARM", text);
  const hook = process.env.ALERT_WEBHOOK;
  if (!hook) return;
  try {
    const ntfy = /^https:\/\/ntfy\.sh\//.test(hook);
    await fetch(hook, {
      method: "POST",
      headers: ntfy ? { Title: "Selfi", Priority: "high" } : { "Content-Type": "application/json" },
      body: ntfy ? text : JSON.stringify({ text }),
      signal: AbortSignal.timeout(4000),
    });
  } catch (e) {
    console.error("alert", e);
  }
}
