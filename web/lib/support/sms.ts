// SMS to Selfi when a chat is escalated, through Twilio's REST API (the same account the platform uses
// for guest SMS, see selfiebox-platform fleet/selfiebox_fleet/sms.py). Set in Vercel:
//   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM (sender, e.g. "Selfi" or a number)
//   SUPPORT_SMS_TO   the number that gets escalations, E.164 (+45…)
// Without them nothing is sent, and the chat is still marked as waiting for a human.

export const smsEnabled = () => !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.SUPPORT_SMS_TO);

export type SmsSender = (body: string) => Promise<boolean>;

export const sendSupportSms: SmsSender = async (body) => {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const to = process.env.SUPPORT_SMS_TO;
  if (!sid || !token || !to) {
    console.warn("support sms: Twilio er ikke sat op, SMS sendes ikke");
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
      console.error("support sms: Twilio afviste", res.status, (await res.text()).slice(0, 200));
      return false;
    }
    return true;
  } catch (e) {
    console.error("support sms", e);
    return false;
  }
};
