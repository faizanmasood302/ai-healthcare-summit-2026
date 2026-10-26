---
id: "002"
title: "Synchronize English Translation with Urdu Recitation"
stage: "general"
date: "2026-10-23"
surface: "agent"
model: "Gemini 3.8 Flash (High)"
feature: "tilawat-e-quran"
branch: "main"
user: "DELL"
command: "sp.implement"
labels: ["tilawat", "quran", "translation-sync", "nextjs"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "app/page.tsx"
tests:
  - "npm run build"
---

### Prompt Text
one thing to add is that just show english translation of ayat at the same when urdu translation is being speeking

### Response Text
Configured the English translation of the main ayat to appear simultaneously with the Urdu translation while the Urdu recitation audio (`ayat_tarjuma.m4a`) is playing. Upon completion of the Urdu recitation, the application automatically transitions into the ending verse (`صَدَقَ اللّٰهُ الْعَظِيْمُ`). Playwright was skipped as instructed, and the Next.js server was rebuilt and started for user manual testing.
