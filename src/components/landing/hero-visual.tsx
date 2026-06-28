import { useEffect, useRef } from "react";
import { GraduationCap, Play, Sparkles, Clock } from "lucide-react";

/**
 * HeroVisual — the interactive 3D centrepiece of the landing hero.
 *
 * Two layers, both client-only and SSR-safe (every browser API is touched
 * exclusively inside useEffect — never at module or render scope, so the
 * server render is a plain, inert <div>):
 *
 *  1. A DPR-aware <canvas> "constellation" particle field with depth parallax
 *     that gently reacts to the pointer.
 *  2. A pure CSS-3D scene (spinning glass cube, orbiting rings, glowing orbs
 *     and floating glass course chips) that tilts with the pointer.
 *
 * No external libraries — npm + third-party CDNs are both unavailable, and the
 * app ships a strict CSP (`script-src 'self'`). Everything here is hand-rolled
 * and bundled from source, so it is fully CSP-compliant. Honours
 * `prefers-reduced-motion`.
 */
export function HeroVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* ---- Pointer parallax: write --mx / --my (range -1..1) on the root ---- */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
    };

    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      root.style.setProperty("--mx", cx.toFixed(4));
      root.style.setProperty("--my", cy.toFixed(4));
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  /* ---------------------- Canvas constellation field --------------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const palette = [
      [120, 224, 232], // cyan accent
      [88, 168, 240], // ocean blue
      [150, 240, 210], // mint
      [200, 232, 255], // pale sky
    ];

    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      z: number; // depth 0..1
      r: number;
      c: number[];
    };

    let w = 0;
    let h = 0;
    let dpr = 1;
    let particles: P[] = [];
    let raf = 0;
    let mx = 0;
    let my = 0;

    const build = () => {
      const rect = root.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(Math.min(110, Math.max(40, (w * h) / 13000)));
      particles = Array.from({ length: count }, () => {
        const z = Math.random();
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * (0.18 + z * 0.35),
          vy: (Math.random() - 0.5) * (0.18 + z * 0.35),
          z,
          r: 0.6 + z * 2.2,
          c: palette[(Math.random() * palette.length) | 0],
        };
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const px = mx * 26;
      const py = my * 26;

      // links
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        const ax = a.x + px * a.z;
        const ay = a.y + py * a.z;
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const bx = b.x + px * b.z;
          const by = b.y + py * b.z;
          const dx = ax - bx;
          const dy = ay - by;
          const d2 = dx * dx + dy * dy;
          if (d2 < 132 * 132) {
            const o = (1 - d2 / (132 * 132)) * 0.22 * Math.min(a.z, b.z) + 0.02;
            ctx.strokeStyle = `rgba(120,210,235,${o})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        }
      }

      // dots
      for (const p of particles) {
        const x = p.x + px * p.z;
        const y = p.y + py * p.z;
        const glow = 0.35 + p.z * 0.5;
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${glow})`;
        ctx.shadowColor = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},0.9)`;
        ctx.shadowBlur = 6 + p.z * 10;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    const step = () => {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }
      // ease parallax toward the root's pointer vars
      const tmx = parseFloat(root.style.getPropertyValue("--mx") || "0");
      const tmy = parseFloat(root.style.getPropertyValue("--my") || "0");
      mx += (tmx - mx) * 0.08;
      my += (tmy - my) * 0.08;
      draw();
      raf = requestAnimationFrame(step);
    };

    build();
    if (reduce) {
      draw();
    } else {
      raf = requestAnimationFrame(step);
    }

    const ro = new ResizeObserver(() => build());
    ro.observe(root);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={rootRef} className="landing-hero-visual" aria-hidden="true">
      {/* particle constellation */}
      <canvas ref={canvasRef} className="landing-particles" />

      {/* soft colour orbs */}
      <span className="hv-orb hv-orb-1" />
      <span className="hv-orb hv-orb-2" />
      <span className="hv-orb hv-orb-3" />

      {/* CSS-3D scene */}
      <div className="hv-stage">
        <div className="hv-scene">
          {/* orbiting rings */}
          <div className="hv-ring hv-ring-1" />
          <div className="hv-ring hv-ring-2" />
          <div className="hv-ring hv-ring-3" />

          {/* spinning glass cube */}
          <div className="hv-cube">
            <span className="hv-face hv-face-front">
              <Play className="hv-face-icon" />
            </span>
            <span className="hv-face hv-face-back" />
            <span className="hv-face hv-face-right" />
            <span className="hv-face hv-face-left" />
            <span className="hv-face hv-face-top">
              <GraduationCap className="hv-face-icon" />
            </span>
            <span className="hv-face hv-face-bottom" />
          </div>

          {/* floating glass chips */}
          <div className="hv-chip hv-chip-1">
            <GraduationCap className="hv-chip-icon" />
            <div>
              <div className="hv-chip-title">500+ video dars</div>
              <div className="hv-chip-sub">HD sifatda</div>
            </div>
          </div>

          <div className="hv-chip hv-chip-2">
            <Clock className="hv-chip-icon hv-chip-icon-mint" />
            <div>
              <div className="hv-chip-title">7 kun bepul</div>
              <div className="hv-chip-sub">Karta shart emas</div>
            </div>
          </div>

          <div className="hv-chip hv-chip-3">
            <Sparkles className="hv-chip-icon hv-chip-icon-blue" />
            <div>
              <div className="hv-chip-title">Bitta tarif</div>
              <div className="hv-chip-sub">Barcha kurslar</div>
            </div>
          </div>

          {/* small glowing satellites */}
          <span className="hv-dot hv-dot-1" />
          <span className="hv-dot hv-dot-2" />
        </div>
      </div>
    </div>
  );
}

export default HeroVisual;
