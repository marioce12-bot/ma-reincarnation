import type { Metadata } from "next";
import QuizClient from "./QuizClient";

export const metadata: Metadata = {
  title: "Le quiz — Ta-réincarnation",
};

export default function QuizPage() {
  return <QuizClient />;
}
