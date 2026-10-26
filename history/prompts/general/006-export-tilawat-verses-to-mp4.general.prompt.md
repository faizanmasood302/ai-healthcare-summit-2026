---
id: "006"
title: "Export Tilawat Verses to 1080p MP4 Video"
stage: "general"
date: "2026-10-24"
surface: "agent"
model: "Gemini 3.8 Flash (High)"
feature: "tilawat-e-quran"
branch: "main"
user: "DELL"
command: "sp.implement"
labels: ["tilawat", "mp4", "export", "video-render", "ffmpeg", "bismillah", "sadaqallahul-azim"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
  files:
    - "public/tilawat_ceremony.mp4"
    - "tilawat_ceremony.mp4"
  tests:
    - "ffprobe -v error public/tilawat_ceremony.mp4"
---

### Prompt Text
save the only part from the starting versebismillah to ending verse into mp4. dont add the title of tilawat e quran

### Response Text
Rendered a full 1080p (1920x1080 @ 30fps) MP4 video containing exclusively the recitation sequence from the Starting Verse (Bismillah) to the Ending Verse (Sadaqallahul Azim), completely omitting the Tilawat-e-Qur'an title slide. Captured pixel-perfect renders of each verse slide with radial sapphire-teal backdrop, gold ambient orbs, and ceremony card typography. Normalized and synchronized the complete audio sequence (Bismillah Arabic + Urdu Tarjuma -> Main Ayat Arabic + Urdu Tarjuma -> Sadaqallahul Azim Arabic + Urdu Tarjuma) with 44.1kHz stereo audio and soft outro fade. Saved the final video to both `public/tilawat_ceremony.mp4` and `tilawat_ceremony.mp4`.
