import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { matchCharacter } from "@/lib/matching";
import { zodiacFromDate } from "@/lib/zodiac";

interface MatchBody {
  birth_date?: string;
  answers?: Record<string, string>;
  pack_from?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as MatchBody | null;
    if (!body?.birth_date || !body.answers) {
      return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }

    const zodiac = zodiacFromDate(body.birth_date);
    if (!zodiac) {
      return NextResponse.json({ error: "Date de naissance invalide." }, { status: 400 });
    }

    const store = getStore();
    const characters = await store.listCharacters();
    if (characters.length === 0) {
      return NextResponse.json({ error: "Aucun personnage disponible." }, { status: 500 });
    }

    const { character, compatibility } = matchCharacter(characters, body.answers);

    // Pack : la nouvelle révélation est débloquée si des crédits restent
    let plan_purchased: "standard" | "premium" | null = null;
    let paid_at: string | null = null;
    if (body.pack_from) {
      const unlocked = await store.consumePackCredit(body.pack_from);
      if (unlocked) {
        plan_purchased = "premium";
        paid_at = new Date().toISOString();
      }
    }

    const session = await store.createSession({
      birth_date: body.birth_date,
      zodiac,
      answers: body.answers,
      matched_character_id: character.id,
      compatibility_score: compatibility,
      plan_purchased,
      paid_at,
      pack_credits: 0,
    });

    return NextResponse.json({
      id: session.id,
      compatibility,
      preview: { name: character.name, era: character.era, hook: character.hook },
    });
  } catch (err) {
    // On ne laisse jamais une erreur non gérée renvoyer une page HTML : le client
    // attend toujours du JSON, sinon le quiz semble "bloqué" sans message clair.
    console.error("[api/match] Erreur inattendue:", err);
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessaie dans un instant." },
      { status: 500 }
    );
  }
}
