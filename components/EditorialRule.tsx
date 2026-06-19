type EditorialRuleProps = {
  orientation?: "horizontal" | "vertical";
  variant?: "ink" | "ink-strong" | "gold" | "ivory";
  className?: string;
  length?: string;
};

/**
 * EditorialRule
 *
 * The thin hairline that carries across chapter breaks, sits under labels,
 * separates strategy rows, and frames the form fields. Never thicker than 1px.
 */
export default function EditorialRule({
  orientation = "horizontal",
  variant = "ink",
  className = "",
  length = "100%",
}: EditorialRuleProps) {
  const color =
    variant === "gold"
      ? "var(--hairline-gold)"
      : variant === "ink-strong"
        ? "var(--hairline-strong)"
        : variant === "ivory"
          ? "rgba(241, 233, 220, 0.22)"
          : "var(--hairline)";

  if (orientation === "vertical") {
    return (
      <span
        aria-hidden
        className={`inline-block ${className}`}
        style={{ width: "1px", height: length, background: color }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={`block ${className}`}
      style={{ height: "1px", width: length, background: color }}
    />
  );
}
