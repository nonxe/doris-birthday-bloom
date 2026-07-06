import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Point {
  x: number;
  y: number;
}

// Generate heart points for drawing
const heartPoints: Point[] = [];
for (let i = 10; i < 30; i += 0.15) {
  const t = i / Math.PI;
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  heartPoints.push({ x, y });
}

function inHeart(x: number, y: number, r: number): boolean {
  const nx = x / r;
  const ny = y / r;
  const term1 = nx * nx + ny * ny - 1;
  return term1 * term1 * term1 - nx * nx * ny * ny * ny < 0;
}

function bezier(p1: Point, p2: Point, p3: Point, t: number): Point {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  return {
    x: uu * p1.x + 2 * u * t * p2.x + tt * p3.x,
    y: uu * p1.y + 2 * u * t * p2.y + tt * p3.y,
  };
}

// Exact branch data from CODEING-BROS/happybday
const branchData = [
  535, 680, 570, 250, 500, 200, 30, 100, [
    [540, 500, 455, 417, 340, 400, 13, 100, [
      [450, 435, 434, 430, 394, 395, 2, 40]
    ]],
    [550, 445, 600, 356, 680, 345, 12, 100, [
      [578, 400, 648, 409, 661, 426, 3, 80]
    ]],
    [539, 281, 537, 248, 534, 217, 3, 40],
    [546, 397, 413, 247, 328, 244, 9, 80, [
      [427, 286, 383, 253, 371, 205, 2, 40],
      [498, 345, 435, 315, 395, 330, 4, 60]
    ]],
    [546, 357, 608, 252, 678, 221, 6, 100, [
      [590, 293, 646, 277, 648, 271, 2, 80]
    ]]
  ]
];

interface Branch {
  p1: Point;
  p2: Point;
  p3: Point;
  radius: number;
  length: number;
  len: number;
  childBranches: any[];
}

interface Bloom {
  p: Point;
  color: string;
  maxScale: number;
  scale: number;
  speed: number;
  alpha: number;
  angle: number;
}

interface FallingHeart {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  spin: number;
  alpha: number;
  color: string;
}

