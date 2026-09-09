import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import charactersJson from "@/data/characters.json";
import type { Character, PlanId, QuizSession } from "./types";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const usingSupabase = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

export interface NewSession {
  birth_date: string | null;
  zodiac: string | null;
  answers: Record<string, string>;
  matched_character_id: string;
  compatibility_score: number;
  plan_purchased: "standard" | "premium" | null;
  paid_at: string | null;
  pack_credits: number;
}

export interface Store {
  listCharacters(): Promise<Character[]>;
  getCharacter(id: string): Promise<Character | null>;
  createSession(input: NewSession): Promise<QuizSession>;
  getSession(id: string): Promise<QuizSession | null>;
  markPaid(id: string, plan: PlanId, ref: string | null): Promise<QuizSession | null>;
  consumePackCredit(sourceId: string): Promise<boolean>;
}

const characters = charactersJson as unknown as Character[];

const AMOUNTS: Record<PlanId, number> = { standard: 200, premium: 500, pack: 1000 };

// Mode démo (sans Supabase) : les sessions vivent en mémoire du process Node.
function memoryStore(): Store {
  type MemState = { sessions: Map<string, QuizSession> };
  const g = globalThis as { __triMemory?: MemState };
  g.__triMemory ??= { sessions: new Map() };
  const sessions = g.__triMemory.sessions;

  return {
    async listCharacters() {
      return characters;
    },
    async getCharacter(id) {
      return characters.find((c) => c.id === id) ?? null;
    },
    async createSession(input) {
      const session: QuizSession = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        birth_date: input.birth_date,
        zodiac: input.zodiac ?? null,
        answers: input.answers,
        matched_character_id: input.matched_character_id,
        compatibility_score: input.compatibility_score,
        plan_purchased: input.plan_purchased ?? null,
        paid_at: input.paid_at ?? null,
        pack_credits: 0,
      };
      sessions.set(session.id, session);
      return session;
    },
    async getSession(id) {
      return sessions.get(id) ?? null;
    },
    async markPaid(id, plan) {
      const s = sessions.get(id);
      if (!s) return null;
      s.plan_purchased = plan === "pack" ? "premium" : plan;
      s.paid_at = new Date().toISOString();
      if (plan === "pack") s.pack_credits = (s.pack_credits ?? 0) + 2;
      return s;
    },
    async consumePackCredit(sourceId) {
      const s = sessions.get(sourceId);
      if (!s || (s.pack_credits ?? 0) <= 0) return false;
      s.pack_credits -= 1;
      return true;
    },
  };
}

function supabaseStore(client: SupabaseClient): Store {
  const listCharacters = async (): Promise<Character[]> => {
    try {
      const { data, error } = await client.from("characters").select("*").order("name");
      if (error) throw new Error(error.message);
      if (!data || data.length === 0) {
        // Table Supabase pas encore seedée (node scripts/seed.mjs) : on retombe sur le
        // jeu de personnages embarqué plutôt que de bloquer le quiz de l'utilisateur.
        console.error("[store] Table 'characters' vide dans Supabase — fallback sur data/characters.json");
        return characters;
      }
      return data as unknown as Character[];
    } catch (err) {
      console.error("[store] Échec de lecture Supabase (characters) — fallback sur data/characters.json:", err);
      return characters;
    }
  };

  const getCharacter = async (id: string): Promise<Character | null> => {
    try {
      const { data } = await client.from("characters").select("*").eq("id", id).maybeSingle();
      if (data) return data as unknown as Character;
    } catch (err) {
      console.error("[store] Échec de lecture Supabase (getCharacter) — fallback sur data/characters.json:", err);
    }
    // Le personnage matché peut venir du fallback local (table Supabase vide/inaccessible) :
    // on le retrouve dans data/characters.json plutôt que de renvoyer 404.
    return characters.find((c) => c.id === id) ?? null;
  };

  const getSession = async (id: string): Promise<QuizSession | null> => {
    const { data } = await client.from("quiz_sessions").select("*").eq("id", id).maybeSingle();
    return (data as unknown as QuizSession) ?? null;
  };

  const createSession = async (input: NewSession): Promise<QuizSession> => {
    const { data, error } = await client.from("quiz_sessions").insert(input).select().single();
    if (error) throw new Error(error.message);
    return data as unknown as QuizSession;
  };

  const markPaid = async (id: string, plan: PlanId, ref: string | null): Promise<QuizSession | null> => {
    const current = await getSession(id);
    if (!current) return null;
    const updates: Record<string, unknown> = {
      plan_purchased: plan === "pack" ? "premium" : plan,
      paid_at: new Date().toISOString(),
    };
    if (plan === "pack") updates.pack_credits = (current.pack_credits ?? 0) + 2;
    const { data, error } = await client.from("quiz_sessions").update(updates).eq("id", id).select().single();
    if (error) throw new Error(error.message);
    await client.from("payments").insert({
      session_id: id,
      provider: "saspay",
      plan,
      amount: AMOUNTS[plan],
      currency: "XOF",
      status: "confirmed",
      transaction_ref: ref,
    });
    return data as unknown as QuizSession;
  };

  const consumePackCredit = async (sourceId: string): Promise<boolean> => {
    const source = await getSession(sourceId);
    if (!source || (source.pack_credits ?? 0) <= 0) return false;
    const { error } = await client
      .from("quiz_sessions")
      .update({ pack_credits: source.pack_credits - 1 })
      .eq("id", sourceId)
      .eq("pack_credits", source.pack_credits);
    return !error;
  };

  return { listCharacters, getCharacter, createSession, getSession, markPaid, consumePackCredit };
}

export function getStore(): Store {
  if (!usingSupabase) return memoryStore();
  const g = globalThis as { __triSupabase?: SupabaseClient };
  g.__triSupabase ??= createClient(SUPABASE_URL as string, SUPABASE_SERVICE_ROLE_KEY as string, {
    auth: { persistSession: false },
  });
  return supabaseStore(g.__triSupabase);
}
