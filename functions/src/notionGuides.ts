/**
 * Notion guides list for the enrollment email trigger.
 * Must stay in sync with src/config/notionGuides.ts in the web app.
 * When adding a new guide: add the same entry here (id, title, description, notionLink, isFree), then run npm run build and firebase deploy --only functions.
 */
export interface NotionGuideRecord {
  id: string;
  title: string;
  description: string;
  notionLink: string;
  isFree: boolean;
}

export const NOTION_GUIDES: NotionGuideRecord[] = [
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

export function getGuidesByIds(guideIds: string[]): { title: string; notionLink: string }[] {
  const out: { title: string; notionLink: string }[] = [];
  for (const id of guideIds) {
    const g = NOTION_GUIDES.find((x) => x.id === id);
    if (g) out.push({ title: g.title, notionLink: g.notionLink });
  }
  return out;
}
