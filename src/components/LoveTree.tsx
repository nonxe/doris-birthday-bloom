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

// Branch data structure matching original project
const branchData = [
  535, 680, 570, 250, 500, 200, 30, 80, [
    [540, 500, 455, 417, 340, 400, 13, 80, [
      [450, 435, 434, 430, 394, 395, 2, 40]
    ]],
    [550, 445, 600, 356, 680, 345, 12, 80, [
      [578, 400, 648, 409, 661, 426, 3, 60]
    ]],
    [539, 281, 537, 248, 534, 217, 3, 40],
    [546, 397, 413, 247, 328, 244, 9, 80, [
      [427, 286, 383, 253, 371, 205, 2, 40],
      [498, 345, 435, 315, 395, 330, 4, 50]
    ]],
    [546, 357, 608, 252, 678, 221, 6, 80, [
      [590, 293, 646, 277, 648, 271, 2, 60]
    ]]
  ]
];

interface Branch {
  p1: Point;
  p2: Point;
  p3: Point;
  startRadius: number;
  currentRadius: number;
  length: number;
  len: number;
  childBranches: any[];
  points: Point[]; // Captured points for rendering later
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
  const [state, setState] = useState<"seed" | "seed-falling" | "growing" | "blooming" | "done">("seed");
  const stateRef = useRef(state);
  
  // Seed position and properties
  const seedPos = useRef({ x: 550, y: 300 });
  const seedScale = useRef(1.8);
  const seedAlpha = useRef(1.0);
  const pulseScale = useRef(1.0);

