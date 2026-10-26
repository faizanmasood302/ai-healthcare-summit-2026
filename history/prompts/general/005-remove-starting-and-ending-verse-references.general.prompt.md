---
id: "005"
title: "Remove Starting and Ending Verse Source References"
stage: "general"
date: "2026-10-24"
surface: "agent"
model: "Gemini 3.8 Flash (High)"
feature: "tilawat-e-quran"
branch: "main"
user: "DELL"
command: "sp.implement"
labels: ["tilawat", "quran", "source-reference", "bismillah", "sadaqallahul-azim", "nextjs"]
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
okay remove the reference from the starting verse you show the surah fatiha  and ending verse al e imran referecne remove it keep the ayat referene but remove the first and last one

### Response Text
Removed the source reference pill badges from the starting verse (Surah Al-Fatihah 1:1) and ending verse (Surah Ali 'Imran 3:95) slides in `app/page.tsx` while keeping both slides' Arabic, Urdu Tarjuma, and English translations intact. Preserved the complete Quranic source attribution pill for the main ayat (Surah Ash-Shu'ara 26:79–80). Verified production build with `npm run build` and restarted the live application server on port 3000.
