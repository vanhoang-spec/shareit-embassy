// @ts-nocheck
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Mic, Volume2, Check, X, Sparkles, Rocket } from "lucide-react";
import confetti from "canvas-confetti";

// ===== Shared cosmic avatars (for Profile Center) =====
export const COSMIC_AVATARS = [
  { id: "astronaut", emoji: "👨‍🚀", name: "Astro-Camper" },
  { id: "martian",   emoji: "👽",   name: "Friendly Martian" },
  { id: "cyberbot",  emoji: "🤖",   name: "Cyber-Bot" },
  { id: "starcat",   emoji: "🐱",   name: "Star-Cat" },
  { id: "rocketpup", emoji: "🚀",   name: "Rocket-Puppy" },
];
export const COSMIC_AVATAR_BY_ID = Object.fromEntries(COSMIC_AVATARS.map((a) => [a.id, a]));

// ===== Tiny helpers =====
function BackBar({ onBack, label = "Back to Planets", color = "#22d3ee" }) {
  return (
    <button
      onClick={onBack}
      className="mb-3 inline-flex items-center gap-2 rounded-full gx-glass px-3 py-1.5 text-xs font-black text-white transition hover:scale-105 active:scale-95"
      style={{ boxShadow: `0 0 14px ${color}66, inset 0 0 0 1px ${color}55` }}
    >
      <ArrowLeft size={14} /> {label}
    </button>
  );
}
function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-8 z-50 flex justify-center px-4">
      <div className="ac-fade rounded-full gx-glass px-4 py-2 text-sm font-black text-white shadow-2xl"
        style={{ boxShadow: "0 0 18px #22d3ee, inset 0 0 0 1px #22d3ee66" }}>{msg}</div>
    </div>
  );
}
function useToast() {
  const [msg, setMsg] = useState(null);
  const t = useRef(null);
  function show(m, ms = 1600) { setMsg(m); clearTimeout(t.current); t.current = setTimeout(() => setMsg(null), ms); }
  useEffect(() => () => clearTimeout(t.current), []);
  return { msg, show };
}
function speak(text) {
  try {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95; u.pitch = 1.1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {}
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// =================================================================
// PLANET 1 — Vocabulary Orbit (Unit 2): Quantum Memory + Tech Mic
// =================================================================
const GADGETS = [
  { word: "smartwatch", emoji: "⌚" },
  { word: "laptop",     emoji: "💻" },
  { word: "smartphone", emoji: "📱" },
  { word: "tablet",     emoji: "📟" },
  { word: "digital camera", emoji: "📷" },
  { word: "e-reader",   emoji: "📖" },
  { word: "headphones", emoji: "🎧" },
  { word: "portable speaker", emoji: "🔊" },
];
const TECH_ACTIONS = [
  "upload a photo", "text a friend", "stream a video", "download a song",
  "charge a phone", "log in", "print a document", "search the internet",
];

function QuantumMemoryMatch({ addCoins, onWin }) {
  const [deck, setDeck] = useState(() => buildDeck());
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);
  const wonRef = useRef(false);

  function buildDeck() {
    const cards = [];
    GADGETS.forEach((g, i) => {
      cards.push({ key: `w${i}`, pairId: i, label: g.word, kind: "word" });
      cards.push({ key: `e${i}`, pairId: i, label: g.emoji, kind: "emoji" });
    });
    return shuffle(cards);
  }
  function reset() {
    setDeck(buildDeck()); setFlipped([]); setMatched(new Set()); setMoves(0); wonRef.current = false;
  }
  function tap(idx) {
    if (busy) return;
    if (flipped.includes(idx)) return;
    if (matched.has(deck[idx].pairId)) return;
    const next = [...flipped, idx];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (deck[a].pairId === deck[b].pairId) {
        setBusy(true);
        setTimeout(() => {
          const ns = new Set(matched); ns.add(deck[a].pairId); setMatched(ns); setFlipped([]); setBusy(false);
          if (ns.size === GADGETS.length && !wonRef.current) {
            wonRef.current = true;
            addCoins?.(10);
            try { confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } }); } catch {}
            onWin?.();
          }
        }, 450);
      } else {
        setBusy(true);
        setTimeout(() => { setFlipped([]); setBusy(false); }, 850);
      }
    }
  }
  const done = matched.size === GADGETS.length;
  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs font-bold text-indigo-200">
        <span>Pairs: <b className="text-white">{matched.size}</b>/{GADGETS.length}</span>
        <span>Moves: <b className="text-white">{moves}</b></span>
        <button onClick={reset} className="rounded-full bg-white/10 px-3 py-1 font-black text-cyan-200 ring-1 ring-white/20 hover:bg-white/20">Reset</button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {deck.map((c, i) => {
          const isMatched = matched.has(c.pairId);
          const isFlipped = isMatched || flipped.includes(i);
          return (
            <button
              key={c.key}
              onClick={() => tap(i)}
              className="relative aspect-square rounded-2xl transition-transform active:scale-95"
              style={{ perspective: "600px" }}
              aria-label="Memory card"
            >
              <div className="relative h-full w-full" style={{
                transformStyle: "preserve-3d",
                transition: "transform .5s",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}>
                {/* back */}
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl text-2xl text-white shadow"
                  style={{ background: "linear-gradient(135deg,#1e1b4b,#4c1d95)", boxShadow: "0 0 12px #a78bfa66, inset 0 0 0 1px #a78bfa55", backfaceVisibility: "hidden" }}>
                  ✦
                </div>
                {/* front */}
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl p-1 text-center text-white"
                  style={{
                    background: isMatched ? "linear-gradient(135deg,#06b6d4,#22d3ee)" : "linear-gradient(135deg,#0ea5e9,#6366f1)",
                    boxShadow: isMatched ? "0 0 18px #22d3ee, inset 0 0 0 2px #67e8f9" : "0 0 10px #6366f188",
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    animation: isMatched ? "ac-pop .35s ease-out" : undefined,
                  }}>
                  <span className={c.kind === "emoji" ? "text-3xl" : "text-[11px] font-black leading-tight"}>{c.label}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {done && (
        <div className="mt-4 rounded-2xl gx-glass p-3 text-center text-sm font-black text-white"
          style={{ boxShadow: "0 0 18px #22d3ee, inset 0 0 0 1px #22d3ee55" }}>
          🎉 Board cleared! +10 coins
        </div>
      )}
    </div>
  );
}

function TechActionMic({ addCoins }) {
  const [idx, setIdx] = useState(0);
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState(null); // 'ok'|'no'
  const [heard, setHeard] = useState("");
  const phrase = TECH_ACTIONS[idx];
  const awarded = useRef(new Set());

  function start() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setResult("no"); setHeard("(Speech not supported in this browser)"); return; }
    const rec = new SR();
    rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 3;
    rec.onresult = (e) => {
      const txt = Array.from(e.results[0]).map((r) => r.transcript.toLowerCase()).join(" | ");
      setHeard(txt);
      const norm = (s) => s.toLowerCase().replace(/[^a-z ]/g, "").replace(/\s+/g, " ").trim();
      const target = norm(phrase);
      const ok = txt.split(" | ").some((alt) => norm(alt).includes(target));
      setResult(ok ? "ok" : "no");
      if (ok && !awarded.current.has(idx)) { awarded.current.add(idx); addCoins?.(2); }
    };
    rec.onerror = () => { setResult("no"); };
    rec.onend = () => setListening(false);
    setHeard(""); setResult(null); setListening(true);
    try { rec.start(); } catch { setListening(false); }
  }
  function next() { setResult(null); setHeard(""); setIdx((i) => (i + 1) % TECH_ACTIONS.length); }

  return (
    <div className="rounded-3xl p-4 gx-glass" style={{ boxShadow: "0 0 18px #22d3ee44, inset 0 0 0 1px #22d3ee55" }}>
      <p className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-300">Lesson 5 · Tech Actions</p>
      <p className="mt-1 text-xs font-bold text-indigo-200">Press the mic and say the full phrase.</p>
      <div className="mt-3 rounded-2xl bg-white/5 p-4 text-center ring-1 ring-white/10">
        <p className="text-xl font-black text-white">"{phrase}"</p>
      </div>
      <div className="mt-3 flex items-center justify-center gap-3">
        <button onClick={start} disabled={listening}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-white shadow-lg disabled:opacity-60"
          style={{ background: "linear-gradient(135deg,#ec4899,#8b5cf6)", boxShadow: "0 0 18px #ec489966" }}>
          <Mic size={16} /> {listening ? "Listening…" : "Speak"}
        </button>
        <button onClick={() => speak(phrase)}
          className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-black text-cyan-200 ring-1 ring-white/20 hover:bg-white/20">
          <Volume2 size={14}/> Play My Voice 🎧
        </button>
      </div>
      {heard && (
        <p className="mt-3 text-center text-xs text-indigo-200">Heard: <span className="font-bold text-white">{heard}</span></p>
      )}
      {result && (
        <div className={`mt-3 rounded-xl p-2 text-center text-sm font-extrabold ${result === "ok" ? "text-emerald-200" : "text-rose-200"}`}
          style={{ background: result === "ok" ? "rgba(16,185,129,.15)" : "rgba(244,63,94,.15)", boxShadow: result === "ok" ? "0 0 14px #10b98166" : "0 0 14px #f43f5e66" }}>
          {result === "ok" ? "🌟 Great pronunciation! +2 coins" : "Try again — speak clearly."}
        </div>
      )}
      <div className="mt-4 flex items-center justify-between text-xs text-indigo-200">
        <span>{idx + 1} / {TECH_ACTIONS.length}</span>
        <button onClick={next} className="rounded-full bg-white/10 px-3 py-1 font-black text-white ring-1 ring-white/20 hover:bg-white/20">Next ▶</button>
      </div>
    </div>
  );
}

export function VocabularyQuestU2({ onBack, addCoins }) {
  const [tab, setTab] = useState("l1");
  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #f59e0b44" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300">Planet 1 · Vocabulary Orbit</p>
        <p className="text-xl font-black text-white">🪐 Gadget Galaxy</p>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        {[{k:"l1",t:"Lesson 1 · Gadgets"},{k:"l5",t:"Lesson 5 · Actions"}].map((x) => (
          <button key={x.k} onClick={() => setTab(x.k)}
            className={`rounded-full px-3 py-2 text-xs font-black transition ${tab===x.k ? "text-slate-900" : "text-white"}`}
            style={tab===x.k ? { background: "linear-gradient(135deg,#67e8f9,#a78bfa)", boxShadow: "0 0 14px #a78bfa88" } : { background: "rgba(255,255,255,.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.18)" }}>
            {x.t}
          </button>
        ))}
      </div>
      {tab === "l1" ? <QuantumMemoryMatch addCoins={addCoins} /> : <TechActionMic addCoins={addCoins} />}
    </div>
  );
}

