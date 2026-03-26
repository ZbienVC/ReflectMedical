import { AppointmentData } from "./appointmentService";

// EmailJS configuration
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
const TEMPLATE_CONFIRMATION = import.meta.env.VITE_EMAILJS_TEMPLATE_CONFIRMATION || "";
const TEMPLATE_REMINDER = import.meta.env.VITE_EMAILJS_TEMPLATE_REMINDER || "";
const TEMPLATE_FOLLOWUP = import.meta.env.VITE_EMAILJS_TEMPLATE_FOLLOWUP || "";
const TEMPLATE_OFFICE = import.meta.env.VITE_EMAILJS_TEMPLATE_OFFICE || "";

async function sendEmail(templateId: string, templateParams: Record<string, string>): Promise<void> {
  const payload = {
    service_id: EMAILJS_SERVICE_ID,
    template_id: templateId,
    user_id: EMAILJS_PUBLIC_KEY,
    template_params: templateParams,
  };
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`EmailJS error: ${res.status}`);
}

/** Send appointment confirmation email to patient */
export async function sendAppointmentConfirmation(appointment: {
  name: string;
  email: string;
  service: string;
  date: string;
  time: string;
  phone: string;
}): Promise<void> {
  try {
    await sendEmail(TEMPLATE_CONFIRMATION, {
      to_email: appointment.email,
      to_name: appointment.name,
      service: appointment.service,
      date: appointment.date,
      time: appointment.time,
      phone: appointment.phone,
    });
  } catch (err) {
    if (import.meta.env.DEV) console.warn("[notificationService] sendAppointmentConfirmation failed:", err);
  }
}

/** Send appointment reminder (called manually by admin or automated) */
export async function sendAppointmentReminder(appointment: {
  name: string;
  email: string;
  service: string;
  date: string;
  time: string;
}): Promise<void> {
  await sendEmail(TEMPLATE_REMINDER, {
    to_email: appointment.email,
    to_name: appointment.name,
    service: appointment.service,
    date: appointment.date,
    time: appointment.time,
  });
}

/** Send post-visit follow-up with Google review link */
export async function sendPostVisitFollowUp(appointment: {
  name: string;
  email: string;
  service: string;
}): Promise<void> {
  try {
    await sendEmail(TEMPLATE_FOLLOWUP, {
      to_email: appointment.email,
      to_name: appointment.name,
      service: appointment.service,
      review_link: "https://g.page/r/reflectcosmetic/review",
    });
  } catch (err) {
    if (import.meta.env.DEV) console.warn("[notificationService] sendPostVisitFollowUp failed:", err);
  }
}

/** Send Google review request email */
export async function sendReviewRequest(appointment: {
  name: string;
  email: string;
  service: string;
}): Promise<void> {
  const TEMPLATE_REVIEW = import.meta.env.VITE_EMAILJS_TEMPLATE_REVIEW || "";
  const reviewLink = import.meta.env.VITE_GOOGLE_REVIEW_LINK || "https://g.page/r/YOUR_PLACE_ID/review";
  try {
    await sendEmail(TEMPLATE_REVIEW || TEMPLATE_FOLLOWUP, {
      to_email: appointment.email,
      to_name: appointment.name,
      service: appointment.service,
      review_link: reviewLink,
    });
  } catch (err) {
    if (import.meta.env.DEV) console.warn("[notificationService] sendReviewRequest failed:", err);
  }
}

/** Send office notification when new appointment is booked */
export async function notifyOfficeNewBooking(appointment: AppointmentData): Promise<void> {
  try {
    await sendEmail(TEMPLATE_OFFICE, {
      to_email: "leah@reflectcosmetic.com",
      patient_name: appointment.name,
      patient_email: appointment.email,
      patient_phone: appointment.phone,
      service: appointment.service,
      date: appointment.date,
      time: appointment.time,
      notes: appointment.notes || "None",
    });
  } catch (err) {
    if (import.meta.env.DEV) console.warn("[notificationService] notifyOfficeNewBooking failed:", err);
  }
}
