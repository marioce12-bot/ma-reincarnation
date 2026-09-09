"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { QUESTIONS } from "@/lib/quiz";
import DestinyLoader from "@/components/DestinyLoader";

const TOTAL_STEPS = QUESTIONS.length + 1;
const MIN_LOADER_MS = 3400;

interface MatchResponse {
  id: string;
  compatibility: number;
  preview: { name: string; era: string; hook: string };
}

export default function QuizClient() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [birthDate, setBirthDate] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAnswers, setLastAnswers] = useState<Record<string, string> | null>(null);

  const question = step > 0 ? QUESTIONS[step - 1] : null;

  const birthValid = useMemo(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return false;
    const d = new Date(`${birthDate}T00:00:00Z`);
    if (Number.isNaN(d.getTime())) return false;
    return d.getTime() < Date.now() && d.getTime() > new Date("1920-01-01T00:00:00Z").getTime();
  }, [birthDate]);

  function choose(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    window.setTimeout(() => {
      if (step + 1 < TOTAL_STEPS) {
        setStep(step + 1);
      } else {
        void submit({ ...answers, [questionId]: optionId });
      }
    }, 260);
  }

  async function submit(finalAnswers: Record<string, string>) {
    setSubmitting(true);
    setError(null);
    setLastAnswers(finalAnswers);
    try {
      const lastSession = localStorage.getItem("tri_last_session");
      const packFrom = lastSession ? (JSON.parse(lastSession) as { id?: string }).id : undefined;
      const matchPromise = fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birth_date: birthDate,
          answers: finalAnswers,
          pack_from: packFrom,
        }),
      });
      const minDelay = new Promise((resolve) => window.setTimeout(resolve, MIN_LOADER_MS));
      const [res] = await Promise.all([matchPromise, minDelay]);
      let data: MatchResponse | { error?: string };
      try {
        data = await res.json();
      } catch {
        throw new Error("Réponse invalide du serveur.");
      }
      if (!res.ok) {
        throw new Error(
          "error" in data && data.error ? data.error : "Les esprits ont perdu le fil."
        );
      }
      localStorage.setItem("tri_last_session", JSON.stringify({ id: (data as MatchResponse).id }));
      router.push(`/resultat/${(data as MatchResponse).id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Les esprits ont perdu le fil. Réessaie dans un instant.");
      setSubmitting(false);
    }
  }

  if (submitting) {
    return <DestinyLoader />;
  }

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pb-10 pt-8">
      <div>
        <div className="flex items-center justify-between text-xs text-sand/60">
          <span>
            Étape {step + 1} / {TOTAL_STEPS}
          </span>
          {step > 0 ? (
            <button onClick={() => setStep(step - 1)} className="hover:text-sand">
              ← Retour
            </button>
          ) : (
            <Link href="/" className="hover:text-sand">
              ← Accueil
            </Link>
          )}
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gold transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {question ? (
        <section className="mt-10 flex flex-1 flex-col">
          <h1 className="font-display text-2xl font-semibold leading-snug">{question.label}</h1>
          <div className="mt-6 grid gap-3">
            {question.options.map((option) => {
              const selected = answers[question.id] === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => choose(question.id, option.id)}
                  className={`flex items-center gap-4 rounded-2xl border px-4 py-4 text-left transition ${
                    selected
                      ? "border-gold bg-gold/15"
                      : "border-white/15 bg-white/5 hover:border-white/40"
                  }`}
                >
                  <span className="text-3xl">{option.emoji}</span>
                  <span className="font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="mt-10 flex flex-1 flex-col">
          <h1 className="font-display text-2xl font-semibold leading-snug">
            Quelle est ta date de naissance ?
          </h1>
          <p className="mt-2 text-sm text-sand/60">
            Ton signe zodiacal affine ta révélation — promis, personne ne le verra.
          </p>
          <input
            type="date"
            value={birthDate}
            min="1920-01-01"
            onChange={(e) => setBirthDate(e.target.value)}
            className="mt-6 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-4 text-lg text-sand outline-none focus:border-gold"
          />
          <button
            onClick={() => setStep(1)}
            disabled={!birthValid}
            className="mt-6 rounded-2xl bg-gold px-6 py-4 text-lg font-bold text-night transition enabled:hover:bg-gold2 disabled:opacity-40"
          >
            Continuer
          </button>
        </section>
      )}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-center">
          <p className="text-sm font-semibold text-red-200">😕 {error}</p>
          {lastAnswers && (
            <button
              onClick={() => void submit(lastAnswers)}
              className="mt-3 rounded-xl bg-red-400/20 px-4 py-2 text-sm font-bold text-red-100 transition hover:bg-red-400/30"
            >
              ↻ Réessayer
            </button>
          )}
        </div>
      )}
    </main>
  );
}
