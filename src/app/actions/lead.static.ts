/**
 * Static-hosting stand-in for the lead server action (GitHub Pages has no server).
 * scripts/prepare-static-export.mjs copies this over lead.ts before a static build.
 *
 * Delivery: POSTs JSON to NEXT_PUBLIC_LEAD_ENDPOINT when set (Formspree, a Google
 * Apps Script web app, a CRM webhook); otherwise opens the parent's email app with
 * the enquiry pre-filled, so no lead is ever silently lost.
 */
import { site } from "@/config/site";

export interface LeadResult {
  ok: boolean;
  error?: string;
}

const LABELS: Record<string, string> = {
  parentName: "Name",
  phone: "Mobile / WhatsApp",
  email: "Email",
  contactPref: "Best way to reach",
  childAge: "Child's age",
  program: "Program",
  startWhen: "Start",
  message: "Message",
};

export async function submitLead(_: LeadResult | null, form: FormData): Promise<LeadResult> {
  const get = (k: string) => String(form.get(k) ?? "").trim();
  if (get("company")) return { ok: true }; // honeypot
  if (get("parentName").length < 2) return { ok: false, error: "Please tell us your name." };
  const digits = get("phone").replace(/[^\d]/g, "");
  if (digits.length < 8 || digits.length > 15) return { ok: false, error: "Please enter a valid mobile number." };
  const email = get("email");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "That email doesn't look right." };

  const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT;
  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(form.entries()), at: new Date().toISOString() }),
      });
      if (res.ok) return { ok: true };
    } catch {
      /* fall through to email */
    }
  }

  const lines = Object.entries(LABELS)
    .map(([k, label]) => (get(k) ? `${label}: ${get(k)}` : ""))
    .filter(Boolean);
  lines.push("", `Sent from: ${get("page") || "website"}`);
  const subject = `Visit request: ${get("parentName")}${get("program") ? ` (${get("program")})` : ""}`;
  window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  return { ok: true };
}
