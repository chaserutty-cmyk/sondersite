import { CSSProperties } from "react";

type TechnicalMetaProps = {
  label?: string;
  value?: string;
  align?: "left" | "right" | "center";
  tone?: "ink" | "ivory" | "gold";
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
};

/**
 * TechnicalMeta
 *
 * The tiny mono coordinate / metadata labels scattered around the orbital
 * diagrams (e.g. "118.243 / MOTION POINT", "ORBIT ID: SD-01 / GRAVITY CORE").
 * Always small, always tracked, always quiet.
 */
export default function TechnicalMeta({
  label,
  value,
  align = "left",
  tone = "ink",
  className = "",
  style,
  children,
}: TechnicalMetaProps) {
  const color =
    tone === "ivory"
      ? "var(--ivory-on-dark)"
      : tone === "gold"
        ? "var(--gold)"
        : "var(--soft-ink)";

  const valueColor = tone === "ivory" ? "var(--ivory-on-dark)" : "var(--ink)";

  return (
    <div
      className={`mono ${className}`}
      style={{
        fontSize: "11px",
        letterSpacing: "0.18em",
        lineHeight: 1.4,
        textAlign: align,
        color,
        ...style,
      }}
    >
      {value && (
        <div
          className="mono"
          style={{
            color: valueColor,
            letterSpacing: "0.04em",
            fontSize: "12px",
            marginBottom: "2px",
          }}
        >
          {value}
        </div>
      )}
      {label && <div className="uppercase">{label}</div>}
      {children}
    </div>
  );
}
