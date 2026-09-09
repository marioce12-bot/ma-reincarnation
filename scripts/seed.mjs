// Charge data/characters.json vers Supabase.
// Usage : node scripts/seed.mjs  (requiert SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY dans .env.local)

import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();

let env = { ...process.env };
const envLocalPath = path.join(root, ".env.local");
if (fs.existsSync(envLocalPath)) {
  for (const line of fs.readFileSync(envLocalPath, "utf8").split(/\r?\n/)) {
    const i = line.indexOf("=");
    if (i > 0 && !line.trim().startsWith("#")) {
      env[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  }
}

const url = env.SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis (dans .env.local).");
  process.exit(1);
}

const characters = JSON.parse(
  fs.readFileSync(path.join(root, "data", "characters.json"), "utf8")
);

const supabase = createClient(url, key, { auth: { persistSession: false } });
const { error } = await supabase.from("characters").upsert(characters, { onConflict: "id" });

if (error) {
  console.error("Échec du seed :", error.message);
  process.exit(1);
}
console.log(`✓ ${characters.length} personnages chargés dans Supabase.`);
