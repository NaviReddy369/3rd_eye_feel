"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmailOnRequest = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const emailConfig_1 = require("./emailConfig");
admin.initializeApp();
// Service name lookup for display in email
const SERVICE_NAMES = {
    "ai-environment-setup": "AI Environment Setup",
    "clone-video": "Clone Video",
    "clone-audio": "Clone Audio",
    "logo-concept-video": "Logo Concept Video",
    "service-concept-video": "Service Concept Video",
    "digital-ads": "Digital Ads",
    "social-media-setup": "Social Media Account Setup & Support",
    "editing-content": "Editing Content",
    "network-setup": "Network Setup Guide & Support",
    "custom-pages": "Custom Pages",
    "business-form-setup": "Business Form Setup",
    "newsletters": "Newsletters",
    "email-setup": "Email Setup",
    "domain-configure": "Domain Configure",
    "tailored-development": "Tailored Development Tasks",
    "other": "General Inquiry",
};
const BUDGET_LABELS = {
    "500-1k": "$500 - $1,000",
    "1k-5k": "$1,000 - $5,000",
    "5k-10k": "$5,000 - $10,000",
    "10k-25k": "$10,000 - $25,000",
    "10k+": "$10,000+",
    "25k+": "$25,000+",
    "custom": "Custom",
};
const TIMELINE_LABELS = {
    "asap": "ASAP",
    "1-2-weeks": "1-2 weeks",
    "1-month": "1 month",
    "2-3-months": "2-3 months",
    "3-6-months": "3-6 months",
    "custom": "Custom",
};
/**
 * When a document is created in "requests", create a corresponding
 * document in "mail" for the Trigger Email extension to send a welcome email.
 * Uses branded template with logo, colors, and robust HTML for email clients.
 */
