import GravityCore from "@/components/GravityCore";
import OrbitalDiagram from "@/components/OrbitalDiagram";
import TechnicalMeta from "@/components/TechnicalMeta";
import GoldNode from "@/components/GoldNode";
import EditorialRule from "@/components/EditorialRule";
import Image from "next/image";

/**
 * /sandbox — isolation page for refining the GravityCore (R3F) and
 * OrbitalDiagram (SVG) against the F5201951 reference.
 *
 * Left column: the live composition.
 * Right column: the source mockup.
 *
 * This page does not ship to production. It exists only for the Step 3 review
 * loop: build → diff against reference → refine → repeat.
 */
export default function SandboxPage() {
  return (
    <div className="min-h-screen bg-[var(--ivory)] px-[var(--gutter)] py-16">
      <header className="mb-12 flex items-center justify-between">
        <div className="label-tech">SANDBOX / 03 — ORBITAL ISOLATION</div>
        <div className="label-tech" style={{ color: "var(--gold)" }}>
          REF: F5201951
        </div>
      </header>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* LIVE COMPOSITION */}
        <div>
          <div className="mb-6 label-tech">LIVE</div>
          <div
            className="relative aspect-[3/2] w-full overflow-hidden"
            style={{ background: "var(--ivory)" }}
          >
            <div className="absolute inset-0">
              <OrbitalDiagram />
            </div>
            <div className="absolute inset-0">
              <GravityCore />
            </div>

            {/* Metadata anchors, matching the reference placement */}
            <div className="absolute right-6 top-6">
              <TechnicalMeta
                value="ORBIT ID: SD-01"
                label="GRAVITY CORE"
                align="right"
              />
            </div>
            <div className="absolute left-1/2 top-10 -translate-x-12">
              <TechnicalMeta value="118.243" label="MOTION POINT" />
            </div>
            <div className="absolute bottom-10 right-12">
              <TechnicalMeta value="34.052" label="POSITIONING" align="right" />
            </div>

            {/* Bottom annotations */}
            <div className="absolute bottom-4 left-1/3 flex items-center gap-2">
              <GoldNode size={4} />
              <span className="label-tech">SYSTEMS THAT CREATE PULL.</span>
            </div>
            <div className="absolute bottom-4 right-1/4 flex items-center gap-2">
              <GoldNode size={4} />
              <span className="label-tech">WORLDS THAT CREATE IMPACT.</span>
            </div>
          </div>

          <EditorialRule className="mt-6" />
          <p
            className="mt-4 max-w-md"
            style={{ color: "var(--soft-ink)", fontSize: "14px" }}
          >
            Composition: SVG orbital scaffolding underneath, R3F faceted core
            (icosahedron, flat shading, gold cage, vertex spheres) on top.
            Move the cursor to drive subtle drift.
          </p>
        </div>

        {/* REFERENCE */}
        <div>
          <div className="mb-6 label-tech">REFERENCE — F5201951</div>
          <div
            className="relative aspect-[3/2] w-full overflow-hidden"
            style={{ background: "var(--paper)" }}
          >
            <Image
              src="/references/F5201951-D981-432C-9F02-177920881A5F.PNG"
              alt="Sonder Digital hero reference"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <EditorialRule className="mt-6" />
          <p
            className="mt-4 max-w-md"
            style={{ color: "var(--soft-ink)", fontSize: "14px" }}
          >
            QA target. Critique the live composition against this mockup on the
            10-dimension rubric before composing the hero in Step 4.
          </p>
        </div>
      </div>
    </div>
  );
}
