"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmailOnRequest = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
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
    const html = `
<h2>Hi ${escapeHtml(name)},</h2>

<p>Thank you for contacting <strong>3rd Eye Feel</strong>!</p>

<p>We've received your request for <strong>${escapeHtml(serviceName)}</strong> and our team will review it shortly. We typically respond within 24 hours.</p>

<h3>Request Summary:</h3>
<ul>
  <li><strong>Service:</strong> ${escapeHtml(serviceName)}</li>
  <li><strong>Submitted:</strong> ${escapeHtml(createdAt)}</li>
  <li><strong>Budget Range:</strong> ${escapeHtml(budget)}</li>
  <li><strong>Timeline:</strong> ${escapeHtml(timeline)}</li>
</ul>

<h3>What happens next?</h3>
<p>Our team will review your requirements and get back to you within 24 hours with next steps and a personalized proposal.</p>

<p>If you have any questions, feel free to reach out to us.</p>

<p>Best regards,<br>
The 3rd Eye Feel Team</p>

<hr>
<p><small>3rd Eye Feel<br>
Advanced AI Solutions & Production Services</small></p>
`;
    const mailDoc = {
        to: [email],
        message: {
            subject: "Welcome to 3rd Eye Feel - Thank You for Your Request!",
            text: `Hi ${name}, Thank you for contacting 3rd Eye Feel! We've received your request for ${serviceName} and our team will review it shortly. We typically respond within 24 hours. Request Summary: Service: ${serviceName}, Submitted: ${createdAt}, Budget: ${budget}, Timeline: ${timeline}. Our team will get back to you within 24 hours. Best regards, The 3rd Eye Feel Team`,
            html,
        },
    };
    await admin.firestore().collection("mail").add(mailDoc);
    functions.logger.info(`Queued welcome email for ${email}`);
});
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