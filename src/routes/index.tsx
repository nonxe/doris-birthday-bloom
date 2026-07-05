import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

import img06 from "@/assets/IMG-20260705-WA0006.jpg.asset.json";
import img07 from "@/assets/IMG-20260705-WA0007.jpg.asset.json";
import img08 from "@/assets/IMG-20260705-WA0008.jpg.asset.json";
import img09 from "@/assets/IMG-20260705-WA0009.jpg.asset.json";
import img10 from "@/assets/IMG-20260705-WA0010.jpg.asset.json";
import img11 from "@/assets/IMG-20260705-WA0011.jpg.asset.json";
import img12 from "@/assets/IMG-20260705-WA0012.jpg.asset.json";
import img13 from "@/assets/IMG-20260705-WA0013.jpg.asset.json";
import img14 from "@/assets/IMG-20260705-WA0014.jpg.asset.json";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "For Dorioli • Happy Birthday" },
      { name: "description", content: "A birthday tribute to Dorioli Das, from Ashish Mazumder." },
    ],
  }),
});

const photos = [img06, img07, img08, img09, img10, img11, img12, img13, img14];

const timeline = [
  { year: 2010, label: "The beginning", note: "July 14 — a star is born" },
  { year: 2012, label: "Tiny wonder", note: "First giggles, first steps" },
  { year: 2014, label: "Little explorer", note: "Curious about everything" },
  { year: 2016, label: "Dreams begin", note: "Bright eyes, bigger heart" },
  { year: 2018, label: "The spark", note: "Kindness became your language" },
  { year: 2020, label: "Growing bold", note: "Quiet strength, loud laughter" },
  { year: 2022, label: "Blooming", note: "Every day, a little more you" },
  { year: 2024, label: "Radiant", note: "Grace in every step" },
  { year: 2026, label: "Sweet 16", note: "The world is yours, Dorioli" },
];

function Index() {
  const [entered, setEntered] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!entered ? (
        <Intro key="intro" onEnter={() => setEntered(true)} />
      ) : (
        <Journey key="journey" />
      )}
    </AnimatePresence>
  );
}

function Intro({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
    >
      {/* soft floating orbs */}
      <motion.div
        className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, oklch(0.88 0.09 10 / 0.5), transparent 70%)" }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, oklch(0.94 0.05 10 / 0.6), transparent 70%)" }}
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-sm uppercase tracking-[0.4em] text-muted-foreground mb-6"
        >
          A little something
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.6, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-5xl md:text-7xl font-light tracking-tight text-foreground"
        >
          This is for you,
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 1.0, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-7xl md:text-9xl font-medium bg-gradient-to-br from-[oklch(0.72_0.14_10)] to-[oklch(0.55_0.18_5)] bg-clip-text text-transparent italic mt-2"
        >
          Dorioli
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 1.2 }}
          className="mt-8 text-xs uppercase tracking-[0.35em] text-muted-foreground"
        >
          by Ashish Mazumder
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={onEnter}
          className="mt-16 glass px-10 py-4 rounded-full text-foreground text-sm tracking-widest uppercase font-medium shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-ios)] transition-shadow"
        >
          Enter
        </motion.button>
      </div>
    </motion.div>
  );
}

function Journey() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const currentYear = useTransform(scrollYProgress, [0, 1], [2010, 2026]);
  const [yearDisplay, setYearDisplay] = useState(2010);

  useEffect(() => {
    return currentYear.on("change", (v) => setYearDisplay(Math.round(v)));
  }, [currentYear]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      ref={containerRef}
      className="relative"
    >
      {/* sticky year HUD */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 glass rounded-full px-6 py-2 shadow-[var(--shadow-glass)]">
        <div className="flex items-center gap-4 text-xs tracking-widest">
          <span className="text-muted-foreground uppercase">Year</span>
          <span className="font-serif text-lg font-medium text-foreground tabular-nums">{yearDisplay}</span>
        </div>
        <motion.div
          className="mt-1 h-[2px] rounded-full bg-gradient-to-r from-[oklch(0.88_0.09_10)] to-[oklch(0.72_0.14_10)]"
          style={{ width: progressWidth }}
        />
      </div>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1.2 }}
          className="text-xs uppercase tracking-[0.4em] text-muted-foreground"
        >
          14 July 2010 → 14 July 2026
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.7, duration: 1.4 }}
          className="mt-6 font-serif text-6xl md:text-8xl font-light tracking-tight"
        >
          Sixteen years
          <br />
          <span className="italic bg-gradient-to-br from-[oklch(0.72_0.14_10)] to-[oklch(0.55_0.18_5)] bg-clip-text text-transparent">
            of you
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1.2 }}
          className="mt-8 max-w-md text-muted-foreground"
        >
          Scroll gently. Every year, a little moment. Every moment, a little you.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ delay: 2, y: { duration: 2, repeat: Infinity } }}
          className="mt-20 text-xs uppercase tracking-[0.3em] text-muted-foreground"
        >
          ↓ scroll
        </motion.div>
      </section>

      {/* Timeline sections */}
      {timeline.map((entry, i) => (
        <YearSection
          key={entry.year}
          entry={entry}
          image={photos[i % photos.length].url}
          index={i}
        />
      ))}

      {/* Final message */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="glass rounded-[2rem] p-12 md:p-16 max-w-2xl shadow-[var(--shadow-ios)]"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">14 July 2026</p>
          <h2 className="mt-6 font-serif text-5xl md:text-7xl font-light">
            Happy Birthday,
            <br />
            <span className="italic bg-gradient-to-br from-[oklch(0.72_0.14_10)] to-[oklch(0.55_0.18_5)] bg-clip-text text-transparent">
              Dorioli
            </span>
          </h2>
          <p className="mt-8 text-muted-foreground leading-relaxed">
            Sixteen candles, sixteen wishes, and a whole lifetime more.
            Thank you for being the softest kind of magic in this world.
          </p>
          <p className="mt-10 text-xs uppercase tracking-[0.35em] text-muted-foreground">
            — Ashish Mazumder
          </p>
        </motion.div>
      </section>
    </motion.div>
  );
}

function YearSection({
  entry,
  image,
  index,
}: {
  entry: (typeof timeline)[number];
  image: string;
  index: number;
}) {
  const flip = index % 2 === 1;
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className={`grid md:grid-cols-2 gap-12 items-center max-w-5xl w-full ${flip ? "md:[direction:rtl]" : ""}`}>
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative [direction:ltr]"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[oklch(0.88_0.09_10)] to-transparent opacity-40 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] shadow-[var(--shadow-ios)] aspect-[3/4]">
            <motion.img
              src={image}
              alt={`Dorioli in ${entry.year}`}
              className="w-full h-full object-cover"
              initial={{ scale: 1.15 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              loading="lazy"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="[direction:ltr]"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Chapter {index + 1}</p>
          <h3 className="mt-4 font-serif text-7xl md:text-8xl font-light bg-gradient-to-br from-[oklch(0.72_0.14_10)] to-[oklch(0.55_0.18_5)] bg-clip-text text-transparent tabular-nums">
            {entry.year}
          </h3>
          <p className="mt-4 text-2xl md:text-3xl font-serif italic text-foreground">{entry.label}</p>
          <p className="mt-4 text-muted-foreground leading-relaxed max-w-md">{entry.note}</p>
        </motion.div>
      </div>
    </section>
  );
}