// =================================================================
// PLANET 2 — Rocket Fuel: Past Continuous Mission
// =================================================================
const FUEL_QUESTIONS = [
  { q: "At 9 o'clock, I ___ a video game.", choices: ["was playing", "were playing", "playing"], correct: 0 },
  { q: "They ___ listening to music during class.", choices: ["weren't", "wasn't", "didn't"], correct: 0 },
  { q: "What ___ you doing when the Wi-Fi stopped?", choices: ["were", "was", "did"], correct: 0 },
  { q: "She was uploading a photo when her phone ___.", choices: ["died", "was dying", "dies"], correct: 0 },
];
export function RocketFuelMission({ onBack, addCoins }) {
  const [idx, setIdx] = useState(0);
  const [fuel, setFuel] = useState(0); // 0..4
  const [stability, setStability] = useState(100);
  const [flash, setFlash] = useState(null); // 'ok'|'bad'
  const [launched, setLaunched] = useState(false);
  const [done, setDone] = useState(false);
  const awarded = useRef(false);

  function pick(i) {
    if (launched || done) return;
    const q = FUEL_QUESTIONS[idx];
    if (i === q.correct) {
      setFlash("ok"); setFuel((f) => Math.min(4, f + 1));
      setTimeout(() => {
        setFlash(null);
        if (idx + 1 >= FUEL_QUESTIONS.length) {
          setLaunched(true);
          if (!awarded.current) {
            awarded.current = true;
            addCoins?.(15);
            try { confetti({ particleCount: 160, spread: 90, startVelocity: 55, origin: { y: 0.6 } }); } catch {}
          }
          setTimeout(() => setDone(true), 2200);
        } else {
          setIdx((n) => n + 1);
        }
      }, 600);
    } else {
      setFlash("bad"); setStability((s) => Math.max(0, s - 25));
      setTimeout(() => setFlash(null), 600);
    }
  }
  function retry() { setIdx(0); setFuel(0); setStability(100); setLaunched(false); setDone(false); awarded.current = false; }

  const q = FUEL_QUESTIONS[idx];
  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#a78bfa" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #a78bfa66" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-violet-300">Planet 2 · Grammar Black Hole</p>
        <p className="text-xl font-black text-white">🚀 Rocket Fuel: Past Continuous</p>
        <p className="text-[11px] font-bold text-indigo-200">Fuel the rocket with the correct grammar crystal!</p>
      </div>

      {/* Rocket scene */}
      <div className="relative mb-3 overflow-hidden rounded-3xl p-4 ring-1 ring-white/15"
        style={{ background: "linear-gradient(180deg,#020617,#1e1b4b 60%,#4c1d95)", minHeight: 220 }}>
        {/* stars */}
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="gx-star" style={{
            position: "absolute", top: `${(i*37)%100}%`, left: `${(i*53)%100}%`,
            width: 2, height: 2, animationDelay: `${i*0.1}s`,
          }} />
        ))}
        <div className="relative mx-auto flex h-44 w-24 items-end justify-center">
          <div style={{
            position: "absolute", bottom: launched ? 220 : 8, left: "50%", transform: "translateX(-50%)",
            transition: "bottom 2.2s cubic-bezier(.55,.05,.3,1)", fontSize: 72, filter: "drop-shadow(0 0 12px #a78bfa)",
          }}>🚀</div>
          {/* flame */}
          <div style={{
            position: "absolute", bottom: launched ? 200 : -6, left: "50%", transform: "translateX(-50%)",
            transition: "bottom 2.2s cubic-bezier(.55,.05,.3,1)",
            fontSize: 32 + fuel*6, filter: `drop-shadow(0 0 ${8+fuel*4}px #fb923c)`,
            opacity: fuel === 0 ? 0.3 : 1,
          }}>🔥</div>
          {flash === "bad" && (
            <div className="absolute inset-x-0 bottom-0 text-center text-3xl" style={{ opacity: .9 }}>💨</div>
          )}
        </div>
        {/* gauges */}
        <div className="mt-2 grid grid-cols-2 gap-3 text-xs font-bold text-white">
          <div>
            <p className="mb-1 text-cyan-300">Fuel</p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full transition-all" style={{ width: `${(fuel/4)*100}%`, background: "linear-gradient(90deg,#22d3ee,#a78bfa)" }} />
            </div>
          </div>
          <div>
            <p className="mb-1 text-rose-300">Engine stability</p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full transition-all" style={{ width: `${stability}%`, background: stability>50?"linear-gradient(90deg,#34d399,#22d3ee)":"linear-gradient(90deg,#fb923c,#f43f5e)" }} />
            </div>
          </div>
        </div>
      </div>

      {!done ? (
        <div className="rounded-3xl gx-glass p-4">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-300">Question {idx+1} / {FUEL_QUESTIONS.length}</p>
          <p className="mt-1 text-base font-black text-white">{q.q}</p>
          <div className="mt-3 grid gap-2">
            {q.choices.map((c, i) => (
              <button key={i} onClick={() => pick(i)} disabled={!!flash || launched}
                className="rounded-2xl px-3 py-3 text-left text-sm font-black text-white transition hover:scale-[1.02] active:scale-95 disabled:opacity-70"
                style={{ background: "linear-gradient(135deg,#0ea5e9,#6366f1)", boxShadow: "0 0 12px #6366f188, inset 0 0 0 1px #a78bfa55" }}>
                <span className="mr-2">💎</span>{c}
              </button>
            ))}
          </div>
          {flash === "ok" && <p className="mt-3 text-center text-sm font-black text-emerald-300">⚡ Fuel injected! +10 pts</p>}
          {flash === "bad" && <p className="mt-3 text-center text-sm font-black text-rose-300">💨 Wrong crystal! Stability dropped.</p>}
        </div>
      ) : (
        <div className="rounded-3xl gx-glass p-5 text-center" style={{ boxShadow: "0 0 22px #22d3ee" }}>
          <p className="text-2xl font-black text-white">🎆 Mission complete!</p>
          <p className="mt-1 text-sm font-bold text-indigo-200">Rocket launched into deep space. +15 coins awarded!</p>
          <div className="mt-3 flex justify-center gap-2">
            <button onClick={retry} className="rounded-full px-4 py-2 text-sm font-black text-slate-900"
              style={{ background: "linear-gradient(135deg,#67e8f9,#a78bfa)", boxShadow: "0 0 14px #a78bfa88" }}>Replay</button>
            <button onClick={onBack} className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white ring-1 ring-white/20">Back</button>
          </div>
        </div>
      )}
    </div>
  );
}

