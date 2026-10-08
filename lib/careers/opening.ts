import { OPENING } from "@/lib/careers/copy";

/**
 * Is the role still open? Asked of the `hiring` function in the CRM's
 * Supabase project, which reads hiring.openings.status.
 *
 * Closing the opening is one cell in that table. The answer is cached for a
 * minute, so the page says "closed" within a minute and nothing is redeployed.
 *
 * If the question cannot be asked (no env, a timeout, a bad answer) the page
 * shows the form. That is the safe side: the same door refuses an application
 * to a closed opening, and a candidate who cannot submit is told why.
 */
export async function openingStatus(): Promise<"open" | "closed"> {
  const url = process.env.HIRING_API_URL;
  const secret = process.env.HIRING_API_SECRET;
  if (!url || !secret) return "open";
  try {
    const res = await fetch(`${url}?opening=${OPENING}`, {
      headers: { "x-hiring-secret": secret },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return "open";
    const data = (await res.json()) as { status?: unknown };
    return data.status === "closed" ? "closed" : "open";
  } catch {
    return "open";
  }
}
