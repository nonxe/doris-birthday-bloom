import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";

import img06 from "@/assets/IMG-20260705-WA0006.jpg";
import img07 from "@/assets/IMG-20260705-WA0007.jpg";
import img08 from "@/assets/IMG-20260705-WA0008.jpg";
import img09 from "@/assets/IMG-20260705-WA0009.jpg";
import img10 from "@/assets/IMG-20260705-WA0010.jpg";
import img11 from "@/assets/IMG-20260705-WA0011.jpg";
import img12 from "@/assets/IMG-20260705-WA0012.jpg";
import img13 from "@/assets/IMG-20260705-WA0013.jpg";
import img14 from "@/assets/IMG-20260705-WA0014.jpg";

import uploaded1 from "@/assets/uploaded_1.jpg";
import uploaded2 from "@/assets/uploaded_2.jpg";
import uploaded3 from "@/assets/uploaded_3.jpg";
import uploaded4 from "@/assets/uploaded_4.jpg";
import uploaded5 from "@/assets/uploaded_5.jpg";
import uploaded6 from "@/assets/uploaded_6.jpg";
import uploaded7 from "@/assets/uploaded_7.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "For Dorioli • Happy Birthday" },
      { name: "description", content: "A cinematic birthday tribute to Dorioli Das, from Ashish Mazumder." },
    ],
  }),
});

const photos = [
  img13,
  img06,
  img10,
  img12,
  img07,
  img11,
  img08,
  img14,
  img09,
  uploaded1,
  uploaded2,
  uploaded3,
  uploaded4,
  uploaded5,
  uploaded6,
  uploaded7,
];

type Stage = "intro" | "cinema" | "finale";

