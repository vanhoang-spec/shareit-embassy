import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import AdventureCamp from "@/components/AdventureCamp";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Share It! 5 — Adventure Camp" },
      { name: "description", content: "Flashcards, AI Speaking, and My Camp for Share It! 5." },
    ],
  }),
  component: IndexGate,
});

function IndexGate() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate({ to: "/auth", replace: true });
      } else {
        setAuthed(true);
      }
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) {
        setAuthed(false);
        navigate({ to: "/auth", replace: true });
      } else {
        setAuthed(true);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  if (checking || !authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#004088]">
        <Loader2 className="animate-spin text-white" size={36} />
      </div>
    );
  }
  return <AdventureCamp />;
}
