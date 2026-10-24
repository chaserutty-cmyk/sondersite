import Motion from "@/components/Motion";
import Chrome from "@/components/Chrome";
import Hero from "@/sections/Hero";
import Perspective from "@/sections/Perspective";
import Expertise from "@/sections/Expertise";
import Work from "@/sections/Work";
import Approach from "@/sections/Approach";
import Talk from "@/sections/Talk";
import Footer from "@/sections/Footer";

/**
 * Sonder Digital Co. — homepage (v2). See DESIGN-PLAN.md.
 *
 *   Hero         white type sheet + dark particle-wave sheet, marquee
 *   Perspective  dark statement sheet: operations console + approved statement
 *   Expertise    white sheet: sticky 3D crystal card + four capabilities
 *   Work         dark sheet: three case cards
 *   Approach     white sheet: sticky render card + four steps
 *   Talk         dark CTA sheet over the particle wave
 *   Footer       on the canvas
 */
export default function Home() {
  return (
    <>
      <Motion />
      <Chrome />
      <main id="main">
        <Hero />
        <Perspective />
        <Expertise />
        <Work />
        <Approach />
        <Talk />
      </main>
      <Footer />
    </>
  );
}