function Index() {
  const [stage, setStage] = useState<Stage>("intro");

  // Preload all photos as soon as intro mounts so nothing loads mid-animation
  useEffect(() => {
    photos.forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-background">
      <AnimatePresence mode="wait">
        {stage === "intro" && <Intro key="intro" onEnter={() => setStage("cinema")} />}
        {stage === "cinema" && <Cinema key="cinema" onComplete={() => setStage("finale")} />}
        {stage === "finale" && <Finale key="finale" onReplay={() => setStage("cinema")} />}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------ INTRO ------------------------ */

function Intro({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.section
      exit={{ opacity: 0, filter: "blur(24px)", scale: 1.05 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex items-center justify-center px-6"
    >
      <FloatingOrbs />
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-muted-foreground mb-8"
        >
          A little something
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.7, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-4xl md:text-6xl font-light tracking-tight text-foreground"
        >
          This is for you,
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 30, filter: "blur(18px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 1.15, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-7xl md:text-9xl font-medium italic mt-3 bg-gradient-to-br from-[oklch(0.72_0.14_10)] to-[oklch(0.55_0.18_5)] bg-clip-text text-transparent"
        >
          Dorioli
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1.7, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 h-px w-24 bg-gradient-to-r from-transparent via-[oklch(0.72_0.14_10)] to-transparent"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9, duration: 1.1 }}
          className="mt-8 text-[10px] md:text-xs uppercase tracking-[0.4em] text-muted-foreground"
        >
          by Ashish Mazumder
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 1 }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={onEnter}
          className="mt-14 glass px-10 py-4 rounded-full text-foreground text-xs tracking-[0.35em] uppercase font-medium shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-ios)] transition-shadow"
        >
          Enter
        </motion.button>
      </div>
    </motion.section>
  );
}

/* ------------------------ CINEMA (auto-playing timeline) ------------------------ */

const PER_PHOTO_MS = 2200; // dwell per photo
const CROSSFADE_MS = 1400; // overlap
const TOTAL_MS = photos.length * PER_PHOTO_MS;

function Cinema({ onComplete }: { onComplete: () => void }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const yearMV = useMotionValue(2010);
  const yearDisplay = useTransform(yearMV, (v) => Math.round(v).toString());

  useEffect(() => {
    // Animate year counter 2010 -> 2026 across full duration
    const controls = animate(yearMV, 2026, {
      duration: TOTAL_MS / 1000,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [yearMV]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    photos.forEach((_, i) => {
      if (i === 0) return;
      timers.push(setTimeout(() => setActiveIdx(i), i * PER_PHOTO_MS));
    });
    timers.push(setTimeout(onComplete, TOTAL_MS + 400));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const progress = ((activeIdx + 1) / photos.length) * 100;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(20px)" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0"
    >
      {/* Full-bleed cross-fading photo stack */}
      <div className="absolute inset-0">
        {photos.map((src, i) => (
          <motion.div
            key={src}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: i === activeIdx ? 1 : 0,
              scale: i === activeIdx ? 1.08 : 1.16,
            }}
            transition={{
              opacity: { duration: CROSSFADE_MS / 1000, ease: [0.4, 0, 0.2, 1] },
              scale: { duration: PER_PHOTO_MS / 1000 + 1.5, ease: "linear" },
            }}
          >
            <img
              src={src}
              alt=""
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
            {/* very light pink veil — keeps photos crisp while HUD stays readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/40 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/35 to-transparent" />
          </motion.div>
        ))}
      </div>

      {/* Top HUD */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <div className="glass rounded-full px-5 py-2 shadow-[var(--shadow-glass)] flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Dorioli</span>
          <span className="h-3 w-px bg-border" />
          <motion.span className="font-serif text-base font-medium tabular-nums text-foreground">
            {yearDisplay}
          </motion.span>
        </div>
      </div>

      {/* Bottom progress bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-[min(80%,420px)]">
        <div className="h-[3px] w-full rounded-full bg-white/50 overflow-hidden backdrop-blur-md">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[oklch(0.88_0.09_10)] to-[oklch(0.65_0.18_5)]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: CROSSFADE_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-white/90 drop-shadow">
          <span>2010</span>
          <span>a life in bloom</span>
          <span>2026</span>
        </div>
      </div>

      {/* Center caption that reveals near the end */}
      <AnimatePresence>
        {activeIdx >= photos.length - 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          >
            <p className="font-serif italic text-3xl md:text-5xl text-white text-center px-8 drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              sixteen years of you
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

/* ------------------------ FINALE ------------------------ */

function Finale({ onReplay }: { onReplay: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, filter: "blur(24px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex items-center justify-center px-6 overflow-y-auto"
    >
      <FloatingOrbs />
      <SakuraRain />
      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 glass rounded-[2rem] p-10 md:p-14 max-w-xl w-full text-center shadow-[var(--shadow-ios)]"
      >
        <p className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground">14 July 2026</p>
        <h2 className="mt-6 font-serif text-5xl md:text-7xl font-light tracking-tight">
          Happy Birthday,
          <br />
          <span className="italic bg-gradient-to-br from-[oklch(0.72_0.14_10)] to-[oklch(0.55_0.18_5)] bg-clip-text text-transparent">
            Dorioli! 🎉✨
          </span>
        </h2>
        <div className="mt-8 mx-auto h-px w-16 bg-gradient-to-r from-transparent via-[oklch(0.72_0.14_10)] to-transparent" />
        <div className="mt-8 space-y-4 text-muted-foreground leading-relaxed text-sm md:text-base text-left">
          <p>
            I hope this year brings you endless smiles, peace, and everything you've been wishing for. You deserve all the happiness in the world.
          </p>
          <p>
            I don't know what the future holds, but I'd genuinely love to be someone who gets to see you smile more often and make your special days even more special.
          </p>
          <p>
            Stay amazing, take care of yourself, and have the best birthday ever. 💙
          </p>
        </div>
        <p className="mt-10 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          — Ashish Mazumder
        </p>

        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={onReplay}
          className="mt-10 px-8 py-3 rounded-full bg-foreground text-background text-[10px] tracking-[0.4em] uppercase font-medium shadow-[var(--shadow-ios)]"
        >
          Replay
        </motion.button>
      </motion.div>
    </motion.section>
  );
}

/* ------------------------ SHARED ------------------------ */

function FloatingOrbs() {
  return (
    <>
      <motion.div
        className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, oklch(0.88 0.09 10 / 0.55), transparent 70%)" }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 h-[620px] w-[620px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, oklch(0.94 0.05 10 / 0.7), transparent 70%)" }}
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

/* Falling sakura petals — GPU-accelerated, deterministic for SSR */
function SakuraRain() {
  const petals = Array.from({ length: 22 }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const rnd = seed / 233280;
    return {
      left: (i * 4.7 + rnd * 8) % 100,
      delay: rnd * 8,
      duration: 9 + rnd * 7,
      size: 14 + rnd * 14,
      drift: (rnd - 0.5) * 120,
      rotate: rnd * 360,
    };
  });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {petals.map((p, i) => (
        <motion.div
          key={i}
          className="absolute top-[-10%] select-none"
          style={{ left: `${p.left}%`, fontSize: p.size }}
          initial={{ y: "-10vh", x: 0, rotate: p.rotate, opacity: 0 }}
          animate={{
            y: "110vh",
            x: [0, p.drift, -p.drift * 0.6, p.drift * 0.4],
            rotate: p.rotate + 360,
            opacity: [0, 1, 1, 0.9, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.1, 0.5, 0.8, 1],
          }}
        >
          🌸
        </motion.div>
      ))}
    </div>
  );
}