// =================================================================
// PLANET 3 — AI Voice Nebula (Unit 2)
// =================================================================
const VOICE_PROMPTS_U2 = [
  "I was streaming a video.",
  "He was texting a friend.",
  "She was uploading a photo.",
  "We were charging our phones.",
  "They were downloading a song.",
  "I was searching the internet.",
];
export function AISpeakingWorldU2({ onBack, addCoins }) {
  const [idx, setIdx] = useState(0);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [result, setResult] = useState(null);
  const awarded = useRef(new Set());
  const phrase = VOICE_PROMPTS_U2[idx];

  function start() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setResult("no"); setHeard("(Speech not supported)"); return; }
    const rec = new SR(); rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 3;
    rec.onresult = (e) => {
      const txt = Array.from(e.results[0]).map((r) => r.transcript.toLowerCase()).join(" | ");
      setHeard(txt);
      const norm = (s) => s.toLowerCase().replace(/[^a-z ]/g, "").replace(/\s+/g, " ").trim();
      const target = norm(phrase);
      const targetWords = target.split(" ").filter(Boolean);
      const ok = txt.split(" | ").some((alt) => {
        const a = norm(alt);
        if (a.includes(target)) return true;
        const hits = targetWords.filter((w) => a.includes(w)).length;
        return hits / targetWords.length >= 0.7;
      });
      setResult(ok ? "ok" : "no");
      if (ok && !awarded.current.has(idx)) { awarded.current.add(idx); addCoins?.(3); }
    };
    rec.onerror = () => setResult("no");
    rec.onend = () => setListening(false);
    setHeard(""); setResult(null); setListening(true);
    try { rec.start(); } catch { setListening(false); }
  }

  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#ec4899" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #ec489966" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-pink-300">Planet 3 · AI Voice Nebula</p>
        <p className="text-xl font-black text-white">🌌 Past Continuous Speaking</p>
      </div>
      <div className="rounded-3xl gx-glass p-4">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-300">{idx+1} / {VOICE_PROMPTS_U2.length}</p>
        <div className="mt-2 rounded-2xl bg-white/5 p-4 text-center ring-1 ring-white/10">
          <p className="text-xl font-black text-white">"{phrase}"</p>
        </div>
        <div className="mt-3 flex items-center justify-center gap-3">
          <button onClick={start} disabled={listening}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-white shadow-lg disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#ec4899,#8b5cf6)", boxShadow: "0 0 18px #ec489966" }}>
            <Mic size={16} /> {listening ? "Listening…" : "Speak"}
          </button>
          <button onClick={() => speak(phrase)}
            className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-black text-cyan-200 ring-1 ring-white/20 hover:bg-white/20">
            <Volume2 size={14}/> Play My Voice 🎧
          </button>
        </div>
        {heard && <p className="mt-3 text-center text-xs text-indigo-200">Heard: <span className="font-bold text-white">{heard}</span></p>}
        {result && (
          <div className={`mt-3 rounded-xl p-2 text-center text-sm font-extrabold ${result === "ok" ? "text-emerald-200" : "text-rose-200"}`}
            style={{ background: result === "ok" ? "rgba(16,185,129,.15)" : "rgba(244,63,94,.15)" }}>
            {result === "ok" ? "🌟 Stellar speaking! +3 coins" : "Try again — speak the full sentence."}
          </div>
        )}
        <div className="mt-4 flex items-center justify-between">
          <button onClick={() => setIdx((i) => (i - 1 + VOICE_PROMPTS_U2.length) % VOICE_PROMPTS_U2.length)} className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white ring-1 ring-white/20">◀ Prev</button>
          <button onClick={() => { setIdx((i) => (i + 1) % VOICE_PROMPTS_U2.length); setResult(null); setHeard(""); }} className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white ring-1 ring-white/20">Next ▶</button>
        </div>
      </div>
    </div>
  );
}

