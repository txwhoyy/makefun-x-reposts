// main.ts — entrypoint for the makefun-x-reposts-02 entry.
//
// The whole job of this program is deliberately small: take the
// POSTS.json that sits next to it in the bot directory, make sure it
// really is the shape the bounty asks for (an object whose "posts"
// field is an array of between 1 and 15 post URLs), and copy it into
// the output directory so the grader can read it back.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// --- where things live -------------------------------------------------

const botDir = process.env.MAKEFUN_BOT_DIR ?? ".";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";

// --- read and parse the source file ------------------------------------

const sourcePath = join(botDir, "POSTS.json");
const raw = readFileSync(sourcePath, "utf8");

let parsed: unknown;
try {
  parsed = JSON.parse(raw);
} catch {
  throw new Error(`POSTS.json is not valid JSON: ${sourcePath}`);
}

// --- validate the shape -------------------------------------------------

if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
  throw new Error("POSTS.json must be a JSON object");
}

const posts = (parsed as { posts?: unknown }).posts;

if (!Array.isArray(posts)) {
  throw new Error('POSTS.json must carry a "posts" array');
}
if (posts.length < 1 || posts.length > 15) {
  throw new Error(`"posts" must hold 1 to 15 entries, got ${posts.length}`);
}
for (const entry of posts) {
  if (typeof entry !== "string" || entry.length === 0) {
    throw new Error('every entry in "posts" must be a non-empty string');
  }
}

// --- copy it to the output directory ------------------------------------

mkdirSync(outDir, { recursive: true });
const targetPath = join(outDir, "POSTS.json");
writeFileSync(targetPath, JSON.stringify(parsed, null, 2) + "\n", "utf8");

// Success is silent by design: no output means the copy went through.
