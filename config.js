// ═══════════════════════════════════════════════════════════════════════
//  DIGITAL NFC CARD — CONFIGURATION
//  Edit the values below to customize your card. That's it!
// ═══════════════════════════════════════════════════════════════════════

const CARD_CONFIG = {

  // ── Personal Info ──────────────────────────────────────────────────
  name:     "Alex Morgan",
  title:    "Senior Product Designer",
  company:  "Nexus Studio",
  tagline:  "Crafting digital experiences that inspire",

  // ── Contact ────────────────────────────────────────────────────────
  phone:    "+1 (555) 234-5678",
  email:    "alex@nexusstudio.io",
  website:  "https://nexusstudio.io",
  location: "San Francisco, CA",

  // ── Social Links ───────────────────────────────────────────────────
  // Set any to null to hide that button
  linkedin:  "https://linkedin.com/in/alexmorgan",
  twitter:   "https://twitter.com/alexmorgan",
  github:    "https://github.com/alexmorgan",
  instagram: null,

  // ── Card URL ───────────────────────────────────────────────────────
  // Update this to your deployed HTTPS URL for NFC + QR to work correctly
  cardUrl:  window.location.origin + window.location.pathname.replace(/[^/]*$/, '') + "card.html",

  // ── Avatar ─────────────────────────────────────────────────────────
  // Set to an image URL, or leave null to use initials
  avatar:   null,

};