export function LoveTree({ onBloomComplete }: { onBloomComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"seed" | "seed-shrinking" | "seed-falling" | "growing" | "blooming" | "bloomed-wait" | "done">("seed");
  const stateRef = useRef(state);
  const [timeString, setTimeString] = useState("");
  
  // Seed position and properties
  const seedPos = useRef({ x: 550, y: 300 });
  const seedScale = useRef(2.0); // Size matching scale=2 from original
  const seedAlpha = useRef(1.0);
  const pulseScale = useRef(2.0);
  const footerLength = useRef(0);

  // Animation entities
  const activeBranches = useRef<Branch[]>([]);
  const bloomsCache = useRef<Bloom[]>([]);
  const activeBlooms = useRef<Bloom[]>([]);
  const fallingHearts = useRef<FallingHeart[]>([]);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Live countdown timer since 14 July 2010
  useEffect(() => {
    if (state !== "bloomed-wait" && state !== "done") return;

    const updateTime = () => {
      const startDate = new Date("2010-07-14T00:00:00");
      const now = new Date();
      const diffMs = now.getTime() - startDate.getTime();

      const seconds = Math.floor(diffMs / 1000);
      const days = Math.floor(seconds / (3600 * 24));
      const remainingSecsAfterDays = seconds % (3600 * 24);
      const hours = Math.floor(remainingSecsAfterDays / 3600);
      const remainingSecsAfterHours = remainingSecsAfterDays % 3600;
      const minutes = Math.floor(remainingSecsAfterHours / 60);
      const secs = remainingSecsAfterHours % 60;

      setTimeString(`${days} days, ${hours} hours, ${minutes} minutes, ${secs} seconds`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [state]);

  // Handle seed click to start growing the tree
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (state !== "seed") return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Scale coords to logical 1100x680 space
    const x = ((e.clientX - rect.left) / rect.width) * 1100;
    const y = ((e.clientY - rect.top) / rect.height) * 680;

    const dx = x - seedPos.current.x;
    const dy = y - seedPos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Click threshold matches original seed size
    if (dist < 50) {
      setState("seed-shrinking");
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Retina / High DPI screen scaling for crisp vector canvas drawing
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 1100 * dpr;
    canvas.height = 680 * dpr;
    ctx.scale(dpr, dpr);

    // Generate blooms matching original distribution
    const generatedBlooms: Bloom[] = [];
    const colors = [
      "rgba(255, 143, 171, 0.8)",  // Pastel pink
      "rgba(255, 105, 180, 0.85)", // Hot pink
      "rgba(255, 179, 198, 0.85)", // Light rose
      "rgba(251, 111, 146, 0.9)",  // Cherry rose
      "rgba(255, 194, 205, 0.8)",  // Peach rose
      "rgba(255, 221, 226, 0.75)", // Cream pink
    ];

    while (generatedBlooms.length < 800) {
      const x = Math.random() * (1100 - 60) + 30;
      const y = Math.random() * (450 - 30) + 30; // Canopy area
      const cx = x - 540; // Centered near main trunk
      const cy = 340 - y; // Heart canopy center
      
      if (inHeart(cx, cy, 185)) {
        generatedBlooms.push({
          p: { x, y },
          color: colors[Math.floor(Math.random() * colors.length)],
          maxScale: 0.7 + Math.random() * 0.5, // Scale matching the original 1.0 (approx 25-35px hearts)
          scale: 0.01,
          speed: 0.08 + Math.random() * 0.05, // original uses scale+=0.1 per step, here we make it smooth
          alpha: 0.65 + Math.random() * 0.35,
          angle: Math.random() * Math.PI * 2,
        });
      }
    }
    bloomsCache.current = generatedBlooms;

    // Helper to draw a heart
    const drawHeartShape = (c: CanvasRenderingContext2D, cx: number, cy: number, scale: number, color: string, alpha: number = 1, rotation: number = 0) => {
      c.save();
      c.fillStyle = color;
      c.globalAlpha = alpha;
      c.translate(cx, cy);
      c.scale(scale, scale);
      if (rotation !== 0) {
        c.rotate(rotation);
      }
      c.beginPath();
      c.moveTo(0, 0);
      for (const p of heartPoints) {
        c.lineTo(p.x, -p.y);
      }
      c.closePath();
      c.fill();
      c.restore();
    };

    let animationId: number;
    let pulseTime = 0;
    let lastTime = performance.now();

    const loop = () => {
      const now = performance.now();
      const dt = Math.min(2.0, (now - lastTime) / 16.67); // cap at 2.0 to avoid huge jumps
      lastTime = now;

      const currentState = stateRef.current;

      if (currentState === "seed") {
        ctx.clearRect(0, 0, 1100, 680);
        pulseTime += 0.05;
        pulseScale.current = 2.0 + Math.sin(pulseTime) * 0.15;

        // Draw pulsing seed heart
        drawHeartShape(ctx, seedPos.current.x, seedPos.current.y, pulseScale.current, "rgb(255, 110, 145)", 0.95);

        // Draw the text lines pointing from the heart (exactly like original drawText)
        ctx.save();
        ctx.strokeStyle = "rgba(255, 110, 145, 0.8)";
        ctx.fillStyle = "rgba(255, 110, 145, 0.9)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(seedPos.current.x, seedPos.current.y);
        ctx.lineTo(seedPos.current.x + 15, seedPos.current.y + 15);
        ctx.lineTo(seedPos.current.x + 130, seedPos.current.y + 15);
        ctx.stroke();

        ctx.font = "italic 400 13px Outfit, sans-serif";
        ctx.fillText("Click Me :)", seedPos.current.x + 30, seedPos.current.y + 8);
        ctx.fillText("Birthday Queen !", seedPos.current.x + 28, seedPos.current.y + 28);
        ctx.restore();
      } 
      else if (currentState === "seed-shrinking") {
        ctx.clearRect(0, 0, 1100, 680);
        seedScale.current *= Math.pow(0.95, dt);

        // Draw shrinking seed
        drawHeartShape(ctx, seedPos.current.x, seedPos.current.y, seedScale.current, "rgb(255, 110, 145)", 0.9);

        if (seedScale.current < 0.25) {
          setState("seed-falling");
        }
      } 
      else if (currentState === "seed-falling") {
        ctx.clearRect(0, 0, 1100, 680);
        
        // Draw growing white footer line
        if (footerLength.current < 900) {
          footerLength.current += 16 * dt;
        }
        ctx.save();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(540 - footerLength.current / 2, 660);
        ctx.lineTo(540 + footerLength.current / 2, 660);
        ctx.stroke();
        ctx.restore();

        // Move dot down
        if (seedPos.current.y < 660) {
          seedPos.current.y += 4 * dt;
        }

        // Draw falling circle
        ctx.save();
        ctx.fillStyle = "rgb(255, 110, 145)";
        ctx.beginPath();
        ctx.arc(seedPos.current.x, seedPos.current.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();

        if (seedPos.current.y >= 660) {
          // Initialize active branches
          activeBranches.current = [{
            p1: { x: branchData[0] as number, y: branchData[1] as number },
            p2: { x: branchData[2] as number, y: branchData[3] as number },
            p3: { x: branchData[4] as number, y: branchData[5] as number },
            radius: branchData[6] as number,
            length: branchData[7] as number,
            len: 0,
            childBranches: branchData[8] as any[],
          }];
          
          // Clear canvas one last time to start painting tree progressively without clear!
          ctx.clearRect(0, 0, 1100, 680);
          
          // Redraw final footer line
          ctx.save();
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 4;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(540 - 450, 660);
          ctx.lineTo(540 + 450, 660);
          ctx.stroke();
          ctx.restore();

          setState("growing");
        }
      } 
      else if (currentState === "growing") {
        // Grow branches progressively: do NOT clear canvas!
        const currentActive = [...activeBranches.current];

        currentActive.forEach((b) => {
          if (b.len <= b.length) {
            const tPrev = Math.max(0, b.len) / b.length;
            b.len += 1.2 * dt;
            const tCurr = Math.min(b.length, b.len) / b.length;
            const pPrev = bezier(b.p1, b.p2, b.p3, tPrev);
            const pCurr = bezier(b.p1, b.p2, b.p3, tCurr);

            // Draw branch line segment instead of circle dots for seamless drawing
            ctx.save();
            ctx.strokeStyle = "#FFC0CB";
            ctx.lineWidth = Math.max(1.5, b.radius * 2);
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(pPrev.x, pPrev.y);
            ctx.lineTo(pCurr.x, pCurr.y);
            ctx.stroke();
            ctx.restore();

            b.radius *= Math.pow(0.965, dt); // Original tapering factor adjusted for delta time
          } else {
            // Branch complete, spawn children
            activeBranches.current = activeBranches.current.filter((item) => item !== b);

            b.childBranches.forEach((child) => {
              activeBranches.current.push({
                p1: { x: child[0], y: child[1] },
                p2: { x: child[2], y: child[3] },
                p3: { x: child[4], y: child[5] },
                radius: child[6],
                length: child[7],
                len: 0,
                childBranches: child[8] || [],
              });
            });
          }
        });

        if (activeBranches.current.length === 0) {
          setState("blooming");
        }
      } 
      else if (currentState === "blooming") {
        // Bloom flowers progressively: do NOT clear canvas!
        // Spawn 8 new blooms per frame for a smooth, progressive blooming sequence
        const newBlooms = bloomsCache.current.splice(0, 8);
        newBlooms.forEach((nb) => activeBlooms.current.push(nb));

        // Grow active blooms
        const currentBlooms = [...activeBlooms.current];
        currentBlooms.forEach((b) => {
          drawHeartShape(ctx, b.p.x, b.p.y, b.scale, b.color, b.alpha, b.angle);
          b.scale += (b.maxScale - b.scale) * 0.14 + 0.002; // Asymptotic ease-out for organic growth transition
          
          if (b.scale >= b.maxScale) {
            // Remove from active list but keeps pixels on canvas
            activeBlooms.current = activeBlooms.current.filter((item) => item !== b);
          }
        });

        if (bloomsCache.current.length === 0 && activeBlooms.current.length === 0) {
          // Take static snapshot of fully grown tree
          const offscreen = document.createElement("canvas");
          offscreen.width = 1100 * dpr;
          offscreen.height = 680 * dpr;
          const offscreenCtx = offscreen.getContext("2d");
          if (offscreenCtx) {
            offscreenCtx.drawImage(canvas, 0, 0);
            offscreenCanvasRef.current = offscreen;
          }
          
          setState("bloomed-wait");
          
          // Wait 1 second before starting falling leaves and parent wishes popup
          setTimeout(() => {
            setState("done");
            onBloomComplete();
          }, 1000);
        }
      } 
      else if (currentState === "bloomed-wait") {
        ctx.clearRect(0, 0, 1100, 680);
        if (offscreenCanvasRef.current) {
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.drawImage(offscreenCanvasRef.current, 0, 0);
          ctx.restore();
        }
      } 
      else if (currentState === "done") {
        // Clean frame draw loop using offscreen snapshot + falling leaves
        ctx.clearRect(0, 0, 1100, 680);
        
        if (offscreenCanvasRef.current) {
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.drawImage(offscreenCanvasRef.current, 0, 0);
          ctx.restore();
        }

        // Spawn falling leaves
        if (Math.random() < 0.12 && fallingHearts.current.length < 50) {
          // Find a random bloom position (can canopy area)
          const spawnX = Math.random() * (1100 - 100) + 50;
          const spawnY = Math.random() * (400 - 100) + 100;
          
          const leafColors = [
            "rgba(255, 143, 171, 0.85)", // Pink
            "rgba(251, 111, 146, 0.8)",  // Darker rose
            "rgba(255, 230, 235, 0.8)",  // White pink
            "rgba(255, 215, 0, 0.65)",   // Golden sparkle
          ];

          fallingHearts.current.push({
            x: spawnX,
            y: spawnY,
            size: 0.4 + Math.random() * 0.4, // larger falling hearts for visual clarity
            speedY: 1.2 + Math.random() * 1.5,
            speedX: (Math.random() - 0.5) * 1.2,
            rotation: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.03,
            alpha: 0.7 + Math.random() * 0.3,
            color: leafColors[Math.floor(Math.random() * leafColors.length)],
          });
        }

        // Render falling leaves
        fallingHearts.current.forEach((fh, idx) => {
          fh.y += fh.speedY * dt;
          fh.x += (fh.speedX + Math.sin(fh.y / 25) * 0.6) * dt;
          fh.rotation += fh.spin * dt;
          
          if (fh.y > 600) {
            fh.alpha -= 0.025 * dt;
          }

          drawHeartShape(ctx, fh.x, fh.y, fh.size, fh.color, Math.max(0, fh.alpha), fh.rotation);

          if (fh.y > 675 || fh.alpha <= 0) {
            fallingHearts.current.splice(idx, 1);
          }
        });
      }

      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [onBloomComplete]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-[520px] max-w-2xl mx-auto overflow-hidden rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm shadow-[var(--shadow-glass)]">
      {/* Time Elapsed Counter Overlay at the bottom */}
      <AnimatePresence>
        {(state === "bloomed-wait" || state === "done") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-6 inset-x-6 z-20 flex flex-col items-center justify-center pointer-events-none text-center"
          >
            <div className="glass rounded-2xl px-6 py-4 shadow-[var(--shadow-glass)] border border-white/10 max-w-md w-full backdrop-blur-md">
              <span className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground block mb-1">
                Since 14 July 2010
              </span>
              <span className="font-serif text-sm md:text-base font-medium text-foreground tracking-wide tabular-nums">
                {timeString}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <canvas
        ref={canvasRef}
        width="1100"
        height="680"
        onClick={handleCanvasClick}
        className={`w-full h-full object-contain max-h-[460px] ${
          state === "seed" ? "cursor-pointer" : "cursor-default"
        }`}
      />
    </div>
  );
}
