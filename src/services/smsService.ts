// SMS SERVICE - Requires Twilio + Firebase Cloud Functions
// Set up: https://firebase.google.com/docs/functions
// Env vars needed: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER

export interface SMSPayload {
  to: string;
  message: string;
}

// These are stubs - actual sending requires Cloud Functions
export async function sendConfirmationSMS(
  phone: string,
  name: string,
  service: string,
  date: string,
  time: string
): Promise<void> {
  console.log(
    `[SMS stub] Would send to ${phone}: Hi ${name}! Your ${service} is confirmed for ${date} at ${time}. Reply C to confirm or R to reschedule. Questions? Call (201) 882-1050`
  );
  // TODO: Call Firebase Cloud Function endpoint
  // Example:
  // await fetch('/api/sms/send', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ to: phone, message: `...` }),
  // });
}

export async function sendReminderSMS(
  phone: string,
  name: string,
  date: string,
  time: string
): Promise<void> {
  console.log(
    `[SMS stub] Reminder to ${phone}: Hi ${name}! Just a reminder about your appointment on ${date} at ${time} at Reflect Medical.`
  );
  // TODO: Call Firebase Cloud Function endpoint
}
