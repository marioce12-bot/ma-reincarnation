import { ImageResponse } from "next/og";
import { getStore } from "@/lib/store";
import { affinityMeta } from "@/lib/eras";
import type { Character } from "@/lib/types";
import type { ReactNode } from "react";

export const runtime = "nodejs";

const W = 1080;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session");
  const format = url.searchParams.get("format") ?? "story";
  if (!sessionId) return new Response("Session manquante", { status: 400 });

  const store = getStore();
  const session = await store.getSession(sessionId);
  const character = session ? await store.getCharacter(session.matched_character_id) : null;
  if (!session || !character) return new Response("Introuvable", { status: 404 });

  const meta = affinityMeta(character.affinity_tags[0]);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const host = siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const height = format === "square" ? 1080 : format === "portrait" ? 1350 : 1920;
  const nameSize = format === "square" ? 72 : format === "portrait" ? 84 : 100;
  const compatSize = format === "square" ? 110 : format === "portrait" ? 96 : 150;

  return new ImageResponse(
    (
      <Frame from={meta.from} to={meta.to} height={height}>
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 8, opacity: 0.85 }}>
          TA·RÉINCARNATION
        </div>
        <Identity character={character} nameSize={nameSize} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: compatSize, fontWeight: 800, lineHeight: 1 }}>
            {`${session.compatibility_score} %`}
          </div>
          <div style={{ fontSize: 34, opacity: 0.85, marginTop: 12 }}>de compatibilité</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ width: 120, height: 4, background: "#D9A441" }} />
          <div style={{ fontSize: 40, fontStyle: "italic" }}>Et si tu avais déjà vécu ?</div>
          <div style={{ fontSize: 26, opacity: 0.6 }}>{host}</div>
        </div>
      </Frame>
    ),
    { width: W, height }
  );
}

function Frame({
  from,
  to,
  height,
  children,
}: {
  from: string;
  to: string;
  height: number;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundImage: `linear-gradient(160deg, ${to}, ${from})`,
        color: "#F6EEDD",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 80,
          background: "rgba(12, 8, 30, 0.45)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Identity({ character, nameSize }: { character: Character; nameSize: number }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          width: 170,
          height: 170,
          borderRadius: 999,
          border: "4px solid rgba(255,255,255,0.4)",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 80,
          fontWeight: 700,
          background: "rgba(255,255,255,0.12)",
        }}
      >
        {character.name.charAt(0)}
      </div>
      <div
        style={{
          fontSize: nameSize,
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.15,
          maxWidth: 900,
        }}
      >
        {character.name}
      </div>
      <div style={{ fontSize: 38, opacity: 0.9, textAlign: "center" }}>{character.era}</div>
      <div style={{ fontSize: 30, opacity: 0.7, textAlign: "center" }}>
        {`${character.location} · ${character.profession}`}
      </div>
    </div>
  );
}
