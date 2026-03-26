// EmailJS configuration — set these in your .env file
// VITE_EMAILJS_PUBLIC_KEY  → your EmailJS public/user key
// VITE_EMAILJS_SERVICE_ID  → your EmailJS service ID (e.g. "service_xxxxxx")
// VITE_EMAILJS_TEMPLATE_ID → your EmailJS template ID (e.g. "template_xxxxxx")
//
// Template should include variables: patientName, service, date, time, phone, email, notes

const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_EMAILJS_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_EMAILJS_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_EMAILJS_TEMPLATE_ID";
const OFFICE_EMAIL = "leah@reflectcosmetic.com";

interface AppointmentEmailParams {
  patientName: string;
  service: string;
  date: string;
  time: string;
  phone: string;
  email: string;
  notes?: string;
}

export async function sendAppointmentNotification(params: AppointmentEmailParams): Promise<void> {
  try {
    const payload = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email: OFFICE_EMAIL,
        patientName: params.patientName,
        service: params.service,
        date: params.date,
        time: params.time,
        phone: params.phone,
        email: params.email,
        notes: params.notes || "None",
      },
    };

    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`EmailJS error: ${res.status}`);
    }
  } catch (err) {
    // Non-blocking — email failure should not break the booking flow
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn("[emailService] Failed to send notification:", err);
    }
  }
}
