/**
 * Options for the Implementation Guide form (service type, tech stack).
 */

import { SERVICES } from "./services";

export const GUIDE_SERVICE_OPTIONS = SERVICES.map((s) => ({
  value: s.name,
  label: s.name,
}));

export const GUIDE_TECH_STACK_OPTIONS = [
  { value: "No preference", label: "No preference" },
  { value: "React / Node.js", label: "React / Node.js" },
  { value: "Vue / Node.js", label: "Vue / Node.js" },
  { value: "Python", label: "Python" },
  { value: "Next.js", label: "Next.js" },
  { value: "Firebase", label: "Firebase" },
  { value: "AWS", label: "AWS" },
  { value: "Other", label: "Other" },
] as const;
