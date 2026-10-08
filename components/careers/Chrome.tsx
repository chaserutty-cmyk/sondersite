import Link from "next/link";
import { CONTACT_EMAIL, PRIVACY_PATH, ROLE_PATH } from "@/lib/careers/copy";

/**
 * The careers pages' own masthead and footer.
 *
 * The homepage's fixed nav, menu overlay and ticker footer are choreographed
 * for the homepage and need its scripts. These are their static cousins: the
 * same stacked mono logotype and the same SONDER. sign-off on charcoal, with
 * nothing to load and nothing that moves.
 *
 * The two links home are not prefetched: the homepage is a different root
 * layout and a heavy one, and a candidate on a phone has not asked for it.
 */

export function Masthead({ meta }: { meta: string }) {
  return (
    <header className="cr-mast cr-wrap">
      <Link className="cr-mast__logo" href="/" prefetch={false} aria-label="Sonder Digital Co. — Home">
        Sonder
        <br />
        Digital Co.
      </Link>
      <p className="cr-mast__meta">{meta}</p>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="cr-foot">
      <div className="cr-wrap cr-foot__grid">
        <p className="cr-foot__sign" aria-hidden="true">
          SONDER<span>.</span>
        </p>
        <ul className="cr-foot__links">
          <li>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </li>
          <li>
            <a href={ROLE_PATH}>Appointment setter role</a>
          </li>
          <li>
            <a href={PRIVACY_PATH}>Applicant data notice</a>
          </li>
          <li>
            <Link href="/" prefetch={false}>
              sonderdigitalco.com
            </Link>
          </li>
        </ul>
        <p className="cr-foot__legal">© {new Date().getFullYear()} Sonder Digital Co.</p>
      </div>
    </footer>
  );
}
