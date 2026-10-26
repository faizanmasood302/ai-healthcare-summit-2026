---
id: "007"
title: "Fix Single-Line Ayat, Typography, and Audio in MP4"
stage: "general"
date: "2026-10-24"
surface: "agent"
model: "Gemini 3.8 Flash (High)"
feature: "tilawat-e-quran"
branch: "main"
user: "DELL"
command: "sp.implement"
labels: ["tilawat", "mp4", "single-line-ayat", "font-fidelity", "audio-fix", "ffmpeg"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
  files:
    - "app/globals.css"
    - "app/page.tsx"
    - "public/tilawat_ceremony.mp4"
    - "tilawat_ceremony.mp4"
  tests:
    - "ffprobe -v error public/tilawat_ceremony.mp4"
---

### Prompt Text
delete this video. and why did you remove the style that is use in localhost 3000 the video shows different font style keep the font same also there is no voice add that to also the ayat is dividing into two part keep it same it is in one line the number of ayat 80 is showing down show them whole in one line do it quickly

### Response Text
Deleted the previous video. Resolved the single-line requirement by updating `app/globals.css` with `white-space: nowrap` and expanding `.clean-ceremony-card` width to 1240px so the entire Arabic verse and ayah number 80 remain strictly in one continuous horizontal line. Captured authentic frames directly from `http://localhost:3000` to preserve the exact web typography (Amiri, Noto Nastaliq Urdu, Cormorant Garamond). Fixed the missing audio issue by utilizing FFmpeg's `concat` audio filter across all recitations, translations, and pauses, normalizing and boosting volume (+1.4x) to deliver loud, clear voice in standard AAC stereo. Exported the final video to `public/tilawat_ceremony.mp4` and `tilawat_ceremony.mp4`.
