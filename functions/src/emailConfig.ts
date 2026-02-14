/**
 * Centralized email branding configuration.
 * Update these values to change logo, colors, and company info across welcome emails.
 */

export const EMAIL_CONFIG = {
  /** Logo URL - must be HTTPS. Replace public/logo.png and redeploy hosting to change. */
  LOGO_URL: "https://3rdeyefeel.web.app/logo.png",

  /** Company display name */
  COMPANY_NAME: "3rd Eye Feel",

  /** Tagline shown in email footer */
  TAGLINE: "Advanced AI Solutions & Production Services",

  /** Brand colors (matches site tech theme) */
  BRAND_COLORS: {
    primary: "#00d9ff",
    accent: "#00ff88",
    darkBg: "#0a0a0a",
    cardBg: "#1a1a1a",
    text: "#e5e5e5",
    textMuted: "#a3a3a3",
  },

  /** Optional reply-to address (set in extension; documented here for reference) */
  REPLY_TO: "3rdeyefeel@gnkcontinuum.org",
};