// =================================================================
// PLANET 4 — Reading Comet (Unit 2): Vlogging Kit
// =================================================================
const READING_TEXT_U2 = `Vlogging Kit & Tech Tools

Last weekend, Maya was starting her own vlog. She was using a digital camera to film, headphones to check the sound, and a tablet to edit her clips. While she was uploading the video, her smartphone buzzed — her best friend was texting her about the new portable speaker. Maya smiled, plugged in her e-reader to charge, and pressed PRINT on her bright cover photo. Her vlogging kit was ready for the cosmos.`;
const READING_QUIZ_U2 = [
  { q: "Maya was using a digital camera to film.", a: true },
  { q: "She was editing her clips on a smartwatch.", a: false },
  { q: "Her friend was texting her about a portable speaker.", a: true },
];
export function ReadingAdventureU2({ onBack, addCoins }) {
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const awarded = useRef(false);
  function pick(i, v) {
    if (done) return;
    const next = { ...answers, [i]: v };
    setAnswers(next);
    if (Object.keys(next).length === READING_QUIZ_U2.length) {
      const allRight = READING_QUIZ_U2.every((x, k) => next[k] === x.a);
      if (allRight && !awarded.current) {
        awarded.current = true; addCoins?.(15);
        try { confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } }); } catch {}
        setDone(true);
      } else if (!allRight) {
        // allow retry
        setTimeout(() => { setAnswers({}); }, 1200);
      }
    }
  }
  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#22d3ee" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #22d3ee66" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-300">Planet 4 · Reading Comet</p>
        <p className="text-xl font-black text-white">☄️ Vlogging Kit & Tech Tools</p>
      </div>
      <div className="rounded-3xl gx-glass p-4 text-sm leading-relaxed text-indigo-100 whitespace-pre-line">
        {READING_TEXT_U2}
      </div>
      <div className="mt-3 rounded-3xl gx-glass p-4">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-300">True or False?</p>
        <div className="mt-2 space-y-2">
          {READING_QUIZ_U2.map((x, i) => {
            const chosen = answers[i];
            const correct = x.a;
            const showFeedback = chosen !== undefined;
            return (
              <div key={i} className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                <p className="text-sm font-black text-white">{i+1}. {x.q}</p>
                <div className="mt-2 flex gap-2">
                  {[true, false].map((v) => {
                    const isPick = chosen === v;
                    const isRight = showFeedback && v === correct;
                    const isWrong = showFeedback && isPick && v !== correct;
                    return (
                      <button key={String(v)} onClick={() => pick(i, v)}
                        className="flex-1 rounded-full px-3 py-1.5 text-xs font-black text-white transition active:scale-95"
                        style={{
                          background: isRight ? "linear-gradient(135deg,#10b981,#34d399)"
                                   : isWrong ? "linear-gradient(135deg,#f43f5e,#fb7185)"
                                   : "rgba(255,255,255,.08)",
                          boxShadow: isPick ? "0 0 14px #22d3ee88" : "inset 0 0 0 1px rgba(255,255,255,.18)",
                        }}>
                        {v ? <><Check size={12} className="inline"/> True</> : <><X size={12} className="inline"/> False</>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {done && <p className="mt-3 text-center text-sm font-black text-emerald-300">🌟 Perfect read! +15 coins</p>}
      </div>
    </div>
  );
}

// =================================================================
// PLANET 5 — Cosmic Word Hunter (oi/oy phonics)
// =================================================================
const HUNTER_WORDS = ["COIN", "SOIL", "POINT", "BOY", "TOY", "JOY"];
const GRID_SIZE = 10;
function buildGrid() {
  // Try multiple times to place all words; fall back to random fill.
  for (let attempt = 0; attempt < 50; attempt++) {
    const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
    const placed = [];
    const dirs = [
      [0, 1], [1, 0], [1, 1], [-1, 1],
    ];
    let ok = true;
    for (const w of HUNTER_WORDS) {
      let done = false;
      for (let tries = 0; tries < 80 && !done; tries++) {
        const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)];
        const r0 = Math.floor(Math.random() * GRID_SIZE);
        const c0 = Math.floor(Math.random() * GRID_SIZE);
        const r1 = r0 + dr * (w.length - 1);
        const c1 = c0 + dc * (w.length - 1);
        if (r1 < 0 || r1 >= GRID_SIZE || c1 < 0 || c1 >= GRID_SIZE) continue;
        let fits = true;
        const cells = [];
        for (let i = 0; i < w.length; i++) {
          const r = r0 + dr * i, c = c0 + dc * i;
          if (grid[r][c] && grid[r][c] !== w[i]) { fits = false; break; }
          cells.push([r, c]);
        }
        if (!fits) continue;
        cells.forEach(([r, c], i) => { grid[r][c] = w[i]; });
        placed.push({ word: w, cells });
        done = true;
      }
      if (!done) { ok = false; break; }
    }
    if (!ok) continue;
    // fill blanks
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < GRID_SIZE; r++) for (let c = 0; c < GRID_SIZE; c++) {
      if (!grid[r][c]) grid[r][c] = letters[Math.floor(Math.random() * 26)];
    }
    return { grid, placed };
  }
  // fallback (shouldn't happen)
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const grid = Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => letters[Math.floor(Math.random() * 26)]));
  return { grid, placed: [] };
}
function lineCells(a, b) {
  const dr = Math.sign(b[0] - a[0]), dc = Math.sign(b[1] - a[1]);
  const len = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])) + 1;
  // must be straight (horizontal, vertical, or 45° diag)
  if (a[0] !== b[0] && a[1] !== b[1] && Math.abs(b[0] - a[0]) !== Math.abs(b[1] - a[1])) return null;
  const cells = [];
  for (let i = 0; i < len; i++) cells.push([a[0] + dr * i, a[1] + dc * i]);
  return cells;
}
function playChime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const notes = [880, 1175, 1568];
    notes.forEach((f, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = "triangle"; o.frequency.value = f;
      const t = ctx.currentTime + i * 0.08;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.25, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.3);
    });
    setTimeout(() => { try { ctx.close(); } catch {} }, 700);
  } catch {}
}

