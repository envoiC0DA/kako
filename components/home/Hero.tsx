"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const BACK_COLORS = ["#ede0da", "#e8d8d2", "#f0e5e0"];
const FRONT_COLORS = ["#f5eae6", "#f2e2de", "#faf0ee"];

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rot: number;
  rotS: number;
  opacity: number;
  sway: number;
  swayO: number;
  swayS: number;
  colors: string[];
  color: string;
  active: boolean;
  delay: number;
}

function makePetal(layer: "back" | "front", W: number): Petal {
  const isBack = layer === "back";
  return {
    x: Math.random() * W,
    y: -20 - Math.random() * 60,
    size: isBack ? 2.5 + Math.random() * 2.5 : 4 + Math.random() * 4,
    speedX: -0.15 + Math.random() * 0.3,
    speedY: isBack ? 0.35 + Math.random() * 0.5 : 0.55 + Math.random() * 0.7,
    rot: Math.random() * Math.PI * 2,
    rotS: -0.012 + Math.random() * 0.024,
    opacity: isBack ? 0.18 + Math.random() * 0.28 : 0.45 + Math.random() * 0.4,
    sway: 0.15 + Math.random() * 0.4,
    swayO: Math.random() * Math.PI * 2,
    swayS: 0.005 + Math.random() * 0.01,
    colors: isBack ? BACK_COLORS : FRONT_COLORS,
    color: "",
    active: false,
    delay: 800 + Math.random() * 4000,
  };
}

function resetPetal(p: Petal, W: number) {
  const layer = p.colors === BACK_COLORS ? "back" : "front";
  const fresh = makePetal(layer, W);
  fresh.active = false;
  fresh.delay = 1200 + Math.random() * 5000;
  Object.assign(p, fresh);
}

function drawPetal(ctx: CanvasRenderingContext2D, p: Petal) {
  if (!p.active) return;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.globalAlpha = p.opacity;
  ctx.beginPath();
  ctx.moveTo(0, -p.size);
  ctx.bezierCurveTo(p.size * 0.5, -p.size * 0.5, p.size * 0.5, p.size * 0.22, 0, p.size * 0.4);
  ctx.bezierCurveTo(-p.size * 0.5, p.size * 0.22, -p.size * 0.5, -p.size * 0.5, 0, -p.size);
  ctx.fillStyle = p.color;
  ctx.fill();
  ctx.restore();
}

export default function Hero() {
  const backRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const scrolled = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const onScroll = () => { scrolled.current = true; };
    window.addEventListener("scroll", onScroll, { once: true });
    const fallback = setTimeout(() => { scrolled.current = true; }, 2000);

    const back = backRef.current;
    const front = frontRef.current;
    const hero = heroRef.current;
    if (!back || !front || !hero) return;

    const W = hero.offsetWidth;
    const H = hero.offsetHeight;
    back.width = front.width = W;
    back.height = front.height = H;

    const bCtx = back.getContext("2d")!;
    const fCtx = front.getContext("2d")!;

    const backPetals: Petal[] = Array.from({ length: 3 }, () => makePetal("back", W));
    const frontPetals: Petal[] = Array.from({ length: 2 }, () => makePetal("front", W));

    let startTime: number | null = null;
    let raf: number;

    function tick(ts: number) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;

      bCtx.clearRect(0, 0, W, H);
      fCtx.clearRect(0, 0, W, H);

      for (const p of [...backPetals, ...frontPetals]) {
        if (!p.active) {
          if (scrolled.current && elapsed > p.delay) {
            p.active = true;
            p.color = p.colors[Math.floor(Math.random() * p.colors.length)];
          }
          continue;
        }
        p.swayO += p.swayS;
        p.x += p.speedX + Math.sin(p.swayO) * p.sway;
        p.y += p.speedY;
        p.rot += p.rotS;
        if (p.y > H + 20) resetPetal(p, W);
      }

      for (const p of backPetals) drawPetal(bCtx, p);
      for (const p of frontPetals) drawPetal(fCtx, p);

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen overflow-hidden flex items-center justify-center"
      style={{ background: "#F5F2ED" }}
    >
      {/* 背景渐变 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, #f5ece8 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 60% 30%, #eef0f5 0%, transparent 60%)",
        }}
      />

      {/* 后景樱花 */}
      <canvas ref={backRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }} />

      {/* 文案 */}
      <div
        className="relative flex flex-col items-center text-center"
        style={{ zIndex: 10 }}
      >
        <span
          style={{
            fontFamily: "var(--font-noto)",
            fontWeight: 200,
            fontSize: "10px",
            letterSpacing: "0.55em",
            color: "#b0a099",
            marginBottom: "28px",
          }}
        >
          cosplay photography
        </span>

        <h1
          style={{
            fontFamily: "var(--font-cormorant)",
            fontWeight: 300,
            fontSize: "clamp(56px, 8vw, 82px)",
            color: "#2F2F2F",
            letterSpacing: "0.14em",
            lineHeight: 1,
            marginBottom: "10px",
          }}
        >
          Kako
        </h1>

        <span
          style={{
            fontFamily: "var(--font-noto)",
            fontWeight: 200,
            fontSize: "13px",
            color: "#a09099",
            letterSpacing: "0.5em",
            marginBottom: "40px",
          }}
        >
          君と光
        </span>

        <p
          style={{
            fontFamily: "var(--font-cormorant)",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "18px",
            color: "#2F2F2F",
            letterSpacing: "0.06em",
            marginBottom: "10px",
          }}
        >
          A Quiet Kind of Magic
        </p>

        <p
          style={{
            fontFamily: "var(--font-noto)",
            fontWeight: 200,
            fontSize: "11px",
            color: "#7a706c",
            letterSpacing: "0.18em",
            lineHeight: 1.9,
            marginBottom: "44px",
          }}
        >
          Moments where characters softly come to life.
        </p>

        <Link
          href="/booking"
          className="group inline-flex items-center gap-3"
          style={{
            fontFamily: "var(--font-noto)",
            fontSize: "10px",
            fontWeight: 200,
            letterSpacing: "0.4em",
            color: "#2F2F2F",
            borderBottom: "0.5px solid rgba(47,47,47,0.35)",
            paddingBottom: "6px",
            textDecoration: "none",
            transition: "all 0.4s ease",
          }}
        >
          Book a Session
          <span
            style={{
              opacity: 0.5,
              transition: "transform 0.4s ease",
              display: "inline-block",
            }}
            className="group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>

      {/* 前景樱花 */}
      <canvas ref={frontRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 12 }} />

      {/* 底部渐变遮罩 */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "160px",
          zIndex: 8,
          background: "linear-gradient(to top, rgba(245,242,237,0.95) 0%, transparent 100%)",
        }}
      />

      {/* scroll 提示 */}
      {mounted && (
        <div
          className="absolute flex items-center gap-3"
          style={{
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 15,
            animation: "breathe 3s ease-in-out infinite",
          }}
        >
          <div style={{ width: "28px", height: "0.5px", background: "#c0b0a8" }} />
          <span
            style={{
              fontFamily: "var(--font-noto)",
              fontSize: "9px",
              fontWeight: 200,
              letterSpacing: "0.4em",
              color: "#b0a099",
            }}
          >
            scroll
          </span>
          <div style={{ width: "28px", height: "0.5px", background: "#c0b0a8" }} />
        </div>
      )}

      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.65; }
        }
      `}</style>
    </section>
  );
}