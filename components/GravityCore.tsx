"use client";

import { useRef, useEffect } from "react";

/**
 * GravityCore — pure 2D SVG
 *
 * Previous implementation used React Three Fiber / Three.js (WebGL). That
 * approach caused the MacBook Air to freeze on every page load due to the
 * combined weight of:
 *   - 43 MB of Three.js + R3F in the compilation graph
 *   - WebGL context creation during hydration
 *   - Shader compilation competing with GSAP + font loading
 *
 * This version achieves the same visual (faceted icosahedron wireframe with
 * low-opacity ivory faces, gold edge cage, gold vertex dots) using:
 *   - Pre-computed 2D orthographic projection — no runtime geometry math
 *   - SVG polygons, lines, and circles — zero GPU cost
 *   - CSS perspective + rotateX/Y on mousemove — smooth parallax, no RAF
 *
 * All geometry is computed at module load time (pure math, no side effects).
 * The component itself only manages the mousemove listener.
 */

// ─── Icosahedron Geometry (module-level, computed once) ──────────────────────

const PHI = (1 + Math.sqrt(5)) / 2;

// 12 vertices of a regular icosahedron with circumradius √(1+φ²) ≈ 1.902
const V: [number, number, number][] = [
  [0, 1, PHI],  [0, -1, PHI],  [0, 1, -PHI], [0, -1, -PHI],
  [1, PHI, 0],  [-1, PHI, 0],  [1, -PHI, 0], [-1, -PHI, 0],
  [PHI, 0, 1],  [-PHI, 0, 1],  [PHI, 0, -1], [-PHI, 0, -1],
];

// 20 triangular faces — all wound consistently (CCW from outside)
const FACES: [number, number, number][] = [
  [0, 1, 8],  [0, 8, 4],  [0, 4, 5],  [0, 5, 9],  [0, 9, 1],
  [1, 8, 6],  [8, 4, 10], [4, 5, 2],  [5, 9, 11], [9, 1, 7],
  [1, 6, 7],  [8, 6, 10], [4, 10, 2], [5, 2, 11], [9, 11, 7],
  [3, 6, 10], [3, 10, 2], [3, 2, 11], [3, 11, 7], [3, 7, 6],
];

// Apply rotation matrix: first around X, then around Y
function rotXY(
  [x, y, z]: [number, number, number],
  rx: number,
  ry: number,
): [number, number, number] {
  const cx = Math.cos(rx), sx = Math.sin(rx);
  const y1 = y * cx - z * sx;
  const z1 = y * sx + z * cx;
  const cy = Math.cos(ry), sy = Math.sin(ry);
  return [x * cy + z1 * sy, y1, -x * sy + z1 * cy];
}

// Initial viewing angle: slightly above and to the right
const INIT_RX = (-18 * Math.PI) / 180;
const INIT_RY = (22 * Math.PI) / 180;

// Orthographic projection constants (viewBox: 0 0 240 240)
const SCALE = 52;
const CX = 120;
const CY = 120;

// Rotated 3D coordinates
const ROT = V.map((v) => rotXY(v, INIT_RX, INIT_RY));

// Projected screen coordinates + preserved Z for depth sorting
const P: [number, number, number][] = ROT.map(([x, y, z]) => [
  x * SCALE + CX,
  -y * SCALE + CY, // Y flip for SVG
  z,
]);

// 4-stop fill ramp: top-most faces near-white cream, bottom-most warm ochre.
// Mapped from t = 0 (bottom) to t = 1 (top) using the face's average rotated Y.
function pickFaceColor(t: number): string {
  if (t > 0.75) return "#EFE6D2"; // near-white cream
  if (t > 0.5) return "#D9C9A8";  // light cream
  if (t > 0.25) return "#B69E78"; // warm beige
  return "#8A7550";               // deep ochre
}

// Faces sorted back-to-front; visibility by average Z of 3D rotated vertices.
// Per-face fill brightness derived from average rotated Y (lit-from-above).
// `render` flag selects only front-facing AND upward-facing facets so the
// cage breathes through open negative space instead of reading as a solid rock.
const sortedFaces = [...FACES]
  .map(([a, b, c]) => {
    const avgY = (ROT[a][1] + ROT[b][1] + ROT[c][1]) / 3; // ~-1.9 .. +1.9
    const avgZ = (ROT[a][2] + ROT[b][2] + ROT[c][2]) / 3;
    const t = Math.max(0, Math.min(1, (avgY + 1.9) / 3.8));
    return {
      a,
      b,
      c,
      z: avgZ,
      fill: pickFaceColor(t),
      render: avgZ > 0 && avgY > 0,
    };
  })
  .sort((fa, fb) => fa.z - fb.z);