  // Lists of elements
  const activeBranches = useRef<Branch[]>([]);
  const completedBranches = useRef<Branch[]>([]);
  const blooms = useRef<Bloom[]>([]);
  const activeBloomsCount = useRef(0);
  const fallingHearts = useRef<FallingHeart[]>([]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Handle seed click to start growing the tree
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (state !== "seed") return;

    // Check if click is near the seed
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Scale coords to logical 1100x680 space
    const x = ((e.clientX - rect.left) / rect.width) * 1100;
    const y = ((e.clientY - rect.top) / rect.height) * 680;

    const dx = x - seedPos.current.x;
    const dy = y - seedPos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 40) {
      setState("seed-falling");
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Initialize blooms in a heart boundary
    const generatedBlooms: Bloom[] = [];
    const colors = [
      "rgba(255, 143, 171, 0.8)",  // Pastel pink
      "rgba(255, 105, 180, 0.85)", // Hot pink
      "rgba(255, 179, 198, 0.85)", // Light rose
      "rgba(251, 111, 146, 0.9)",  // Cherry rose
      "rgba(255, 194, 205, 0.8)",  // Peach rose
      "rgba(255, 221, 226, 0.75)", // Cream pink
    ];

    while (generatedBlooms.length < 320) {
      const x = Math.random() * (1100 - 60) + 30;
      const y = Math.random() * (450 - 30) + 30; // Bloomed area focuses top
      const cx = x - 540; // Tree trunk is centered near 540
      const cy = 340 - y; // Center of heart canopy is near y=340
      
      if (inHeart(cx, cy, 190)) {
        generatedBlooms.push({
          p: { x, y },
          color: colors[Math.floor(Math.random() * colors.length)],
          maxScale: 0.12 + Math.random() * 0.18,
          scale: 0.01,
          speed: 0.006 + Math.random() * 0.008,
          alpha: 0.65 + Math.random() * 0.35,
          angle: Math.random() * Math.PI * 2,
        });
      }
    }
    blooms.current = generatedBlooms;

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

    const loop = () => {
      ctx.clearRect(0, 0, 1100, 680);
      const currentState = stateRef.current;

      // Draw soil / root background footer line
      ctx.save();
      const lineGrad = ctx.createLinearGradient(100, 660, 1000, 660);
      lineGrad.addColorStop(0, "rgba(255, 182, 193, 0)");
      lineGrad.addColorStop(0.5, "rgba(255, 143, 171, 0.4)");
      lineGrad.addColorStop(1, "rgba(255, 182, 193, 0)");
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(150, 660);
      ctx.lineTo(950, 660);
      ctx.stroke();
      ctx.restore();

      // State machine logic
      if (currentState === "seed") {
        // Pulse animation for the heart
        pulseTime += 0.05;
        pulseScale.current = 1.8 + Math.sin(pulseTime) * 0.12;

        // Glow behind seed
        ctx.save();
        const grad = ctx.createRadialGradient(
          seedPos.current.x, seedPos.current.y, 0,
          seedPos.current.x, seedPos.current.y, 70
        );
        grad.addColorStop(0, "rgba(255, 143, 171, 0.25)");
        grad.addColorStop(1, "rgba(255, 143, 171, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(seedPos.current.x, seedPos.current.y, 70, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();

        // Draw pulsing heart
        drawHeartShape(ctx, seedPos.current.x, seedPos.current.y, pulseScale.current, "rgb(255, 110, 145)", 0.95);

        // Draw seed helper texts
        ctx.save();
        ctx.fillStyle = "rgba(255, 143, 171, 0.85)";
        ctx.font = "italic 300 14px Outfit, Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Click the heart to bloom", seedPos.current.x, seedPos.current.y + 40);
        ctx.restore();
      } 
      else if (currentState === "seed-falling") {
        // Animate heart moving down and shrinking
        let targetReached = true;
        if (seedPos.current.y < 650) {
          seedPos.current.y += 8;
          targetReached = false;
        }
        if (seedScale.current > 0.4) {
          seedScale.current -= 0.05;
          targetReached = false;
        }
        if (seedAlpha.current > 0) {
          seedAlpha.current -= 0.035;
        }

        drawHeartShape(ctx, seedPos.current.x, seedPos.current.y, Math.max(0.2, seedScale.current), "rgb(255, 110, 145)", Math.max(0, seedAlpha.current));

        if (targetReached) {
          // Initialize active branches with trunk
          activeBranches.current = [new class {
            p1 = { x: branchData[0] as number, y: branchData[1] as number };
            p2 = { x: branchData[2] as number, y: branchData[3] as number };
            p3 = { x: branchData[4] as number, y: branchData[5] as number };
            startRadius = branchData[6] as number;
            currentRadius = branchData[6] as number;
            length = branchData[7] as number;
            len = 0;
            childBranches = branchData[8] as any[];
            points: Point[] = [];
          }];
          setState("growing");
        }
      }

      // 2. Draw completed tree branches
      ctx.save();
      ctx.fillStyle = "oklch(0.72 0.14 10)"; // Match pink gradient theme
      completedBranches.current.forEach((b) => {
        b.points.forEach((p, idx) => {
          ctx.beginPath();
          // Fade branch radius along its path
          const rad = b.startRadius * Math.pow(0.975, idx);
          ctx.arc(p.x, p.y, Math.max(1, rad), 0, 2 * Math.PI);
          ctx.fill();
        });
      });
      ctx.restore();

      // 3. Grow active branches
      if (currentState === "growing") {
        let branchGrowing = false;
        const currentActive = [...activeBranches.current];

        currentActive.forEach((b) => {
          if (b.len <= b.length) {
            branchGrowing = true;
            const t = b.len / b.length;
            const p = bezier(b.p1, b.p2, b.p3, t);
            b.points.push(p);

            // Draw this frame segment
            ctx.save();
            ctx.fillStyle = "oklch(0.72 0.14 10)";
            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(1, b.currentRadius), 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();

            b.len += 1.5; // Controls growing speed
            b.currentRadius *= 0.978;
          } else {
            // Branch complete, spawn children
            completedBranches.current.push(b);
            activeBranches.current = activeBranches.current.filter((item) => item !== b);

            b.childBranches.forEach((child) => {
              activeBranches.current.push({
                p1: { x: child[0], y: child[1] },
                p2: { x: child[2], y: child[3] },
                p3: { x: child[4], y: child[5] },
                startRadius: child[6],
                currentRadius: child[6],
                length: child[7],
                len: 0,
                childBranches: child[8] || [],
                points: [],
              });
            });
          }
        });

        if (!branchGrowing && activeBranches.current.length === 0) {
          setState("blooming");
        }
      }

      // 4. Draw & animate blooms
      if (currentState === "blooming" || currentState === "done") {
        let bloomingInProgress = false;
        
        blooms.current.forEach((b, idx) => {
          // Stagger the blooming of flowers
          if (currentState === "blooming" && idx < activeBloomsCount.current) {
            if (b.scale < b.maxScale) {
              b.scale += b.speed;
              bloomingInProgress = true;
            }
          }

          drawHeartShape(ctx, b.p.x, b.p.y, b.scale, b.color, b.alpha, b.angle);
        });

        if (currentState === "blooming") {
          // Incrementally unlock more blooms for staggered effect
          if (activeBloomsCount.current < blooms.current.length) {
            activeBloomsCount.current += 3;
          }
          if (!bloomingInProgress && activeBloomsCount.current >= blooms.current.length) {
            setState("done");
            onBloomComplete();
          }
        }
      }

      // 5. Falling leaf/heart animation
      if (currentState === "done") {
        // Spawn falling leaves/hearts from the bloomed tree randomly
        if (Math.random() < 0.12 && fallingHearts.current.length < 40) {
          // Select a random bloom as spawn point
          const sourceBloom = blooms.current[Math.floor(Math.random() * blooms.current.length)];
          const leafColors = [
            "rgba(255, 143, 171, 0.8)",  // Pink heart
            "rgba(251, 111, 146, 0.75)", // Darker rose heart
            "rgba(255, 230, 235, 0.8)",  // Very pale leaf pink
            "rgba(255, 215, 0, 0.6)",    // Golden leaf particle
          ];

          fallingHearts.current.push({
            x: sourceBloom.p.x,
            y: sourceBloom.p.y,
            size: 0.04 + Math.random() * 0.08,
            speedY: 1.0 + Math.random() * 1.5,
            speedX: (Math.random() - 0.5) * 1.2,
            rotation: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.04,
            alpha: 0.6 + Math.random() * 0.4,
            color: leafColors[Math.floor(Math.random() * leafColors.length)],
          });
        }

        // Draw and update falling hearts
        fallingHearts.current.forEach((fh, idx) => {
          fh.y += fh.speedY;
          fh.x += fh.speedX + Math.sin(fh.y / 20) * 0.5; // Wind wave drift
          fh.rotation += fh.spin;
          
          // Fade out near floor
          if (fh.y > 600) {
            fh.alpha -= 0.02;
          }

          drawHeartShape(ctx, fh.x, fh.y, fh.size, fh.color, Math.max(0, fh.alpha), fh.rotation);

          // Clean up off-screen/faded particles
          if (fh.y > 670 || fh.alpha <= 0) {
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
