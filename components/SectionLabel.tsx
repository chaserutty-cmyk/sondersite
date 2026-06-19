import GoldNode from "./GoldNode";

type SectionLabelProps = {
  index: string;
  label: string;
  className?: string;
};

/**
 * SectionLabel
 *
 * The "01 — SIGNAL" chapter marker that opens every section. Small gold dot
 * on the left, mono-tracked uppercase to the right. Lives in section corners.
 */
export default function SectionLabel({
  index,
  label,
  className = "",
}: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <GoldNode size={5} />
      <span className="label-tech">
        <span style={{ color: "var(--gold)" }}>{index}</span>
        <span className="mx-2" style={{ color: "var(--soft-ink)" }}>
          &mdash;
        </span>
        <span>{label}</span>
      </span>
    </div>
  );
}
