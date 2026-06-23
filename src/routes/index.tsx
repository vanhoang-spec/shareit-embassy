import { createFileRoute } from "@tanstack/react-router";
import AdventureCamp from "@/components/AdventureCamp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Share It! 5 — Adventure Camp" },
      { name: "description", content: "Flashcards, AI Speaking, and My Camp for Share It! 5." },
    ],
  }),
  component: AdventureCamp,
});
