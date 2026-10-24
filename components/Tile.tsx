import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { INTERFACES as UI } from "@/lib/copy";

/**
 * Tile — a dark 3D render (licensed, graded to Sonder's palette) with glass interface
 * panels floating over it. This is how each capability and the CRM case are shown:
 * premium imagery for the mood, the approved interface text for the meaning.
 *
 * Every string in the panels comes from lib/copy INTERFACES (the approved copy's
 * illustrative-interface panels). Nothing here is a screenshot of a product.
 */

type Chip = { text: string; style: CSSProperties; d?: string };

export function Tile({
  bg,
  alt,
  note,
  chips = [],
  panelSide = "left",
  children,
  className = "",
}: {
  bg: string;
  alt: string;
  note: string;
  chips?: Chip[];
  panelSide?: "left" | "right";
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`tile ${className}`} role="img" aria-label={alt}>
      <Image src={bg} alt="" fill sizes="(min-width: 1100px) 60vw, 100vw" className="tile__bg" quality={82} />
      <div className="tile__shade" aria-hidden="true" />
      {chips.map((c) => (
        <span key={c.text} className="glass float" style={{ ...c.style, ["--fd" as string]: c.d ?? "0s" }} aria-hidden="true">
          <span className="dot" />
          {c.text}
        </span>
      ))}
      {children ? (
        <div className={`panel ${panelSide === "right" ? "panel--right" : ""}`} aria-hidden="true">
          {children}
        </div>
      ) : null}
      <span className="tile__note mono">{note}</span>
    </div>
  );
}

/* ------------------------------------------------------------ 01 AI systems */
export function TileAI() {
  const a = UI.assistant;
  return (
    <Tile
      bg="/art/tile-ai.webp"
      alt={`Illustrative interface: ${a.title}, ${a.sub}`}
      note="Illustrative interface · 01 / AI systems"
      chips={[
        { text: a.steps[0], style: { right: "6%", top: "14%" }, d: "-1s" },
        { text: a.steps[1], style: { right: "10%", top: "58%" }, d: "-3s" },
      ]}
    >
      <div className="panel__bar">
        <span className="panel__s">S</span>
        <span>
          {a.title} · {a.sub}
        </span>
        <span className="status">
          <i />
          {a.status}
        </span>
      </div>
      <div className="panel__body">
        <p className="bubble bubble--user">{a.user}</p>
        <p className="bubble bubble--ai">
          <b>Sonder / Assistant</b>
          {a.reply}
        </p>
      </div>
    </Tile>
  );
}

/* ------------------------------------------------------------ 02 Automation */
export function TileAutomation() {
  const arch = UI.architecture;
  return (
    <Tile
      bg="/art/tile-automation.webp"
      alt="System architecture: new inquiry, qualification, CRM and follow-up"
      note="System architecture · 02 / Automation"
      chips={[
        { text: UI.connected[0], style: { right: "6%", top: "16%" }, d: "-2s" },
        { text: UI.connected[1], style: { right: "12%", bottom: "20%" }, d: "-4s" },
      ]}
    >
      <div className="panel__bar">
        <span className="panel__s">S</span>
        <span>System architecture</span>
        <span className="status">
          <i />
          Running
        </span>
      </div>
      <div className="panel__body arch">
        {arch.map((n, i) => (
          <div key={n.k} style={{ display: "contents" }}>
            <div className="arch__node">
              <span className="arch__k mono">{n.k}</span>
              <span className="arch__v">{n.v}</span>
              <span className="arch__s mono">{n.s}</span>
            </div>
            {i < arch.length - 1 ? <span className="arch__link" aria-hidden="true" /> : null}
          </div>
        ))}
      </div>
    </Tile>
  );
}

/* ----------------------------------------------------------- 03 Development */
export function TileSoftware() {
  const w = UI.workspace;
  return (
    <Tile
      bg="/art/tile-software.webp"
      alt={`Illustrative interface: ${w.crumb}, ${w.title}`}
      note="Software, your way · 03 / Development"
      panelSide="right"
      chips={[{ text: w.rows[2][0], style: { left: "6%", top: "16%" }, d: "-2s" }]}
    >
      <div className="panel__bar">
        <span className="panel__s">S</span>
        <span>{w.crumb}</span>
      </div>
      <div className="panel__body">
        <span className="panel__h">{w.title}</span>
        <div className="panel__tabs">
          {w.tabs.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="panel__rows">
          {w.rows.map(([name, stage], i) => (
            <div key={name} className="panel__row">
              <span>{name}</span>
              <span className={`chip ${i === 2 ? "chip--solid" : i === 0 ? "" : "chip--muted"}`}>{stage}</span>
            </div>
          ))}
        </div>
      </div>
    </Tile>
  );
}

/* --------------------------------------------------------- 04 Sales systems */
export function TileSales() {
  const f = UI.followUp;
  return (
    <Tile
      bg="/art/tile-sales.webp"
      alt={`Illustrative interface: ${f.label}`}
      note="Customer experience · 04 / Sales systems"
      chips={[
        { text: f.stages[0], style: { right: "8%", top: "12%" }, d: "0s" },
        { text: f.stages[1], style: { right: "14%", top: "40%" }, d: "-2s" },
        { text: f.stages[2], style: { right: "6%", top: "68%" }, d: "-4s" },
      ]}
    >
      <div className="panel__bar">
        <span className="panel__s">S</span>
        <span>{f.label}</span>
        <span className="status">
          <i />
          {f.stages[1]}
        </span>
      </div>
      <div className="panel__body">
        <p className="panel__p">{f.greeting}</p>
        <p className="panel__p">{f.body}</p>
        <span className="panel__ctx">✓ {f.context}</span>
      </div>
    </Tile>
  );
}