// Diagnostic counts (module-level — runs once at import)
const FILLED_FACE_COUNT = sortedFaces.filter((f) => f.render).length;
const OPEN_FACE_COUNT = sortedFaces.length - FILLED_FACE_COUNT;
if (typeof console !== "undefined") {
  // eslint-disable-next-line no-console
  console.info(
    `[GravityCore] filled faces: ${FILLED_FACE_COUNT} / open faces: ${OPEN_FACE_COUNT}`,
  );
}

// Deduplicated edges with per-edge visibility (convex — centroid Z heuristic)
const edgeSet = new Set<string>();
const EDGES: { a: number; b: number; front: boolean }[] = [];
for (const [a, b, c] of FACES) {
  for (const [u, v] of [
    [a, b],
    [b, c],
    [c, a],
  ] as [number, number][]) {
    const lo = Math.min(u, v);
    const hi = Math.max(u, v);
    const key = `${lo}-${hi}`;
    if (!edgeSet.has(key)) {
      edgeSet.add(key);
      EDGES.push({
        a: lo,
        b: hi,
        front: (ROT[lo][2] + ROT[hi][2]) / 2 > 0,
      });
    }
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

type GravityCoreProps = {
  className?: string;
  scale?: number;
  interactive?: boolean;
};

export default function GravityCore({
  className = "",
  scale = 1,
  interactive = true,
}: GravityCoreProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  // CSS perspective parallax — no RAF, no animation loop.
  // Mousemove sets transform directly; CSS transition handles smoothing.
  useEffect(() => {
    if (!interactive) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const onMove = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const rx = (e.clientY / window.innerHeight - 0.5) * -8; // ±4°
      const ry = (e.clientX / window.innerWidth - 0.5) * 12; // ±6°
      el.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [interactive]);

  return (
    <div
      className={`relative h-full w-full ${className}`}
      style={{ minHeight: "320px" }}
    >
      <div
        ref={wrapRef}
        style={{
          width: "100%",
          height: "100%",
          transition: interactive ? "transform 800ms ease" : undefined,
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 240 240"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
          style={scale !== 1 ? { transform: `scale(${scale})` } : undefined}
        >
          <defs>
            <radialGradient id="ico-node-grad" cx="35%" cy="35%">
              <stop offset="0%" stopColor="#E2C281" />
              <stop offset="45%" stopColor="#B89154" />
              <stop offset="100%" stopColor="#6F5528" />
            </radialGradient>
          </defs>

          {/* Faces — rendered back-to-front (painter's algorithm).
              Only facets that are both front-facing AND upward-facing receive
              fill; all others are left open so the cage and interior breathe. */}
          {sortedFaces
            .filter((f) => f.render)
            .map(({ a, b, c, fill }) => (
              <polygon
                key={`f${a}-${b}-${c}`}
                points={`${P[a][0]},${P[a][1]} ${P[b][0]},${P[b][1]} ${P[c][0]},${P[c][1]}`}
                fill={fill}
                opacity={0.92}
                stroke="none"
              />
            ))}

          {/* Edges — front cage bright and substantial; back cage faint exoskeleton */}
          {EDGES.map(({ a, b, front }) => (
            <line
              key={`e${a}-${b}`}
              x1={P[a][0]}
              y1={P[a][1]}
              x2={P[b][0]}
              y2={P[b][1]}
              stroke="var(--gold)"
              strokeWidth={front ? 1.15 : 0.6}
              strokeLinecap="round"
              opacity={front ? 0.95 : 0.35}
            />
          ))}

          {/* Vertex spheres — front substantial, back present */}
          {P.map(([x, y, z], i) => (
            <circle
              key={`v${i}`}
              cx={x}
              cy={y}
              r={z > 0 ? 4.5 : 2.6}
              fill="url(#ico-node-grad)"
              opacity={z > 0 ? 1.0 : 0.55}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
