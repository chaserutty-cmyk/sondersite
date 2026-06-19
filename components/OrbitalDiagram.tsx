"use client";

import { useEffect, useRef } from "react";
import { gsap, ensureGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * OrbitalDiagram (SVG)
 *
 * Two tilted ellipses that continuously spin in opposite directions after their
 * entrance line-draw completes. Gold nodes and labels are nested inside each
 * orbit group so they orbit with their ellipse.
 *
 * Coordinate note: node cx/cy are expressed in the orbit group's LOCAL space
 * (before the static tilt rotation). Derive from parametric ellipse:
 *   x_local = cx + rx·cos(t)
 *   y_local = cy + ry·sin(t)
 *
 * Orbit 0 (rx=340, ry=108, tilt −14°):
 *   315° → (600, 284)  01 TRUST
 *   225° → (120, 284)  02 PULL
 *
 * Orbit 1 (rx=380, ry=78, tilt +24°):
 *   315° → (629, 305)  03 PERCEPTION
 *    90° → (360, 438)  04 MOMENTUM
 */

type OrbitalDiagramProps = {
  className?: string;
  width?: number;
  height?: number;
  animate?: boolean;
};

type NodePoint = {
  cx: number;
  cy: number;
  r: number;
  tone: "gold" | "ink";
  num?: string;
  label?: string;
  anchor?: "start" | "middle" | "end";
  labelDx?: number;
  labelDy?: number;
  orbitIdx: number;
};

export default function OrbitalDiagram({
  className = "",
  width = 720,
  height = 720,
  animate = true,
}: OrbitalDiagramProps) {
  const ref = useRef<SVGSVGElement | null>(null);

  const cx = width / 2;
  const cy = height / 2;

  const orbits = [
    { rx: 340, ry: 108, rotate: -14, dashed: false, opacity: 0.65 },
    { rx: 380, ry: 78,  rotate: 24,  dashed: true,  opacity: 0.55 },
  ];

  const nodes: NodePoint[] = [
    {
      cx: 600, cy: 284, r: 4.5, tone: "gold",
      num: "01", label: "TRUST",
      anchor: "start", labelDx: 12, labelDy: -2,
      orbitIdx: 0,
    },
    {
      cx: 120, cy: 284, r: 4.5, tone: "gold",
      num: "02", label: "PULL",
      anchor: "start", labelDx: 12, labelDy: 4,
      orbitIdx: 0,
    },
    {
      cx: 629, cy: 305, r: 4.5, tone: "gold",
      num: "03", label: "PERCEPTION",
      anchor: "start", labelDx: 12, labelDy: -2,
      orbitIdx: 1,
    },
    {
      cx: 360, cy: 438, r: 4.5, tone: "gold",
      num: "04", label: "MOMENTUM",
      anchor: "middle", labelDx: 0, labelDy: 18,
      orbitIdx: 1,
    },
  ];

  useEffect(() => {
    if (!animate || !ref.current) return;
    ensureGsap();
    const svg = ref.current;
    const ellipses = svg.querySelectorAll<SVGEllipseElement>("ellipse.orbit");
    const dots    = svg.querySelectorAll<SVGCircleElement>("circle.node");
    const spinGroups = svg.querySelectorAll<SVGGElement>("g.orbit-spin");

    if (prefersReducedMotion()) {
      ellipses.forEach((e) => {
        e.style.strokeDasharray = "";
        e.style.strokeDashoffset = "0";
      });
      gsap.set(dots, { autoAlpha: 1 });
      return;
    }

    ellipses.forEach((e) => {
      const len = e.getTotalLength();
      const isDashed = e.dataset.dashed === "1";
      if (isDashed) {
        e.style.strokeDasharray = "3 8";
        e.style.strokeDashoffset = `${len}`;
      } else {
        e.style.strokeDasharray = `${len}`;
        e.style.strokeDashoffset = `${len}`;
      }
    });

    gsap.set(dots, { autoAlpha: 0, scale: 0.4, transformOrigin: "center" });

    const spinTweens: gsap.core.Tween[] = [];

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => {
        // Start permanent, slow counter-rotating spins on each orbit group
        spinGroups.forEach((g, i) => {
          const tween = gsap.to(g, {
            rotation: i % 2 === 0 ? 360 : -360,
            svgOrigin: `${cx} ${cy}`,
            duration: i === 0 ? 90 : 120,
            ease: "none",
            repeat: -1,
          });
          spinTweens.push(tween);
        });
      },
    });

    tl.to(ellipses, {
      strokeDashoffset: 0,
      duration: 1.4,
      stagger: 0.12,
    }).to(
      dots,
      { autoAlpha: 1, scale: 1, duration: 0.6, stagger: 0.05 },
      "-=0.6"
    );

    return () => {
      tl.kill();
      spinTweens.forEach((t) => t.kill());
    };
  }, [width, height, animate, cx, cy]);

  return (
    <svg
      ref={ref}
      className={className}
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <radialGradient id="orbital-gold-node">
          <stop offset="0%"   stopColor="#E2C281" />
          <stop offset="45%"  stopColor="#B89154" />
          <stop offset="100%" stopColor="#6F5528" />
        </radialGradient>
      </defs>

      {orbits.map((o, i) => (
        /* Outer group: GSAP spins this continuously around the SVG center */
        <g key={i} className="orbit-spin">
          {/* Inner group: preserves the static editorial tilt of each ellipse */}
          <g transform={`rotate(${o.rotate} ${cx} ${cy})`}>
            <ellipse
              className="orbit"
              data-dashed={o.dashed ? "1" : "0"}
              cx={cx}
              cy={cy}
              rx={o.rx}
              ry={o.ry}
              fill="none"
              stroke="var(--ink)"
              strokeWidth={o.dashed ? "0.6" : "0.9"}
              opacity={o.opacity}
              strokeLinecap="round"
              strokeDasharray={o.dashed ? "3 8" : undefined}
            />

            {nodes
              .filter((n) => n.orbitIdx === i)
              .map((n, j) => (
                <g key={j}>
                  <circle
                    className="node"
                    cx={n.cx}
                    cy={n.cy}
                    r={n.r}
                    fill={n.tone === "gold" ? "url(#orbital-gold-node)" : "var(--ink)"}
                    opacity={n.tone === "ink" ? 1.0 : undefined}
                  />
                  {n.num && n.label && (
                    <text
                      x={n.cx + (n.labelDx ?? 12)}
                      y={n.cy + (n.labelDy ?? 0)}
                      textAnchor={n.anchor ?? "start"}
                      fontFamily="var(--font-mono), monospace"
                      fontSize="8"
                      letterSpacing="1.4"
                      opacity={0.42}
                    >
                      <tspan fill="var(--gold)" fontWeight="500">{n.num} </tspan>
                      <tspan fill="var(--muted-ink)">{n.label}</tspan>
                    </text>
                  )}
                </g>
              ))}
          </g>
        </g>
      ))}

      {/* Faint crosshair at center — stays fixed */}
      <g
        transform={`translate(${cx} ${cy})`}
        stroke="var(--hairline)"
        strokeWidth="0.5"
        opacity={0.5}
      >
        <line x1="-8" y1="0" x2="8" y2="0" />
        <line x1="0" y1="-8" x2="0" y2="8" />
      </g>
    </svg>
  );
}