exports.sendWelcomeEmailOnRequest = functions.firestore
    .document("requests/{requestId}")
    .onCreate(async (snap, context) => {
    const data = snap.data();
    const email = data.email;
    const name = data.name || "there";
    const serviceType = data.serviceType || "Your Requested Service";
    const serviceName = SERVICE_NAMES[serviceType] || serviceType;
    const budget = BUDGET_LABELS[data.budget] || data.budget || "Not specified";
    const timeline = TIMELINE_LABELS[data.timeline] || data.timeline || "Not specified";
    const createdAt = data.createdAt
        ? formatTimestamp(data.createdAt)
        : new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    if (!email || typeof email !== "string") {
        functions.logger.warn("Request document missing email, skipping welcome email");
        return;
    }
    const { LOGO_URL, COMPANY_NAME, TAGLINE, BRAND_COLORS } = emailConfig_1.EMAIL_CONFIG;
    const html = buildWelcomeEmailHtml({
        logoUrl: LOGO_URL,
        companyName: COMPANY_NAME,
        tagline: TAGLINE,
        brandColors: BRAND_COLORS,
        recipientName: name,
        serviceName,
        createdAt,
        budget,
        timeline,
    });
    const mailDoc = {
        to: [email],
        message: {
            subject: `Welcome to ${emailConfig_1.EMAIL_CONFIG.COMPANY_NAME} - Thank You for Your Request!`,
            text: `Hi ${name}, Thank you for contacting ${emailConfig_1.EMAIL_CONFIG.COMPANY_NAME}! We've received your request for ${serviceName} and our team will review it shortly. We typically respond within 24 hours. Request Summary: Service: ${serviceName}, Submitted: ${createdAt}, Budget: ${budget}, Timeline: ${timeline}. Our team will get back to you within 24 hours. Best regards, The ${emailConfig_1.EMAIL_CONFIG.COMPANY_NAME} Team`,
            html,
        },
    };
    await admin.firestore().collection("mail").add(mailDoc);
    functions.logger.info(`Queued welcome email for ${email}`);
});
function buildWelcomeEmailHtml(params) {
    const { logoUrl, companyName, tagline, brandColors, recipientName, serviceName, createdAt, budget, timeline } = params;
    const c = brandColors;
    return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>Welcome to ${escapeHtml(companyName)}</title>
</head>
<body style="margin:0; padding:0; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color:${c.darkBg};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${c.darkBg};">
<tr><td align="center" style="padding:24px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%;" align="center">
  <tr>
    <td align="center" style="padding:40px 24px; background-color:${c.darkBg};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center">
        <tr><td align="center" style="padding-bottom:20px;">
          <img src="${logoUrl}" alt="${escapeHtml(companyName)}" width="160" border="0" style="display:block; max-width:160px; width:160px; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; border:0;" />
        </td></tr>
        <tr><td align="center">
          <h1 style="margin:0; font-size:28px; font-weight:700; color:${c.primary}; line-height:1.3;">${escapeHtml(companyName)}</h1>
        </td></tr>
        <tr><td align="center" style="padding-top:8px;">
          <p style="margin:0; font-size:14px; color:${c.textMuted}; line-height:1.5;">${escapeHtml(tagline)}</p>
        </td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:0 24px 32px 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${c.cardBg}; border:1px solid #333333;">
        <tr><td style="padding:32px 24px;">
          <h2 style="margin:0 0 20px 0; font-size:22px; font-weight:600; color:${c.text}; line-height:1.4;">Hi ${escapeHtml(recipientName)},</h2>
          <p style="margin:0 0 16px 0; font-size:16px; line-height:1.6; color:${c.text};">Thank you for contacting <strong style="color:${c.primary};">${escapeHtml(companyName)}</strong>!</p>
          <p style="margin:0 0 24px 0; font-size:16px; line-height:1.6; color:${c.text};">We've received your request for <strong>${escapeHtml(serviceName)}</strong> and our team will review it shortly. We typically respond within 24 hours.</p>
          <table role="presentation" width="100%" cellpadding="16" cellspacing="0" border="0" style="background-color:${c.darkBg}; margin-bottom:24px;">
            <tr><td colspan="2" style="font-size:14px; font-weight:600; color:${c.primary}; padding-bottom:12px; border-bottom:1px solid #333333;">Request Summary</td></tr>
            <tr><td width="40%" style="font-size:14px; color:${c.textMuted}; padding:10px 0; vertical-align:top;">Service</td><td style="font-size:14px; color:${c.text}; padding:10px 0; vertical-align:top;">${escapeHtml(serviceName)}</td></tr>
            <tr><td style="font-size:14px; color:${c.textMuted}; padding:10px 0; vertical-align:top;">Submitted</td><td style="font-size:14px; color:${c.text}; padding:10px 0; vertical-align:top;">${escapeHtml(createdAt)}</td></tr>
            <tr><td style="font-size:14px; color:${c.textMuted}; padding:10px 0; vertical-align:top;">Budget Range</td><td style="font-size:14px; color:${c.text}; padding:10px 0; vertical-align:top;">${escapeHtml(budget)}</td></tr>
            <tr><td style="font-size:14px; color:${c.textMuted}; padding:10px 0; vertical-align:top;">Timeline</td><td style="font-size:14px; color:${c.text}; padding:10px 0; vertical-align:top;">${escapeHtml(timeline)}</td></tr>
          </table>
          <h3 style="margin:0 0 12px 0; font-size:16px; font-weight:600; color:${c.text};">What happens next?</h3>
          <p style="margin:0 0 24px 0; font-size:16px; line-height:1.6; color:${c.text};">Our team will review your requirements and get back to you within 24 hours with next steps and a personalized proposal.</p>
          <p style="margin:0 0 24px 0; font-size:16px; line-height:1.6; color:${c.text};">If you have any questions, feel free to reach out to us.</p>
          <p style="margin:0; font-size:16px; line-height:1.6; color:${c.text};">Best regards,<br/><strong style="color:${c.accent};">The ${escapeHtml(companyName)} Team</strong></p>
        </td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td align="center" style="padding:24px; background-color:${c.darkBg}; border-top:1px solid #333333;">
      <p style="margin:0; font-size:12px; color:${c.textMuted}; line-height:1.5;">${escapeHtml(companyName)}<br/>${escapeHtml(tagline)}</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>
`;
}
function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
function formatTimestamp(ts) {
    if (ts && typeof ts.toDate === "function") {
        const date = ts.toDate();
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }
    return new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
//# sourceMappingURL=index.js.map