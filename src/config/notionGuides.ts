/**
 * Notion guides: list of guides users can enroll in.
 * Only enrolled users receive the Notion link via email (notionLink is not shown on the site).
 *
 * To add a new guide: add an entry here and in functions/src/notionGuides.ts (same id, title, description, notionLink, isFree).
 * Redeploy the app and `firebase deploy --only functions` so the enrollment email trigger sends the new link.
 */
export interface NotionGuide {
  id: string;
  title: string;
  description: string;
  /** Notion page URL; used only server-side when sending the enrollment email. */
  notionLink: string;
  isFree: boolean;
}

export const NOTION_GUIDES: NotionGuide[] = [
  {
    id: "server-linux-setup",
    title: "Server and Linux Setup",
    description: "Fast-track setup for servers and Linux environments. Get the full Notion guide link by email when you enroll.",
    notionLink: "https://abrasive-pangolin-59f.notion.site/Server-and-Linux-Setup-30cc7aef2566806a8447f791a5959a1b",
    isFree: true,
  },
  {
    id: "firebase-auth-setup",
    title: "Firebase Authentication Setup",
    description: "Step-by-step Firebase Auth setup for web and mobile. Enroll to receive the Notion guide link by email.",
    notionLink: "https://abrasive-pangolin-59f.notion.site/Firebase-Authentication-Setup-30cc7aef25668009a28ed154f31f48ec",
    isFree: true,
  },
];