export function WordHunterArena({ onBack, addCoins }) {
  const [{ grid, placed }, setBoard] = useState(() => buildGrid());
  const [start, setStart] = useState(null);
  const [hover, setHover] = useState(null);
  const [foundWords, setFoundWords] = useState(new Set());
  const [foundCells, setFoundCells] = useState(() => new Set()); // "r,c"
  const [popup, setPopup] = useState(null);
  const awarded = useRef(false);

  function cellKey(r, c) { return `${r},${c}`; }
  function tap(r, c) {
    if (!start) { setStart([r, c]); setHover([r, c]); return; }
    const cells = lineCells(start, [r, c]);
    if (!cells) { setStart([r, c]); setHover([r, c]); return; }
    const word = cells.map(([rr, cc]) => grid[rr][cc]).join("");
    const reversed = word.split("").reverse().join("");
    const match = HUNTER_WORDS.find((w) => (w === word || w === reversed) && !foundWords.has(w));
    if (match) {
      const ns = new Set(foundWords); ns.add(match); setFoundWords(ns);
      const nfc = new Set(foundCells); cells.forEach(([rr, cc]) => nfc.add(cellKey(rr, cc))); setFoundCells(nfc);
      playChime();
      setPopup({ word: match, sound: match.includes("OY") ? "/oy/" : "/oi/" });
      setTimeout(() => setPopup(null), 1400);
      if (ns.size === HUNTER_WORDS.length && !awarded.current) {
        awarded.current = true; addCoins?.(30);
        try { confetti({ particleCount: 200, spread: 100, startVelocity: 60, origin: { y: 0.6 } }); } catch {}
      }
    }
    setStart(null); setHover(null);
  }
  function reset() {
    setBoard(buildGrid()); setStart(null); setHover(null);
    setFoundWords(new Set()); setFoundCells(new Set()); awarded.current = false;
  }
  const previewCells = useMemo(() => {
    if (!start || !hover) return null;
    return lineCells(start, hover);
  }, [start, hover]);
  const previewSet = new Set((previewCells || []).map(([r, c]) => cellKey(r, c)));
  const allFound = foundWords.size === HUNTER_WORDS.length;

  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#34d399" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #34d39966" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-300">Planet 5 · Supernova Quiz Arena</p>
        <p className="text-xl font-black text-white">🔭 Cosmic Word Hunter</p>
        <p className="text-[11px] font-bold text-indigo-200">Find the hidden <b>oi</b> / <b>oy</b> phonics words.</p>
      </div>

      <div className="rounded-3xl gx-glass p-3">
        <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}>
          {grid.map((row, r) =>
            row.map((ch, c) => {
              const k = cellKey(r, c);
              const isStart = start && start[0] === r && start[1] === c;
              const isPreview = previewSet.has(k);
              const isFound = foundCells.has(k);
              return (
                <button
                  key={k}
                  onClick={() => tap(r, c)}
                  onMouseEnter={() => start && setHover([r, c])}
                  className="aspect-square select-none rounded-md text-[11px] font-black sm:text-xs"
                  style={{
                    color: isFound ? "#0f172a" : "#e2e8f0",
                    background: isFound
                      ? "linear-gradient(135deg,#fde047,#facc15)"
                      : isStart
                        ? "linear-gradient(135deg,#67e8f9,#22d3ee)"
                        : isPreview
                          ? "rgba(167,139,250,.45)"
                          : "rgba(255,255,255,.06)",
                    boxShadow: isFound
                      ? "0 0 10px #fde047, inset 0 0 0 1px #ca8a04"
                      : isStart
                        ? "0 0 10px #22d3ee, inset 0 0 0 1px #67e8f9"
                        : "inset 0 0 0 1px rgba(255,255,255,.10)",
                  }}
                >
                  {ch}
                </button>
              );
            })
          )}
        </div>
        <p className="mt-2 text-center text-[10px] text-indigo-300">Tap a start letter, then the end letter of the word.</p>
      </div>

      <div className="mt-3 rounded-3xl gx-glass p-3">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-300">Hunt list</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {HUNTER_WORDS.map((w) => {
            const f = foundWords.has(w);
            return (
              <span key={w} className="rounded-full px-3 py-1 text-xs font-black"
                style={{
                  background: f ? "linear-gradient(135deg,#fde047,#facc15)" : "rgba(255,255,255,.08)",
                  color: f ? "#0f172a" : "#fff",
                  boxShadow: f ? "0 0 12px #facc15" : "inset 0 0 0 1px rgba(255,255,255,.18)",
                  textDecoration: f ? "line-through" : "none",
                }}>
                {w.toLowerCase()}
              </span>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <button onClick={reset} className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white ring-1 ring-white/20">New Grid</button>
          <span className="text-xs text-indigo-200">Found {foundWords.size}/{HUNTER_WORDS.length}</span>
        </div>
        {allFound && (
          <div className="mt-3 rounded-2xl p-3 text-center text-sm font-black text-slate-900"
            style={{ background: "linear-gradient(135deg,#fde047,#facc15)", boxShadow: "0 0 22px #facc15" }}>
            🏅 Master Word Hunter! +30 coins
          </div>
        )}
      </div>

      {popup && (
        <div className="pointer-events-none fixed inset-x-0 top-24 z-50 flex justify-center px-6">
          <div className="ac-fade rounded-full px-5 py-2 text-sm font-black text-slate-900 shadow-2xl"
            style={{ background: "linear-gradient(135deg,#fde047,#facc15)", boxShadow: "0 0 20px #facc15" }}>
            ✨ {popup.word.toLowerCase()} — <span className="font-extrabold">{popup.sound}</span>
          </div>
        </div>
      )}
    </div>
  );
}
