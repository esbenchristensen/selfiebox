// SMS through Twilio's REST API (the same account the platform uses for guest SMS, see selfiebox-platform
// fleet/selfiebox_fleet/sms.py): to Selfi when a chat is escalated or a lead comes in, and the verification
// code to a customer in the chat. Set in Vercel:
//   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM (sender, e.g. "Selfi" or a number)
//   SUPPORT_SMS_TO   the number that gets escalations, E.164 (+45…)
//   LEADS_SMS_TO     the number that gets new leads (default SUPPORT_SMS_TO)
// Without them nothing is sent, and the chat is still marked as waiting for a human.

export const smsEnabled = () => !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.SUPPORT_SMS_TO);

export type SmsSender = (body: string) => Promise<boolean>;

/** One SMS to any number through Twilio. False when Twilio is not set up or the send failed. */
export async function sendSms(to: string, body: string): Promise<boolean> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token || !to) {
    console.warn("sms: Twilio eller modtager mangler, SMS sendes ikke");
    return false;
  }
  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: { Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ To: to, From: process.env.TWILIO_FROM || "Selfi", Body: body.slice(0, 320) }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("sms: Twilio afviste", res.status, (await res.text()).slice(0, 200));
      return false;
    }
    return true;
  } catch (e) {
    console.error("sms", e);
    return false;
  }
}

/** Escalations go to SUPPORT_SMS_TO. */
export const sendSupportSms: SmsSender = (body) => sendSms(process.env.SUPPORT_SMS_TO || "", body);

/** The verification code to the customer's own number (the one they gave when the chat started). */
export type CodeSender = (to: string, body: string) => Promise<boolean>;
export const sendCodeSms: CodeSender = sendSms;
