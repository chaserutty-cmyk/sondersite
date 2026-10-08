import type { Metadata } from "next";
import { Footer, Masthead } from "@/components/careers/Chrome";
import { CONTACT_EMAIL, PRIVACY_PATH, RETENTION, ROLE_PATH } from "@/lib/careers/copy";

/**
 * /careers/privacy — the applicant data notice the form's consent box links to.
 *
 * This page describes what the build actually does, so it changes when the
 * build does: the fields in lib/careers/application.ts, what
 * app/api/careers/apply/route.ts sends on, and what public.hiring_api in the
 * CRM stores. If one of those changes, read this again before shipping.
 *
 * It is a plain-language notice, not legal advice. The retention period and
 * the contact address are Chase's to confirm (lib/careers/copy.ts).
 */

export const metadata: Metadata = {
  title: "Applicant data notice",
  description: "What Sonder Digital Co. collects when you apply for a role, why, who sees it, and how to have it deleted.",
  alternates: { canonical: PRIVACY_PATH },
};

export default function ApplicantDataNotice() {
  return (
    <>
      <Masthead meta="Careers" />
      <main className="cr-notice">
        <div className="cr-wrap">
          <div className="cr-notice__inner">
            <h1>Applicant data notice</h1>
            <p className="cr-notice__lede">
              What we collect when you apply for a role at Sonder Digital Co. through this site, why, who sees
              it, and how to have it deleted.
            </p>

            <h2>What we collect</h2>
            <p>What you type into the application:</p>
            <ul>
              <li>your name and email address;</li>
              <li>your country and time zone;</li>
              <li>your calling experience, the industries you have called, and the results you report;</li>
              <li>your employment history, as you list it;</li>
              <li>the dialers and CRMs you have used;</li>
              <li>your résumé, as the file you attach;</li>
              <li>a profile link, if you choose to give one.</li>
            </ul>
            <p>
              We also record when you applied, when you first opened the page, and the source named in the link
              you followed, if it named one (for example, which job post or group it was shared in).
            </p>

            <h2>What we do not collect</h2>
            <p>
              There is no account and no password, and the application does not ask for a recording. Our
              application database does not store your IP address. To slow down spam, our server
              turns the address into a scrambled value that cannot be read back; that value is cleared on a
              rolling basis, normally within a day. Our hosting provider handles your IP address to deliver the
              page, as it does for any website.
            </p>
            <p>
              If we invite you to a later stage that asks for an audio recording, that page explains how the
              recording is used before you send anything.
            </p>

            <h2>Why we collect it</h2>
            <p>
              To assess your application, to contact you about it, and to run the hiring process for this role.
              A person reads every application. To decide which to read first, we add up points from three of
              your answers: years of calling experience, US business calling experience, and availability. That
              tally only sorts the list. It does not reject anyone, and it does not use your name, your country,
              or anything else about who you are.
            </p>

            <h2>Who sees it</h2>
            <p>
              Sonder Digital&rsquo;s founder. The application is stored in a private database and your résumé
              in private file storage, and the site runs on hosting we rent; those providers (Supabase and
              Vercel) process the data on our behalf. Your résumé is not public and has no link anyone else can
              open. We do not sell your information or share it for anyone&rsquo;s marketing.
            </p>

            <h2>How long we keep it</h2>
            <p>We keep applications, résumés included, until {RETENTION}, then delete them.</p>

            <h2>Your choices</h2>
            <p>
              Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> to see, correct, withdraw or delete
              your application. If you ask us to delete it, we will delete the application and the résumé file,
              and we will confirm by email.
            </p>

            <p>
              <a href={ROLE_PATH}>Back to the appointment setter role</a>
            </p>

            <p className="cr-notice__updated">Last updated 8 October 2026</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
