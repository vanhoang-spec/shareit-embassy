import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tent, Loader2 } from "lucide-react";
import embassyLogo from "@/assets/embassy-logo.png.asset.json";

const BRAND = { navy: "#004088", red: "#E81820", gold: "#F5B301" };

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [{ title: "Welcome to Share It! — Adventure Camp" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong, little camper!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, ${BRAND.navy} 0%, #1a5fb4 50%, ${BRAND.navy} 100%)`,
      }}
    >
      {/* Floating decorations */}
      <div className="absolute top-6 left-6 text-5xl animate-bounce">⛺</div>
      <div className="absolute top-10 right-8 text-4xl animate-pulse">🌟</div>
      <div className="absolute bottom-10 left-10 text-4xl animate-pulse">🌲</div>
      <div className="absolute bottom-8 right-12 text-5xl animate-bounce">🏕️</div>

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border-4" style={{ borderColor: BRAND.gold }}>
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">🏕️</div>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: BRAND.navy }}>
            Welcome to Share It!
          </h1>
          <p className="text-sm mt-1 font-semibold" style={{ color: BRAND.red }}>
            {mode === "signup" ? "Join the Adventure Camp! ⛺" : "Welcome back, Camper! 🎒"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1" style={{ color: BRAND.navy }}>
              Camper Email (Ask your parents!) 📧
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="camper@email.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none text-base font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1" style={{ color: BRAND.navy }}>
              Secret Password 🔐
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Shhh... it's a secret!"
              className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none text-base font-medium"
            />
          </div>

          {error && (
            <div className="text-sm font-semibold text-red-600 bg-red-50 rounded-lg p-2 text-center">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-extrabold text-white text-lg shadow-lg active:scale-95 transition-transform disabled:opacity-60 flex items-center justify-center gap-2"
            style={{
              background:
                mode === "signup"
                  ? `linear-gradient(135deg, ${BRAND.red}, #ff5a60)`
                  : `linear-gradient(135deg, ${BRAND.navy}, #1a5fb4)`,
            }}
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : mode === "signup" ? (
              <>🏅 Get My Camper Badge!</>
            ) : (
              <>
                <Tent size={20} /> Enter the Adventure!
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            onClick={() => {
              setError(null);
              setMode(mode === "signup" ? "login" : "signup");
            }}
            className="text-sm font-bold underline"
            style={{ color: BRAND.navy }}
          >
            {mode === "signup"
              ? "Already a camper? Enter the Adventure! 🎒"
              : "New camper? Get your badge! 🏅"}
          </button>
        </div>
      </div>
    </div>
  );
}
