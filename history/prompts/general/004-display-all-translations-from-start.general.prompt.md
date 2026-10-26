---
id: "004"
title: "Display All Translations and Sources from Start"
stage: "general"
date: "2026-10-24"
surface: "agent"
model: "Gemini 3.8 Flash (High)"
feature: "tilawat-e-quran"
branch: "main"
user: "DELL"
command: "sp.implement"
labels: ["tilawat", "quran", "translation-display", "source-attribution", "nextjs"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
  files:
    - "app/page.tsx"
    - "app/globals.css"
  tests:
    - "npm run build"
---

### Prompt Text
okay your task is to show translation for starting and ayat and ending verse from the start i mean whe the arabic shownup the translation also shownup no slide up for turjuma and show english translation for both starting and ending verse but with complete source

### Response Text
Updated all three verse slides (Starting Verse / Bismillah, Main Ayat, and Ending Verse / Sadaqallahul Azim) so that the Arabic calligraphy, Urdu Tarjuma, English Translation, and complete Quranic source attributions are all visible together right from the start with zero slide-up delays. Removed sequential step gates and slide-up animations while preserving the sequential automated audio playback chain (Arabic recitation followed by Urdu Tarjuma, with automatic advancement to the next slide). Rebuilt the production application with `npm run build` and restarted the live server on port 3000 without invoking Playwright.
