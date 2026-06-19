import EditorialNav from "@/components/EditorialNav";
import ChapterProgress from "@/components/ChapterProgress";
import ScrollProgress from "@/components/ScrollProgress";
import SiteFooter from "@/components/SiteFooter";
import ChapterFlow from "@/components/ChapterFlow";

/**
 * Sonder Gravity System v2 — homepage composition.
 *
 *   01 SIGNAL   — sections/SignalHero.tsx
 *   02 SYSTEM   — sections/SystemHero.tsx
 *   03 WORLD    — sections/WorldHero.tsx
 *   05 SERVICES — sections/ServicesHero.tsx
 *   06 CONNECT  — sections/ConnectHero.tsx
 *
 * Persistent chrome: EditorialNav (fixed top, owns the logotype), a vertical
 * ChapterProgress rail (fixed right, inverts over CONNECT), and SiteFooter.
 */
export default function Home() {
  return (
    <>
      <ScrollProgress />
      <EditorialNav />

      <main>
        <ChapterFlow />
      </main>

      <SiteFooter />

      {/* Persistent chapter indicator — vertical right-rail, hidden on small
          screens where it would crowd the content. */}
      <div
        className="chapter-rail"
        style={{
          position: "fixed",
          right: "clamp(16px, 2vw, 32px)",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 45,
        }}
      >
        <ChapterProgress orientation="vertical" autoInvertOverDark />
      </div>
    </>
  );
}
