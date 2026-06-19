"use client";

import { useRef } from "react";
import CardPair from "@/components/CardPair";
import SignalHero from "@/sections/SignalHero";
import SystemHero, { type SystemFlightHandle } from "@/sections/SystemHero";
import WorldHero from "@/sections/WorldHero";
import ServicesHero from "@/sections/ServicesHero";
import ConnectHero from "@/sections/ConnectHero";

/**
 * ChapterFlow
 *
 * Composes the chapter sequence with the card-stack scroll choreography:
 *
 *   01 SIGNAL  ─card→  02 SYSTEM      (System slides over Signal; then a hold
 *                                      beat flies the satellite)
 *   02 SYSTEM  ─scroll→ 03 WORLD       (normal vertical scroll)
 *   03 WORLD   ─card→  05 SERVICES     (Services slides over World)
 *   05 SERVICES ─scroll→ 06 CONNECT    (normal vertical scroll)
 *
 * Card transitions are desktop/fine-pointer only (see CardPair); everywhere
 * else this renders as a clean normal-flow vertical scroll.
 */
export default function ChapterFlow() {
  const systemRef = useRef<SystemFlightHandle>(null);

  return (
    <>
      <CardPair
        holdVh={100}
        onHold={(p) => systemRef.current?.setFlight(p)}
        under={<SignalHero />}
        over={<SystemHero ref={systemRef} />}
      />

      <CardPair under={<WorldHero />} over={<ServicesHero />} />

      <ConnectHero />
    </>
  );
}
