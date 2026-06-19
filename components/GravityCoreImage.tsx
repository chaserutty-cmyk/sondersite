/**
 * GravityCoreImage
 *
 * Image-based gravity core for the 01 SIGNAL hero.
 * Uses a plain <img> tag — Next.js serves /public/assets/ at /assets/.
 *
 * The image has had its background flood-filled to transparent (alpha 0)
 * so the gold cage and marble facets sit cleanly on the page background.
 */

type GravityCoreImageProps = {
  className?: string;
};

export default function GravityCoreImage({ className = "" }: GravityCoreImageProps) {
  return (
    <div
      className={`absolute ${className}`}
      style={{
        width: "clamp(280px, 29vw, 440px)",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 3,
        pointerEvents: "none",
      }}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/gravity-core-render.png"
        alt=""
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
