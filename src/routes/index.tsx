import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
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

const photoCaptions = [
  "where magic begins",
  "a soft and gentle warmth",
  "captured in a perfect frame",
  "a smile that lights up the world",
  "serene and peaceful paths",
  "dancing with the wind",
  "eyes full of endless dreams",
  "moments frozen in gold",
  "grace in every heartbeat",
  "shining through the day",
  "a heart full of laughter",
  "standing tall, shining bright",
  "soft whispers of peace",
  "a glimpse of joy",
  "making everyday magic",
  "beautiful, today and always",
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
    <div className="fixed inset-0 overflow-hidden bg-background select-none">
      <MouseGlow />
      <AnimatePresence mode="wait">
        {stage === "intro" && <Intro key="intro" onEnter={() => setStage("cinema")} />}
        {stage === "cinema" && <Cinema key="cinema" onComplete={() => setStage("finale")} />}
        {stage === "finale" && <Finale key="finale" onReplay={() => setStage("cinema")} />}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------ MOUSE GLOW & PARTICLES ------------------------ */

function MouseGlow() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsHovered(true);
    };
    const handleMouseLeave = () => setIsHovered(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 mix-blend-screen transition-opacity duration-500 hidden md:block"
      style={{ opacity: isHovered ? 0.35 : 0 }}
      animate={{
        background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, oklch(0.85 0.12 15 / 0.12), oklch(0.7 0.15 330 / 0.08), transparent 80%)`,
      }}
    />
  );
}

/* ------------------------ INTRO ------------------------ */

function Intro({ onEnter }: { onEnter: () => void }) {
  const nameLetters = Array.from("Dorioli");

  return (
    <motion.section
      exit={{ opacity: 0, filter: "blur(24px)", scale: 1.05 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex items-center justify-center px-6"
    >
      <FloatingOrbs />
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-muted-foreground mb-8"
        >
          A little something
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.6, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-4xl md:text-6xl font-light tracking-tight text-foreground"
        >
          This is for you,
        </motion.h1>

        <h2 className="font-serif text-7xl md:text-9xl font-medium italic mt-3 select-none flex justify-center items-center">
          {nameLetters.map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 60, rotateX: -90, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
              transition={{
                delay: 1.0 + index * 0.08,
                duration: 1.0,
                ease: [0.34, 1.56, 0.64, 1], // bouncy spring-back ease
              }}
              className="inline-block bg-gradient-to-br from-[oklch(0.72_0.14_10)] to-[oklch(0.55_0.18_5)] bg-clip-text text-transparent transform-gpu origin-bottom"
            >
              {char}
            </motion.span>
          ))}
        </h2>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1.8, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 h-px w-28 bg-gradient-to-r from-transparent via-[oklch(0.72_0.14_10)] to-transparent"
        />

        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.1, duration: 1.2 }}
          className="mt-8 text-[10px] md:text-xs uppercase tracking-[0.4em] text-muted-foreground"
        >
          by Ashish Mazumder
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.05, y: -2, boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.15)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          className="mt-14 glass px-12 py-5 rounded-full text-foreground text-xs tracking-[0.35em] uppercase font-medium shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-ios)] transition-all duration-300"
        >
          Enter
        </motion.button>
      </div>
    </motion.section>
  );
}

/* ------------------------ CINEMA (auto-playing timeline) ------------------------ */

const PER_PHOTO_MS = 2500; // dwell per photo (slightly slower for smoother pacing)
const CROSSFADE_MS = 1400; // overlap
const TOTAL_MS = photos.length * PER_PHOTO_MS;

// Alternating Ken Burns panning/zooming settings
const kenBurnsTransforms = [
  { scale: [1.02, 1.15], x: [0, -15], y: [0, -10] },
  { scale: [1.15, 1.02], x: [-15, 15], y: [-10, 5] },
  { scale: [1.02, 1.2], x: [0, 20], y: [0, 15] },
  { scale: [1.2, 1.05], x: [20, -10], y: [15, -5] },
];

function Cinema({ onComplete }: { onComplete: () => void }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const yearMV = useMotionValue(2010);
  const yearDisplay = useTransform(yearMV, (v) => Math.round(v).toString());

  useEffect(() => {
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
  const currentTransform = kenBurnsTransforms[activeIdx % kenBurnsTransforms.length];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(20px)" }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 bg-black"
    >
      {/* Full-bleed cross-fading photo stack */}
      <div className="absolute inset-0 overflow-hidden">
        {photos.map((src, i) => {
          const isActive = i === activeIdx;
          return (
            <motion.div
              key={src}
              className="absolute inset-0"
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0,
                scale: isActive ? currentTransform.scale : 1.15,
                x: isActive ? currentTransform.x : 0,
                y: isActive ? currentTransform.y : 0,
              }}
              transition={{
                opacity: { duration: CROSSFADE_MS / 1000, ease: [0.4, 0, 0.2, 1] },
                scale: { duration: PER_PHOTO_MS / 1000 + 1.0, ease: "easeInOut" },
                x: { duration: PER_PHOTO_MS / 1000 + 1.0, ease: "easeInOut" },
                y: { duration: PER_PHOTO_MS / 1000 + 1.0, ease: "easeInOut" },
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
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/55" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/35 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/50 to-transparent" />
            </motion.div>
          );
        })}
      </div>

      {/* Top HUD */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="glass rounded-full px-6 py-2.5 shadow-[var(--shadow-glass)] flex items-center gap-3"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Dorioli</span>
          <span className="h-3 w-px bg-border" />
          <motion.span className="font-serif text-base font-medium tabular-nums text-foreground">
            {yearDisplay}
          </motion.span>
        </motion.div>
      </div>

      {/* Cinematic Subtitles / Caption Overlay */}
      <div className="absolute bottom-28 left-0 right-0 z-20 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={activeIdx}
            initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
            animate={{ opacity: 0.95, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="font-serif italic text-lg md:text-2xl text-white/95 text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] tracking-wide"
          >
            {photoCaptions[activeIdx]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Bottom progress bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-[min(85%,460px)]">
        <div className="h-[3px] w-full rounded-full bg-white/30 overflow-hidden backdrop-blur-md">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[oklch(0.88_0.09_10)] to-[oklch(0.65_0.18_5)]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: CROSSFADE_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
        <div className="mt-3.5 flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-white/80 drop-shadow">
          <span>2010</span>
          <span className="text-white/60">a life in bloom</span>
          <span>2026</span>
        </div>
      </div>

      {/* Center caption that reveals near the end */}
      <AnimatePresence>
        {activeIdx >= photos.length - 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          >
            <p className="font-serif italic text-3xl md:text-5xl text-white text-center px-8 drop-shadow-[0_4px_30px_rgba(0,0,0,0.65)]">
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
  const [showGallery, setShowGallery] = useState(false);
  const nameLetters = Array.from("Dorioli! 🎉✨");

  return (
    <motion.section
      initial={{ opacity: 0, filter: "blur(24px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex items-center justify-center px-6 overflow-y-auto py-10"
    >
      <FloatingOrbs />
      <SakuraRain />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-10 max-w-5xl w-full">
        <AnimatePresence mode="wait">
          {!showGallery ? (
            <TiltCard 
              key="wishes"
              className="glass rounded-[2.5rem] p-8 md:p-14 max-w-xl w-full text-center shadow-[var(--shadow-ios)] border border-white/20 relative"
            >
              <p className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground">14 July 2026</p>
              
              <h2 className="mt-6 font-serif text-4xl md:text-5xl font-light tracking-tight select-none flex flex-wrap justify-center items-center gap-x-1">
                Happy Birthday, 
                {nameLetters.map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.4 + index * 0.05,
                      duration: 0.8,
                      type: "spring",
                      stiffness: 180,
                    }}
                    className="inline-block bg-gradient-to-br from-[oklch(0.72_0.14_10)] to-[oklch(0.55_0.18_5)] bg-clip-text text-transparent origin-center"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </h2>

              <div className="mt-8 mx-auto h-px w-20 bg-gradient-to-r from-transparent via-[oklch(0.72_0.14_10)] to-transparent" />
              
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

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onReplay}
                  className="px-8 py-3.5 rounded-full border border-border bg-transparent text-foreground text-[10px] tracking-[0.4em] uppercase font-medium hover:bg-white/10 transition-colors"
                >
                  Replay
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowGallery(true)}
                  className="px-8 py-3.5 rounded-full bg-foreground text-background text-[10px] tracking-[0.4em] uppercase font-medium shadow-[var(--shadow-ios)]"
                >
                  Memories 📸
                </motion.button>
              </div>
            </TiltCard>
          ) : (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="glass rounded-[2.5rem] p-8 md:p-12 max-w-3xl w-full shadow-[var(--shadow-ios)] border border-white/20 text-center relative"
            >
              <h3 className="font-serif text-3xl font-light text-foreground select-none">Memory Stack</h3>
              <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mt-2">Drag and toss the photos!</p>
              
              <div className="relative h-[420px] md:h-[480px] w-full flex items-center justify-center overflow-hidden mt-6">
                <PolaroidStack />
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowGallery(false)}
                  className="px-8 py-3.5 rounded-full bg-foreground text-background text-[10px] tracking-[0.4em] uppercase font-medium shadow-[var(--shadow-ios)]"
                >
                  Back to Card ✉️
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

/* 3D Tilt Wrapper */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: (y / (rect.height / 2)) * -6,
      y: (x / (rect.width / 2)) * 6,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div style={{ transform: "translateZ(25px)" }}>{children}</div>
    </motion.div>
  );
}

/* Polaroid Interactive Drag Stack */
function PolaroidStack() {
  const [stack, setStack] = useState(() => 
    photos.map((src, i) => ({
      id: i,
      src,
      caption: photoCaptions[i],
      rotation: (i % 3 === 0 ? -4 : i % 3 === 1 ? 5 : -2) + (i % 2 === 0 ? 1 : -1) * (i * 0.3),
    }))
  );

  const handleDragEnd = (id: number, info: any) => {
    const threshold = 140;
    if (Math.abs(info.offset.x) > threshold || Math.abs(info.offset.y) > threshold) {
      setStack((prev) => {
        // Move the tossed card to the bottom of the stack
        const index = prev.findIndex((item) => item.id === id);
        const newStack = [...prev];
        const [removed] = newStack.splice(index, 1);
        return [removed, ...newStack]; // insert at back (rendered first, which is behind)
      });
    }
  };

  return (
    <div className="relative w-72 h-96">
      {stack.map((item, index) => {
        const isTop = index === stack.length - 1;
        return (
          <motion.div
            key={item.id}
            drag={isTop}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.7}
            onDragEnd={(_, info) => handleDragEnd(item.id, info)}
            animate={{
              scale: isTop ? 1 : 0.95 - (stack.length - 1 - index) * 0.015,
              y: isTop ? 0 : -5 - (stack.length - 1 - index) * 8,
              rotate: isTop ? item.rotation : item.rotation * 0.6,
              zIndex: index,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 24,
            }}
            whileDrag={{ scale: 1.05, rotate: item.rotation * 1.5, cursor: "grabbing" }}
            className={`absolute inset-0 bg-white p-4 pb-12 shadow-[0_15px_35px_rgba(0,0,0,0.18)] border border-neutral-100 flex flex-col justify-between origin-center cursor-grab ${
              isTop ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            <div className="relative w-full h-[85%] overflow-hidden bg-neutral-50 border border-neutral-100">
              <img
                src={item.src}
                alt=""
                className="w-full h-full object-cover select-none pointer-events-none"
                draggable={false}
              />
            </div>
            <div className="h-[15%] flex items-center justify-center">
              <p className="font-serif italic text-xs text-neutral-600 tracking-wider text-center line-clamp-1 select-none">
                {item.caption}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ------------------------ SHARED ------------------------ */

function FloatingOrbs() {
  return (
    <>
      {/* Pink Orb */}
      <motion.div
        className="absolute -top-48 -left-48 h-[600px] w-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, oklch(0.88 0.12 15 / 0.45), transparent 75%)" }}
        animate={{ x: [0, 80, -40, 0], y: [0, 60, 40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Gold Orb */}
      <motion.div
        className="absolute -bottom-48 -right-48 h-[700px] w-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, oklch(0.92 0.08 75 / 0.45), transparent 75%)" }}
        animate={{ x: [0, -60, 40, 0], y: [0, -80, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Violet Orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, oklch(0.8 0.1 310 / 0.18), transparent 70%)" }}
        animate={{ scale: [0.9, 1.15, 0.9], x: [-30, 30, -30], y: [20, -20, 20] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

/* Falling sakura petals and glowing stars — GPU-accelerated */
function SakuraRain() {
  const particles = Array.from({ length: 30 }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const rnd = seed / 233280;
    const isStar = i % 3 === 0; // 1 in 3 is a golden star sparkle
    return {
      id: i,
      left: (i * 3.4 + rnd * 10) % 100,
      delay: rnd * 12,
      duration: 10 + rnd * 8,
      size: (isStar ? 12 : 14) + rnd * 12,
      drift: (rnd - 0.5) * 150,
      rotate: rnd * 360,
      char: isStar ? "✨" : "🌸",
    };
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-[-10%] select-none pointer-events-none"
          style={{ left: `${p.left}%`, fontSize: p.size }}
          initial={{ y: "-10vh", x: 0, rotate: p.rotate, opacity: 0 }}
          animate={{
            y: "110vh",
            x: [0, p.drift, -p.drift * 0.7, p.drift * 0.4],
            rotate: p.rotate + 720,
            opacity: [0, 1, 1, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.08, 0.5, 0.85, 1],
          }}
        >
          {p.char}
        </motion.div>
      ))}
    </div>
  );
}
