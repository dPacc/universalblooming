"use server";

import nodemailer from "nodemailer";
import { headers } from "next/headers";
import { site } from "@/config/site";

export interface LeadResult {
  ok: boolean;
  error?: string;
}

const clean = (v: FormDataEntryValue | null, max = 500) => String(v ?? "").trim().slice(0, max);

/**
 * Visit / enquiry lead. Delivery channels (all optional, configured by env):
 *  - SMTP_* → email to LEAD_TO (defaults to the centre's email)
 *  - LEAD_WEBHOOK_URL → JSON POST (Google Sheets Apps Script, Zapier, a CRM)
 * Spam: honeypot field, minimum fill time, basic phone validation.
 */
export async function submitLead(_: LeadResult | null, form: FormData): Promise<LeadResult> {
  if (clean(form.get("company"))) return { ok: true }; // honeypot: pretend success
  const started = Number(form.get("started") || 0);
  if (started && Date.now() - started < 2500) return { ok: true };

  const lead = {
    parentName: clean(form.get("parentName"), 80),
    phone: clean(form.get("phone"), 30),
    email: clean(form.get("email"), 120),
    contactPref: clean(form.get("contactPref"), 20),
    childAge: clean(form.get("childAge"), 30),
    program: clean(form.get("program"), 40),
    startWhen: clean(form.get("startWhen"), 40),
    message: clean(form.get("message"), 1500),
    source: clean(form.get("source"), 120),
    page: clean(form.get("page"), 200),
    firstTouch: clean(form.get("firstTouch"), 1000),
    lastTouch: clean(form.get("lastTouch"), 1000),
  };

  if (lead.parentName.length < 2) return { ok: false, error: "Please tell us your name." };
  const digits = lead.phone.replace(/[^\d]/g, "");
  if (digits.length < 8 || digits.length > 15) return { ok: false, error: "Please enter a valid mobile number." };
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return { ok: false, error: "That email doesn't look right." };

  const h = await headers();
  const meta = { ua: h.get("user-agent") ?? "", ip: h.get("x-forwarded-for")?.split(",")[0] ?? "", at: new Date().toISOString() };

  const deliveries: Promise<unknown>[] = [];

  if (process.env.LEAD_WEBHOOK_URL) {
    deliveries.push(
      fetch(process.env.LEAD_WEBHOOK_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...lead, ...meta }),
      }),
    );
  }

  if (process.env.SMTP_HOST) {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: Number(process.env.SMTP_PORT || 465) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    const rows = Object.entries({ ...lead, ...meta })
      .filter(([, v]) => v)
      .map(([k, v]) => `<tr><td style="padding:6px 12px;font-weight:700;color:#564d7f">${k}</td><td style="padding:6px 12px">${escapeHtml(String(v))}</td></tr>`)
      .join("");
    deliveries.push(
      transport.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.LEAD_TO || site.email,
        replyTo: lead.email || undefined,
        subject: `🌸 New visit request: ${lead.parentName} (${lead.program || "program TBC"}, child ${lead.childAge || "age TBC"})`,
        html: `<h2 style="font-family:sans-serif;color:#2b2355">New enquiry from the website</h2><table style="font-family:sans-serif;border-collapse:collapse">${rows}</table>`,
      }),
    );
  }

  if (!deliveries.length) {
    console.warn("[lead] No SMTP_HOST or LEAD_WEBHOOK_URL configured. Lead:", { ...lead, ...meta });
    return { ok: true };
  }

  const results = await Promise.allSettled(deliveries);
  const delivered = results.some((r) => r.status === "fulfilled");
  results.forEach((r) => r.status === "rejected" && console.error("[lead] delivery failed", r.reason));
  return delivered ? { ok: true } : { ok: false, error: "Sorry, something went wrong. Please message us on WhatsApp instead." };
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
