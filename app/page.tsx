"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface FloatingElement {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: number;
  drift: string;
  rotation: string;
  type: "petal" | "stardust";
}

type Stage =
  | "welcome"
  | "poster"
  | "tilawat-title"
  | "starting-verse"
  | "main-ayat"
  | "ending-verse";

export default function SummitWelcomePage() {
  const [stage, setStage] = useState<Stage>("welcome");
  const [curtainsVisible, setCurtainsVisible] = useState(false);
  const [curtainsOpening, setCurtainsOpening] = useState(false);

  // Audio References
  const applauseRef = useRef<HTMLAudioElement | null>(null);
  const startingVerseRef = useRef<HTMLAudioElement | null>(null);
  const startingVerseTranslationRef = useRef<HTMLAudioElement | null>(null);
  const ayatRef = useRef<HTMLAudioElement | null>(null);
  const ayatTarjumaRef = useRef<HTMLAudioElement | null>(null);
  const endingVerseRef = useRef<HTMLAudioElement | null>(null);

  const fadeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedRef = useRef(false);

  // Allow direct stage preview / rendering via ?slide= URL parameter
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const slideParam = params.get("slide") as Stage | null;
      if (
        slideParam &&
        [
          "welcome",
          "poster",
          "tilawat-title",
          "starting-verse",
          "main-ayat",
          "ending-verse",
        ].includes(slideParam)
      ) {
        setStage(slideParam);
      }
    }
  }, []);

  // Floating petals & gold stardust
  const floatingItems: FloatingElement[] = useMemo(() => {
    return Array.from({ length: 54 }, (_, i) => {
      const isStardust = i % 3 === 0;
      return {
        id: i,
        left: `${((i * 37 + 13) % 96) + 2}%`,
        delay: `${((i * 0.24) % 4.5).toFixed(2)}s`,
        duration: `${(isStardust ? 6.5 : 8.2) + (i % 6) * 0.65}s`,
        size: isStardust ? 5 + (i % 4) * 2 : 11 + (i % 5) * 3,
        drift: `${((i * 19) % 140) - 70}px`,
        rotation: `${(i * 53) % 360}deg`,
        type: isStardust ? "stardust" : "petal",
      };
    });
  }, []);

  // Web Audio chime fallback
  const playCeremonialChime = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const frequencies = [528, 660, 792, 1056];
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);
        gain.gain.setValueAtTime(0.0001, ctx.currentTime + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(
          0.11 / (idx + 1),
          ctx.currentTime + idx * 0.15 + 0.1
        );
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          ctx.currentTime + idx * 0.15 + 4.5
        );
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.15);
        osc.stop(ctx.currentTime + idx * 0.15 + 4.8);
      });
    } catch {
      // Ignore
    }
  }, []);

  // Stop all recitation audios
  const stopAllAudios = useCallback(() => {
    if (endingTimerRef.current) {
      clearTimeout(endingTimerRef.current);
      endingTimerRef.current = null;
    }
    [
      startingVerseRef,
      startingVerseTranslationRef,
      ayatRef,
      ayatTarjumaRef,
      endingVerseRef,
    ].forEach((ref) => {
      if (ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });
  }, []);

  // 1. BEGIN CEREMONY: Curtains open and reveal the Summit Logo / Poster stage
  const handleBeginCeremony = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const audio = applauseRef.current;
    if (audio) {
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
      audio.currentTime = 0;
      audio.volume = 0.65;
      audio.play().catch(() => playCeremonialChime());

      fadeTimerRef.current = setInterval(() => {
        if (!audio || audio.paused) {
          if (fadeTimerRef.current) {
            clearInterval(fadeTimerRef.current);
            fadeTimerRef.current = null;
          }
          return;
        }
        if (audio.currentTime >= 5 && audio.volume > 0.03) {
          audio.volume = Math.max(0, audio.volume - 0.03);
        }
        if (audio.volume <= 0.03) {
          audio.pause();
          audio.currentTime = 0;
          if (fadeTimerRef.current) {
            clearInterval(fadeTimerRef.current);
            fadeTimerRef.current = null;
          }
        }
      }, 150);
    } else {
      playCeremonialChime();
    }

    setCurtainsVisible(true);

    // Curtains open -> Show Summit Logo / Poster stage
    openTimerRef.current = setTimeout(() => {
      setStage("poster");
      setCurtainsOpening(true);
    }, 650);
  }, [playCeremonialChime]);

  // 2. ADVANCE TO TILAWAT TITLE (When space/click on poster)
  const handleGoToTilawatTitle = useCallback(() => {
    stopAllAudios();
    setStage("tilawat-title");
  }, [stopAllAudios]);

  // 5. MOVE TO ENDING VERSE (Sadaqallahul Azim)
  const handleGoToEndingVerse = useCallback(() => {
    stopAllAudios();
    setStage("ending-verse");

    setTimeout(() => {
      if (endingVerseRef.current) {
        endingVerseRef.current.currentTime = 0;
        endingVerseRef.current.volume = 0.95;
        endingVerseRef.current.play().catch(() => {});
      }
    }, 200);
  }, [stopAllAudios]);

  // When Urdu Tarjuma ends -> Automatically transition to Ending Verse
  const handleAyatTarjumaEnded = useCallback(() => {
    // Both Urdu Tarjuma and English translation were already shown together while Urdu was speaking.
    // Automatically transition to Ending Verse after a 2.5s graceful pause
    if (endingTimerRef.current) clearTimeout(endingTimerRef.current);
    endingTimerRef.current = setTimeout(() => {
      handleGoToEndingVerse();
    }, 2500);
  }, [handleGoToEndingVerse]);

  // When Arabic Ayat ends -> Play Urdu Tarjuma audio
  const handleAyatEnded = useCallback(() => {
    const audio = ayatTarjumaRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.95;
      audio.play().catch((err) => {
        console.warn("Urdu audio play error, auto-advancing after duration fallback:", err);
        if (endingTimerRef.current) clearTimeout(endingTimerRef.current);
        endingTimerRef.current = setTimeout(() => {
          handleGoToEndingVerse();
        }, 7500);
      });
    } else {
      if (endingTimerRef.current) clearTimeout(endingTimerRef.current);
      endingTimerRef.current = setTimeout(() => {
        handleGoToEndingVerse();
      }, 7500);
    }
  }, [handleGoToEndingVerse]);

  // 4. MOVE TO MAIN AYAT (Surah Ash-Shu'ara 26:79-80)
  const handleGoToMainAyat = useCallback(() => {
    stopAllAudios();
    setStage("main-ayat");

    const audio = ayatRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.95;
      audio.play().catch(() => {});
    }
  }, [stopAllAudios]);

  // When Starting Verse (Bismillah) ends -> Play its Urdu Tarjuma
  const handleStartingVerseEnded = useCallback(() => {
    const audio = startingVerseTranslationRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.95;
      audio.play().catch(() => {
        setTimeout(() => {
          handleGoToMainAyat();
        }, 5000);
      });
    }
  }, [handleGoToMainAyat]);

  // 3. MOVE TO STARTING VERSE (Bismillah & Tarjuma)
  const handleGoToStartingVerse = useCallback(() => {
    stopAllAudios();
    setStage("starting-verse");

    // Start Arabic Bismillah audio
    setTimeout(() => {
      if (startingVerseRef.current) {
        startingVerseRef.current.currentTime = 0;
        startingVerseRef.current.volume = 0.95;
        startingVerseRef.current.play().catch(() => {});
      }
    }, 150);
  }, [stopAllAudios]);

  // Reset back to Welcome screen
  const handleReset = useCallback(() => {
    if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (endingTimerRef.current) {
      clearTimeout(endingTimerRef.current);
      endingTimerRef.current = null;
    }

    if (applauseRef.current) {
      applauseRef.current.pause();
      applauseRef.current.currentTime = 0;
    }
    stopAllAudios();

    setCurtainsOpening(false);
    setCurtainsVisible(false);
    setStage("welcome");
    startedRef.current = false;
  }, [stopAllAudios]);

  // PowerPoint-style Screen Click & Keyboard Remote Navigation
  const handleScreenClick = useCallback(() => {
    if (stage === "welcome") {
      handleBeginCeremony();
    } else if (stage === "poster") {
      handleGoToTilawatTitle();
    } else if (stage === "tilawat-title") {
      handleGoToStartingVerse();
    } else if (stage === "starting-verse") {
      handleGoToMainAyat();
    } else if (stage === "main-ayat") {
      handleGoToEndingVerse();
    } else if (stage === "ending-verse") {
      handleReset();
    }
  }, [
    stage,
    handleBeginCeremony,
    handleGoToTilawatTitle,
    handleGoToStartingVerse,
    handleGoToMainAyat,
    handleGoToEndingVerse,
    handleReset,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const target = event.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (event.key === "Escape") {
        handleReset();
        return;
      }

      // Space / Enter / ArrowRight / PageDown (PowerPoint Advance)
      if (
        event.code === "Space" ||
        event.key === "Enter" ||
        event.key === "ArrowRight" ||
        event.key === "PageDown"
      ) {
        event.preventDefault();
        handleScreenClick();
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        // Go back
        if (stage === "ending-verse") {
          handleGoToMainAyat();
        } else if (stage === "main-ayat") {
          handleGoToStartingVerse();
        } else if (stage === "starting-verse") {
          handleGoToTilawatTitle();
        } else if (stage === "tilawat-title") {
          stopAllAudios();
          setStage("poster");
        } else if (stage === "poster") {
          handleReset();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
    };
  }, [
    stage,
    handleScreenClick,
    handleGoToTilawatTitle,
    handleGoToMainAyat,
    handleGoToStartingVerse,
    handleReset,
    stopAllAudios,
  ]);

  return (
    <main
      className={[
        "summit-stage",
        curtainsVisible ? "curtains-visible" : "",
        curtainsOpening ? "curtains-opening" : "",
        stage === "poster" ? "is-open" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={handleScreenClick}
    >
      {/* ---------------- AUDIO ELEMENTS ---------------- */}
      <audio
        ref={applauseRef}
        src="/applause.mp3"
        preload="auto"
        aria-hidden="true"
      />
      <audio
        ref={startingVerseRef}
        src="/startingverse.mp3"
        preload="auto"
        aria-hidden="true"
        onEnded={handleStartingVerseEnded}
      />
      <audio
        ref={startingVerseTranslationRef}
        src="/startingversetranslation.mp3"
        preload="auto"
        aria-hidden="true"
        onEnded={() => {
          setTimeout(() => {
            handleGoToMainAyat();
          }, 800);
        }}
      />
      <audio
        ref={ayatRef}
        src="/ayat.mp3"
        preload="auto"
        aria-hidden="true"
        onEnded={handleAyatEnded}
      />
      <audio
        ref={ayatTarjumaRef}
        src="/ayat_tarjuma.mp3"
        preload="auto"
        aria-hidden="true"
        onEnded={handleAyatTarjumaEnded}
        onError={handleAyatTarjumaEnded}
      />
      <audio
        ref={endingVerseRef}
        src="/endingverse.mp3"
        preload="auto"
        aria-hidden="true"
      />

      {/* ---------------- AMBIENT ROYAL BACKDROP ---------------- */}
      <div className="ambient-backdrop" aria-hidden="true">
        <div className="ambient-orb orb-top" />
        <div className="ambient-orb orb-bottom" />
        <div className="stage-border-frame" />
      </div>

      {/* =========================================================================
          STAGE 1: WELCOME SCREEN (INITIAL SCREEN - LOCKED TO 100SVH)
      ========================================================================= */}
      {stage === "welcome" && (
        <section
          className="welcome-screen"
          aria-label="Summit Welcome Note"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="welcome-card">
            {/* Decorative Corner Accents */}
            <span className="corner-ornament corner-tl" aria-hidden="true" />
            <span className="corner-ornament corner-tr" aria-hidden="true" />
            <span className="corner-ornament corner-bl" aria-hidden="true" />
            <span className="corner-ornament corner-br" aria-hidden="true" />

            {/* SMI University Logo */}
            <div className="crest-header">
              <div className="crest-medallion">
                <Image
                  src="/uni.png"
                  alt="SMI University Logo - Established 1885"
                  width={120}
                  height={120}
                  priority
                  className="logo-image"
                />
              </div>
            </div>

            <p className="eyebrow">
              <span>ESTD. 1885</span>
              <span className="eyebrow-dot">✦</span>
              <span>SINDH MADRESSATUL ISLAM UNIVERSITY</span>
            </p>

            <h1 className="welcome-title">Welcome to the Grand Summit</h1>

            <div className="ornamental-divider" aria-hidden="true">
              <span className="divider-line" />
              <span className="divider-diamond">❖</span>
              <span className="divider-line" />
            </div>

            <p className="honour-text">
              Honourable Vice Chancellor, Distinguished Guests, Respected Faculty,
              Researchers, Healthcare Dignitaries, Delegates, and Esteemed Students
            </p>

            <p className="welcome-message">
              It is our distinct privilege to convene this gathering at the
              intersection of empathetic artificial intelligence, clinical
              innovation, and mental well-being—envisioning compassionate
              solutions that foster resilience and healthier lives.
            </p>

            {/* Compact Royal Event Showcase Box */}
            <div className="event-showcase">
              <div className="event-kicker-row">
                <span className="kicker-line" />
                <span className="event-label">INAUGURAL CEREMONY</span>
                <span className="kicker-line" />
              </div>

              <h2 className="event-title">AI &amp; Healthcare Summit 2026</h2>

              <p className="event-theme">
                Advancing Solutions for Stress, Mental Health &amp; Diabetes
              </p>

              <div className="thematic-pills">
                <span className="theme-pill">Stress Resilience</span>
                <span className="theme-pill">Mental Well-Being</span>
                <span className="theme-pill">Metabolic &amp; Diabetes Care</span>
              </div>

              <div className="event-date-bar">
                <span className="date-badge">04 NOVEMBER 2026</span>
                <span className="date-divider">•</span>
                <span className="awareness-tag">
                  IN RECOGNITION OF WORLD STRESS AWARENESS DAY
                </span>
              </div>
            </div>

            {/* Ceremonial Reveal Trigger */}
            <div className="cta-footer">
              <button
                type="button"
                className="reveal-button"
                onClick={handleBeginCeremony}
                disabled={curtainsVisible}
              >
                <span className="button-shimmer" aria-hidden="true" />
                <span className="button-star">✦</span>
                <span>
                  {curtainsVisible
                    ? "Unveiling the Summit..."
                    : "Begin the Ceremony"}
                </span>
                <span className="button-arrow">→</span>
              </button>

              <p className="keyboard-hint">
                Press <kbd>SPACE</kbd> or <kbd>ENTER</kbd> to unveil
              </p>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          STAGE 2: SUMMIT LOGO / POSTER STAGE (COMES AFTER CURTAIN REMOVE)
      ========================================================================= */}
      {stage === "poster" && (
        <section
          className="summit-reveal"
          aria-label="AI and Healthcare Summit 2026 Official Poster"
          style={{ opacity: 1, visibility: "visible", transform: "scale(1)", cursor: "pointer" }}
          onClick={handleGoToTilawatTitle}
        >
          <header className="poster-header">
            <p className="poster-kicker">
              1885 • SINDH MADRESSATUL ISLAM UNIVERSITY
            </p>
            <h2 className="poster-heading-title">The Summit Begins</h2>
            <p className="poster-subtitle">
              Innovation, Empathy &amp; Clinical Excellence for Mental Health
            </p>
          </header>

          <div className="poster-stage-area">
            <div className="poster-frame">
              <Image
                src="/summitposter.jpeg"
                alt="AI & Healthcare Summit 2026 official poster"
                width={1200}
                height={1697}
                priority
                className="summit-poster"
                sizes="(max-width: 768px) 90vw, 55vh"
              />
            </div>
          </div>

          <footer className="poster-footer-bar" onClick={(e) => e.stopPropagation()}>
            <div className="poster-meta-text">
              <span>AI &amp; Healthcare Summit 2026</span>
              <span className="meta-sep">✦</span>
              <span className="meta-gold">04 November 2026</span>
              <span className="meta-sep">✦</span>
              <span>World Stress Awareness Day</span>
            </div>

            <div className="stage-controls">
              <button
                type="button"
                className="control-pill"
                onClick={handleGoToTilawatTitle}
                style={{
                  background: "linear-gradient(135deg, #0b5856 0%, #063338 50%, #094864 100%)",
                  borderColor: "var(--gold-bright)",
                  fontWeight: 700,
                }}
              >
                ۞ Press SPACE for Tilawat-e-Qur'an →
              </button>
            </div>
          </footer>
        </section>
      )}

      {/* =========================================================================
          STAGE 3: WHEN PRESS SPACE -> ONLY TILAWAT-E-QUR'AN SIMPLE & TRANSLATION
          (NO OTHER SIMPLE WORD, NO ICONS, NO CLUTTER)
      ========================================================================= */}
      {stage === "tilawat-title" && (
        <section
          className="clean-ceremony-screen"
          aria-label="Tilawat-e-Qur'an Title"
        >
          <div className="clean-ceremony-card">
            {/* Arabic Title */}
            <h1 className="clean-arabic-title" lang="ar" dir="rtl">
              تِلَاوَتِ قُرْآنِ مَجِیْد
            </h1>

            {/* English Translation */}
            <h2 className="clean-english-title">
              Recitation of the Holy Qur'an
            </h2>
          </div>
        </section>
      )}

      {/* =========================================================================
          STAGE 4: STARTING VERSE (BISMILLAH, TARJUMA & ENGLISH FROM START)
      ========================================================================= */}
      {stage === "starting-verse" && (
        <section
          className="clean-ceremony-screen"
          aria-label="Starting Verse"
        >
          <div className="clean-ceremony-card">
            {/* Arabic Starting Verse (Bismillah) */}
            <p className="clean-arabic-verse" lang="ar" dir="rtl">
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
            </p>

            {/* Urdu Tarjuma for Starting Verse */}
            <p className="clean-urdu-tarjuma" lang="ur" dir="rtl">
              شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔
            </p>

            {/* English Translation */}
            <p className="clean-english-tarjuma" lang="en">
              "In the name of Allah, the Entirely Merciful, the Especially Merciful."
            </p>
          </div>
        </section>
      )}

      {/* =========================================================================
          STAGE 5: MAIN AYAT (ARABIC, URDU TARJUMA & ENGLISH FROM START)
      ========================================================================= */}
      {stage === "main-ayat" && (
        <section
          className="clean-ceremony-screen"
          aria-label="Main Quranic Verse"
        >
          <div className="clean-ceremony-card">
            {/* Arabic Verse with Ayah End Numbers 79 and 80 */}
            <p className="clean-arabic-verse" lang="ar" dir="rtl">
              وَ الَّذِىۡ هُوَ يُطۡعِمُنِىۡ وَيَسۡقِيۡنِۙ‏
              <span className="ayah-num">﴿۷۹﴾</span>
              وَاِذَا مَرِضۡتُ فَهُوَ يَشۡفِيۡنِ
              <span className="ayah-num">﴿۸۰﴾</span>
            </p>

            {/* Urdu Tarjuma */}
            <p className="clean-urdu-tarjuma" lang="ur" dir="rtl">
              اور وہ جو مجھے کھلاتا اور پلاتا ہے۔ اور جب میں بیمار ہوں تو وہی مجھے شفا دیتا ہے۔
            </p>

            {/* English Translation */}
            <p className="clean-english-tarjuma" lang="en">
              "Who gives me food and drink, and Who, when I am ill, heals me."
            </p>

            {/* Complete Source Attribution */}
            <div className="clean-source-tag">
              <span>Surah Ash-Shu'ara (26:79–80)</span>
              <span className="source-dot">✦</span>
              <span className="source-arabic" lang="ar" dir="rtl">
                سُوْرَةُ الشُّعَرَاءِ
              </span>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          STAGE 6: ENDING VERSE (ARABIC, URDU TARJUMA & ENGLISH FROM START)
      ========================================================================= */}
      {stage === "ending-verse" && (
        <section
          className="clean-ceremony-screen"
          aria-label="Ending Verse"
        >
          <div className="clean-ceremony-card">
            {/* Arabic Ending Verse */}
            <p className="clean-arabic-verse" lang="ar" dir="rtl">
              صَدَقَ اللّٰهُ الْعَظِيْمُ
            </p>

            {/* Urdu Tarjuma */}
            <p className="clean-urdu-tarjuma" lang="ur" dir="rtl">
              اللہ عظمت والے نے سچ فرمایا
            </p>

            {/* English Translation */}
            <p className="clean-english-tarjuma" lang="en">
              "Allah, the Almighty, has spoken the truth."
            </p>
          </div>
        </section>
      )}

      {/* ---------------- SLOW ROYAL VELVET CURTAINS ---------------- */}
      <div className="curtain-layer" aria-hidden="true">
        <div className="curtain curtain-left">
          <div className="curtain-velvet-pleats" />
          <div className="curtain-sheen" />
          <div className="curtain-gold-edge" />
        </div>

        <div className="curtain curtain-right">
          <div className="curtain-velvet-pleats" />
          <div className="curtain-sheen" />
          <div className="curtain-gold-edge" />
        </div>

        <div className="curtain-center-seam" />

        {/* Central Royal Gold Seal */}
        <div className="curtain-royal-seal">
          <div className="seal-outer-ring">
            <div className="seal-inner-disc">
              <span className="seal-emblem">✦</span>
              <span className="seal-year">1885</span>
              <span className="seal-sub">SMIU</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- PETAL & GOLD STARDUST SHOWER ---------------- */}
      {(curtainsVisible || stage !== "welcome") && (
        <div className="petal-shower" aria-hidden="true">
          {floatingItems.map((item) => (
            <span
              key={item.id}
              className={
                item.type === "petal" ? "flower-petal" : "stardust-mote"
              }
              style={
                {
                  left: item.left,
                  animationDelay: item.delay,
                  animationDuration: item.duration,
                  width: `${item.size}px`,
                  height:
                    item.type === "petal"
                      ? `${item.size * 1.35}px`
                      : `${item.size}px`,
                  "--petal-drift": item.drift,
                  "--petal-rot": item.rotation,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}
    </main>
  );
}
