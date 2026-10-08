// A local stand-in for the CRM's `hiring` edge function, so the application
// form can be run end to end on this machine without touching Supabase.
//
// Same database code: it loads sonder-crm's local stubs and every migration
// into PGlite (Postgres in WebAssembly, borrowed from ~/sonder/hq/tests/db) and
// answers exactly as supabase/functions/hiring/index.ts does, by calling
// public.hiring_api(). Nothing is written to disk; stop it and the rows are gone.
//
//   node scripts/hiring-stub.mjs          serves on http://127.0.0.1:8787
//
// Then, in .env.development.local (gitignored):
//   HIRING_API_URL=http://127.0.0.1:8787
//   HIRING_API_SECRET=local-test-secret
//
// Résumés are kept in memory under the path the real function would give them
// in the `resumes` bucket; nothing reaches Supabase Storage from here.
//
// Test-only extras, not part of the real function:
//   GET  /_rows               openings, applicants, status history, hit count, stored files
//   POST /_sql     { sql }    one statement, e.g. update hiring.openings set status = 'closed'
//   POST /_down    { on }     answer 500 to everything, to see the "could not save" state
//   POST /_storage { fail }   make résumé uploads fail, to see the "email it to us" receipt
import http from "node:http";
import { createRequire } from "node:module";
import { readdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { Readable } from "node:stream";

const CRM = process.env.CRM_DIR ?? resolve(homedir(), "sonder/sonder-crm");
const HQ_DB = process.env.HQ_DB_DIR ?? resolve(homedir(), "sonder/hq/tests/db");
const SECRET = process.env.HIRING_SECRET ?? "local-test-secret";
const PORT = Number(process.env.PORT ?? 8787);

const { PGlite } = await import(createRequire(join(HQ_DB, "package.json")).resolve("@electric-sql/pglite"));
const db = new PGlite();
await db.exec(readFileSync(join(CRM, "supabase/local-tests/local_stubs.sql"), "utf8"));
for (const f of readdirSync(join(CRM, "supabase/migrations")).filter((f) => f.endsWith(".sql")).sort()) {
  await db.exec(readFileSync(join(CRM, "supabase/migrations", f), "utf8"));
}

// Keep in step with REFUSAL, RESUME_TYPES and MAX_FILE_BYTES in supabase/functions/hiring/index.ts.
const REFUSAL = { invalid: 400, unknown_op: 400, unknown_opening: 404, closed: 409, rate_limited: 429 };
const RESUME_EXTENSIONS = ["pdf", "doc", "docx"];
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const files = new Map(); // path -> { name, bytes }
let down = false;
let storageFails = false;

/** storeResume() from the real function, with a Map where the bucket would be. */
async function storeResume(opening, id, file) {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!RESUME_EXTENSIONS.includes(ext) || file.size === 0 || file.size > MAX_FILE_BYTES || storageFails) return "failed";
  const path = `${opening}/${id}.${ext}`;
  if (files.has(path)) return "failed"; // upsert: false
  files.set(path, { name: file.name, bytes: file.size });
  const r = await api("attach_resume", { opening, id, path, filename: file.name });
  return r.ok === true ? "stored" : "failed";
}

const read = (req) =>
  new Promise((ok) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => ok(body));
  });
const send = (res, status, body) => {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
};
const api = async (op, p) =>
  (await db.query("select public.hiring_api($1, $2::jsonb) as r", [op, JSON.stringify(p)])).rows[0].r;
const refuse = (res, r) => send(res, REFUSAL[r.error] ?? 400, { ok: false, error: r.error, field: r.field });
const rows = async (sql) => (await db.query(sql)).rows;

http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://stub");
      if (url.pathname === "/_rows") {
        return send(res, 200, {
          openings: await rows("select * from hiring.openings"),
          applicants: await rows("select * from hiring.applicants order by created_at"),
          history: await rows("select * from hiring.status_history order by id"),
          hits: (await rows("select count(*)::int as n from hiring.hits"))[0].n,
          files: [...files].map(([path, f]) => ({ path, ...f })),
        });
      }
      if (url.pathname === "/_sql") {
        await db.exec(JSON.parse(await read(req)).sql);
        return send(res, 200, { ok: true });
      }
      if (url.pathname === "/_down") {
        down = JSON.parse(await read(req)).on === true;
        return send(res, 200, { down });
      }
      if (url.pathname === "/_storage") {
        storageFails = JSON.parse(await read(req)).fail === true;
        return send(res, 200, { storageFails });
      }

      if (req.headers["x-hiring-secret"] !== SECRET) return send(res, 401, { ok: false, error: "bad secret" });
      if (down) return send(res, 500, { ok: false, error: "simulated outage" });
      if (req.method === "GET") {
        const r = await api("opening", { opening: url.searchParams.get("opening") ?? "" });
        return r.ok === true ? send(res, 200, { ok: true, status: r.status }) : refuse(res, r);
      }
      // The same two shapes the real function takes: multipart (payload + resume) or JSON alone.
      let raw;
      let file = null;
      if ((req.headers["content-type"] ?? "").startsWith("multipart/form-data")) {
        const form = await new Request(url, { method: "POST", headers: req.headers, body: Readable.toWeb(req), duplex: "half" }).formData();
        raw = String(form.get("payload") ?? "");
        const sent = form.get("resume");
        if (sent instanceof File && sent.size > 0) file = sent;
      } else {
        raw = await read(req);
      }
      const body = JSON.parse(raw);
      const r = await api("apply", body);
      if (r.ok !== true) return refuse(res, r);
      const opening = typeof body.opening === "string" && body.opening ? body.opening : "appointment-setter";
      const resume = !file ? "none" : r.status === "received" ? await storeResume(opening, String(r.id), file) : "skipped";
      if (r.alert) console.log("would send to Telegram:", JSON.stringify(r.alert), resume === "failed" ? "(résumé did not upload)" : "");
      return send(res, 200, { ok: true, status: r.status, resume });
    } catch (e) {
      return send(res, 500, { ok: false, error: e.message });
    }
  })
  .listen(PORT, "127.0.0.1", () => console.log(`hiring stub ready on http://127.0.0.1:${PORT}`));
