// Tokens.jsx — single source of design data, rendered into the doc.

const COLORS_DARK = [
  { name: "Paper",        token: "--paper",         val: "oklch(0.165 0.008 80)",  note: "Page background" },
  { name: "Paper 2",      token: "--paper-2",       val: "oklch(0.205 0.008 80)",  note: "Cards, surfaces" },
  { name: "Paper 3",      token: "--paper-3",       val: "oklch(0.245 0.008 80)",  note: "Hover, secondary btn" },
  { name: "Ink",          token: "--ink",           val: "oklch(0.97 0.005 90)",   note: "Primary text" },
  { name: "Ink 2",        token: "--ink-2",         val: "oklch(0.78 0.006 85)",   note: "Secondary text" },
  { name: "Ink 3",        token: "--ink-3",         val: "oklch(0.58 0.006 85)",   note: "Placeholder, hints" },
  { name: "Hairline",     token: "--hairline",      val: "oklch(0.32 0.006 80)",   note: "Borders" },
  { name: "Hairline soft",token: "--hairline-soft", val: "oklch(0.26 0.006 80)",   note: "Inner dividers" },
];
const COLORS_LIGHT = [
  { name: "Paper",        token: "--paper",         val: "oklch(0.985 0.004 90)",  note: "Page background" },
  { name: "Paper 2",      token: "--paper-2",       val: "oklch(0.97 0.005 90)",   note: "Cards, surfaces" },
  { name: "Paper 3",      token: "--paper-3",       val: "oklch(0.94 0.006 90)",   note: "Hover, secondary btn" },
  { name: "Ink",          token: "--ink",           val: "oklch(0.18 0.008 80)",   note: "Primary text" },
  { name: "Ink 2",        token: "--ink-2",         val: "oklch(0.42 0.008 80)",   note: "Secondary text" },
  { name: "Ink 3",        token: "--ink-3",         val: "oklch(0.62 0.008 80)",   note: "Placeholder, hints" },
  { name: "Hairline",     token: "--hairline",      val: "oklch(0.86 0.006 90)",   note: "Borders" },
  { name: "Hairline soft",token: "--hairline-soft", val: "oklch(0.92 0.005 90)",   note: "Inner dividers" },
];
const COLORS_ACCENT = [
  { name: "Accent",        token: "--accent",       note: "Brand mark, primary, focus, links" },
  { name: "Accent fg",     token: "--accent-fg",    note: "Text on accent" },
  { name: "Accent ghost",  token: "--accent-ghost", note: "Focus ring, soft fill" },
  { name: "OK",            token: "--ok",           note: "Available, success, healthy link" },
  { name: "Warn",          token: "--warn",         note: "Server error, slow ping" },
  { name: "Danger",        token: "--danger",       note: "Broken link, destructive" },
];

const TYPE_SCALE = [
  { name: "Display",   token: "--t-5xl", px: "64",  weight: 500, sample: "Build it once, share forever." },
  { name: "Title",     token: "--t-3xl", px: "36",  weight: 500, sample: "Public profile" },
  { name: "Heading",   token: "--t-2xl", px: "28",  weight: 500, sample: "Recent projects" },
  { name: "Subhead",   token: "--t-xl",  px: "22",  weight: 500, sample: "Frontend Engineer" },
  { name: "Lead",      token: "--t-lg",  px: "18",  weight: 400, sample: "A portfolio builder for developers." },
  { name: "Body",      token: "--t-base",px: "15",  weight: 400, sample: "Sign in with GitHub. Fill out your projects, skills, and experience." },
  { name: "Small",     token: "--t-sm",  px: "13",  weight: 400, sample: "Last updated 2 days ago." },
  { name: "Caption",   token: "--t-xs",  px: "12",  weight: 400, sample: "TypeScript · Next.js · Drizzle" },
];

const SPACE = [
  { token: "--space-1",  px: 4 },
  { token: "--space-2",  px: 8 },
  { token: "--space-3",  px: 12 },
  { token: "--space-4",  px: 16 },
  { token: "--space-5",  px: 20 },
  { token: "--space-6",  px: 24 },
  { token: "--space-8",  px: 32 },
  { token: "--space-10", px: 40 },
  { token: "--space-12", px: 48 },
  { token: "--space-16", px: 64 },
  { token: "--space-20", px: 80 },
];

const RADII = [
  { token: "--radius-xs", px: 4,  use: "Tags, kbd" },
  { token: "--radius-sm", px: 6,  use: "Small buttons, chips" },
  { token: "--radius-md", px: 10, use: "Default — buttons, inputs" },
  { token: "--radius-lg", px: 14, use: "Cards, dialogs" },
  { token: "--radius-xl", px: 20, use: "Large surfaces" },
];

const SHADOWS = [
  { token: "--shadow-sm",  use: "Subtle resting elevation" },
  { token: "--shadow-md",  use: "Cards on hover, sticky bars" },
  { token: "--shadow-lg",  use: "Modals, popovers" },
  { token: "--shadow-pop", use: "Dialog with stroke ring" },
];

Object.assign(window, { COLORS_DARK, COLORS_LIGHT, COLORS_ACCENT, TYPE_SCALE, SPACE, RADII, SHADOWS });
