// @ts-nocheck
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Mic, Volume2, Check, X, Sparkles, Rocket } from "lucide-react";
import confetti from "canvas-confetti";
import { CURRICULUM_DATA, getUnitData } from "./curriculum";

// ===== Shared cosmic avatars (for Profile Center) =====
export const COSMIC_AVATARS = [
  { id: "astronaut", emoji: "👨‍🚀", name: "Astro-Camper" },
  { id: "martian", emoji: "👽", name: "Friendly Martian" },
  { id: "cyberbot", emoji: "🤖", name: "Cyber-Bot" },
  { id: "starcat", emoji: "🐱", name: "Star-Cat" },
  { id: "rocketpup", emoji: "🚀", name: "Rocket-Puppy" },
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
      <div
        className="ac-fade rounded-full gx-glass px-4 py-2 text-sm font-black text-white shadow-2xl"
        style={{ boxShadow: "0 0 18px #22d3ee, inset 0 0 0 1px #22d3ee66" }}
      >
        {msg}
      </div>
    </div>
  );
}
function useToast() {
  const [msg, setMsg] = useState(null);
  const t = useRef(null);
  function show(m, ms = 1600) {
    setMsg(m);
    clearTimeout(t.current);
    t.current = setTimeout(() => setMsg(null), ms);
  }
  useEffect(() => () => clearTimeout(t.current), []);
  return { msg, show };
}
function speak(text) {
  try {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.pitch = 1.1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {}
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// =================================================================
// PLANET 1 — Vocabulary Orbit (Unit 2): Flashcards + AI Speak
// Strictly same format as Unit 1 (flip cards w/ meaning + form toggle,
// audio, mastered hides; mic challenge w/ 5-stars + +10 coins).
// =================================================================
const GADGETS = [
  { id: 1, base: "smartwatch", form: "smartwatches", vi: "đồng hồ thông minh", emoji: "⌚", theme: "emerald" },
  { id: 2, base: "laptop", form: "laptops", vi: "máy tính xách tay", emoji: "💻", theme: "sky" },
  { id: 3, base: "smartphone", form: "smartphones", vi: "điện thoại thông minh", emoji: "📱", theme: "violet" },
  { id: 4, base: "tablet", form: "tablets", vi: "máy tính bảng", emoji: "📟", theme: "amber" },
  { id: 5, base: "digital camera", form: "digital cameras", vi: "máy ảnh kỹ thuật số", emoji: "📷", theme: "rose" },
  { id: 6, base: "e-reader", form: "e-readers", vi: "máy đọc sách", emoji: "📖", theme: "orange" },
  { id: 7, base: "headphones", form: "a pair of headphones", vi: "tai nghe", emoji: "🎧", theme: "teal" },
  { id: 8, base: "portable speaker", form: "portable speakers", vi: "loa di động", emoji: "🔊", theme: "cyan" },
];
const GADGET_THEMES = {
  emerald: "linear-gradient(135deg,#10b981,#34d399)",
  sky: "linear-gradient(135deg,#0ea5e9,#38bdf8)",
  violet: "linear-gradient(135deg,#8b5cf6,#a78bfa)",
  amber: "linear-gradient(135deg,#f59e0b,#fbbf24)",
  rose: "linear-gradient(135deg,#f43f5e,#fb7185)",
  orange: "linear-gradient(135deg,#f97316,#fb923c)",
  teal: "linear-gradient(135deg,#14b8a6,#2dd4bf)",
  cyan: "linear-gradient(135deg,#06b6d4,#22d3ee)",
};

function GadgetFlashcard({ data, mastered, onMaster, onNotSure }) {
  const [showMeaning, setShowMeaning] = useState(false);
  const [isPlural, setIsPlural] = useState(false);
  const phrase = isPlural ? data.form : data.base;
  const header = isPlural ? "linear-gradient(135deg,#f97316,#8b5cf6)" : GADGET_THEMES[data.theme];
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 ${mastered ? "ring-4 ring-emerald-400 shadow-emerald-200" : "ring-1 ring-slate-100"}`}
    >
      {mastered && (
        <div className="absolute right-2 top-2 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ac-pop">
          <Check size={20} strokeWidth={3} />
        </div>
      )}
      <div className="flex items-center justify-center py-4 transition-all duration-500" style={{ background: header }}>
        <div className="grid h-16 w-28 place-items-center rounded-2xl bg-white text-4xl shadow-inner">{data.emoji}</div>
        {isPlural && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-extrabold text-purple-700 shadow">
            PLURAL ⚡
          </span>
        )}
      </div>
      <div className="px-3 pb-3 pt-3">
        <p
          key={phrase}
          className={`ac-fade min-h-12 text-center text-lg font-extrabold leading-tight ${isPlural ? "text-purple-700" : "text-slate-800"}`}
        >
          {phrase}
        </p>
        <div className="mt-1 min-h-7 text-center">
          {showMeaning ? (
            <p className="ac-fade rounded-xl bg-slate-100 px-2 py-1 text-sm font-bold text-slate-700">{data.vi}</p>
          ) : (
            <span className="text-sm text-slate-300">• • •</span>
          )}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          <button
            onClick={() => setShowMeaning((v) => !v)}
            className="flex items-center justify-center gap-1 rounded-2xl bg-slate-100 py-2 text-slate-600 transition active:scale-95 hover:bg-slate-200"
          >
            <span className="text-[11px] font-bold">{showMeaning ? "Hide" : "Meaning"}</span>
          </button>
          <button
            onClick={() => setIsPlural((v) => !v)}
            className={`flex items-center justify-center gap-1 rounded-2xl py-2 transition active:scale-95 ${isPlural ? "bg-purple-500 text-white" : "bg-orange-100 text-orange-600 hover:bg-orange-200"}`}
          >
            <span className="text-[11px] font-bold">Form ⚡</span>
          </button>
        </div>
        <div className="mt-1.5 grid grid-cols-2 gap-1.5">
          <button
            onClick={() => speak(phrase)}
            className="flex items-center justify-center gap-1 rounded-2xl bg-cyan-100 py-2 text-cyan-700 transition active:scale-95 hover:bg-cyan-200"
          >
            <Volume2 size={14} />
            <span className="text-[11px] font-bold">Listen</span>
          </button>
          <button
            onClick={() => {
              const u = new SpeechSynthesisUtterance(phrase);
              u.lang = "en-US";
              u.rate = 0.55;
              window.speechSynthesis?.cancel();
              window.speechSynthesis?.speak(u);
            }}
            className="flex items-center justify-center gap-1 rounded-2xl bg-amber-100 py-2 text-amber-700 transition active:scale-95 hover:bg-amber-200"
          >
            <Volume2 size={14} />
            <span className="text-[11px] font-bold">Slow</span>
          </button>
        </div>
        <button
          onClick={() => (mastered ? onNotSure(data.id) : onMaster(data.id))}
          className={`mt-2 w-full rounded-2xl py-2 text-xs font-extrabold text-white transition active:scale-95 ${mastered ? "bg-slate-400" : "bg-gradient-to-r from-emerald-500 to-cyan-500"}`}
        >
          {mastered ? "Not sure" : "Mastered 🎉"}
        </button>
      </div>
    </div>
  );
}

function GadgetFlashcardGrid({ addCoins }) {
  const [mastered, setMastered] = useState(() => new Set());
  const [hiding, setHiding] = useState(() => new Set());
  function master(id) {
    if (mastered.has(id)) return;
    setHiding((p) => new Set(p).add(id));
    setMastered((prev) => {
      const n = new Set(prev);
      n.add(id);
      addCoins?.(2);
      if (n.size === GADGETS.length)
        setTimeout(() => {
          try {
            confetti({ particleCount: 180, spread: 90, origin: { y: 0.6 } });
          } catch {}
        }, 350);
      return n;
    });
    setTimeout(
      () =>
        setHiding((p) => {
          const n = new Set(p);
          n.delete(id);
          return n;
        }),
      400,
    );
  }
  function unMaster(id) {
    setMastered((p) => {
      const n = new Set(p);
      n.delete(id);
      return n;
    });
  }
  return (
    <>
      <div className="mb-3 rounded-3xl bg-white p-3 shadow ring-1 ring-slate-100">
        <div className="flex items-center justify-between">
          <p className="text-sm font-extrabold text-slate-800">Vocabulary progress</p>
          <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-xs font-extrabold text-white">
            {mastered.size}/{GADGETS.length} mastered
          </span>
        </div>
        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(mastered.size / GADGETS.length) * 100}%`,
              background: "linear-gradient(90deg,#06b6d4,#8b5cf6)",
            }}
          />
        </div>
      </div>
      {mastered.size === GADGETS.length ? (
        <div className="ac-fade rounded-3xl bg-white p-8 text-center shadow ring-1 ring-slate-100">
          <div className="text-6xl">🎉🛰️</div>
          <p className="mt-3 text-lg font-extrabold text-indigo-700">All gadgets mastered!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {GADGETS.filter((v) => !mastered.has(v.id) || hiding.has(v.id)).map((v) => (
            <div
              key={v.id}
              className={hiding.has(v.id) ? "pointer-events-none scale-90 opacity-0" : ""}
              style={hiding.has(v.id) ? { transition: "opacity 400ms ease, transform 400ms ease" } : undefined}
            >
              <GadgetFlashcard data={v} mastered={mastered.has(v.id)} onMaster={master} onNotSure={unMaster} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ===== Lesson 5: Tech Actions speaking with 5-star scoring (+10 coins) =====
const TECH_ACTIONS = [
  { text: "upload a photo", emoji: "📤" },
  { text: "text a friend", emoji: "💬" },
  { text: "stream a video", emoji: "📺" },
  { text: "download a song", emoji: "⬇️" },
  { text: "charge a phone", emoji: "🔋" },
  { text: "log in", emoji: "🔐" },
  { text: "print a document", emoji: "🖨️" },
  { text: "search the internet", emoji: "🌐" },
];

function scoreSaid(target, said) {
  const norm = (s) =>
    s
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  const t = norm(target).split(" ").filter(Boolean);
  const s = norm(said).split(" ").filter(Boolean);
  const matchedTarget = t.map((w) => s.includes(w));
  const hits = matchedTarget.filter(Boolean).length;
  const pct = t.length ? Math.round((hits / t.length) * 100) : 0;
  return { pct, matchedTarget };
}

function TechPhraseSpeaking({ addCoins }) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [result, setResult] = useState(null);
  const recRef = useRef(null);
  const mrRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const finalRef = useRef("");
  const playRef = useRef(null);
  const ph = TECH_ACTIONS[idx];

  useEffect(
    () => () => {
      try {
        recRef.current?.stop();
      } catch {}
      try {
        mrRef.current?.state !== "inactive" && mrRef.current?.stop();
      } catch {}
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    },
    [],
  );

  async function startRec() {
    setTranscript("");
    setResult(null);
    finalRef.current = "";
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = ["audio/webm", "audio/mp4"].find((t) => MediaRecorder.isTypeSupported(t)) || "";
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data?.size) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        if (blob.size > 0) setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      mrRef.current = rec;
    } catch {
      alert("Please allow microphone access 🎤");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const r = new SR();
      r.lang = "en-US";
      r.continuous = true;
      r.interimResults = true;
      r.onresult = (ev) => {
        let interim = "";
        for (let i = ev.resultIndex; i < ev.results.length; i++) {
          const res = ev.results[i];
          if (res.isFinal) finalRef.current += " " + res[0].transcript;
          else interim += res[0].transcript;
        }
        setTranscript((finalRef.current + " " + interim).trim());
      };
      try {
        r.start();
        recRef.current = r;
      } catch {}
    }
    setPhase("recording");
  }
  function stopRec() {
    try {
      recRef.current?.stop();
    } catch {}
    try {
      mrRef.current?.stop();
    } catch {}
    setTimeout(() => {
      const said = (finalRef.current || transcript || "").trim();
      const { pct, matchedTarget } = scoreSaid(ph.text, said);
      let stars = 1;
      if (pct > 85) stars = 5;
      else if (pct >= 50) stars = 3;
      setResult({ pct, stars, matchedTarget, said });
      if (stars === 5) {
        addCoins?.(10);
        try {
          confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
        } catch {}
      }
      setPhase("scored");
    }, 350);
  }
  function next() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setResult(null);
    setTranscript("");
    finalRef.current = "";
    setPhase("idle");
    setIdx((i) => (i + 1) % TECH_ACTIONS.length);
  }
  function retry() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setResult(null);
    setTranscript("");
    finalRef.current = "";
    setPhase("idle");
  }
  function playMyVoice() {
    if (!audioUrl) return;
    if (!playRef.current) playRef.current = new Audio(audioUrl);
    else playRef.current.src = audioUrl;
    playRef.current.currentTime = 0;
    playRef.current.play().catch(() => {});
  }

  const targetWords = ph.text.split(/\s+/);
  return (
    <div className="ac-fade">
      <div className="mb-3 flex items-center justify-center gap-1.5">
        {TECH_ACTIONS.map((_, i) => (
          <span
            key={i}
            className="h-2.5 rounded-full transition-all"
            style={{ width: i === idx ? 24 : 8, backgroundColor: i === idx ? "#a78bfa" : "#cbd5e1" }}
          />
        ))}
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100">
        <div className="flex flex-col items-center">
          <div className="grid h-24 w-24 place-items-center rounded-3xl bg-slate-50 text-6xl shadow-inner">
            {ph.emoji}
          </div>
          <p className="mt-4 text-center text-xs font-extrabold uppercase tracking-wide text-slate-400">
            Say the action
          </p>
          <p className="mt-1 text-center text-2xl font-black text-indigo-700">"{ph.text}"</p>
          <button
            onClick={() => speak(ph.text)}
            className="mt-3 flex items-center gap-1.5 rounded-full bg-indigo-700 px-4 py-1.5 text-sm font-extrabold text-white shadow active:scale-95"
          >
            <Volume2 size={16} /> Hear it
          </button>
        </div>
        <div className="mt-6 flex flex-col items-center">
          {phase === "idle" && (
            <>
              <button
                onClick={startRec}
                className="grid h-16 w-16 place-items-center rounded-full text-white shadow-xl animate-bounce active:scale-95"
                style={{ background: "linear-gradient(135deg,#ec4899,#8b5cf6)" }}
                aria-label="Record"
              >
                <Mic size={28} />
              </button>
              <p className="mt-2 text-sm font-extrabold text-indigo-700">Tap & say the phrase!</p>
            </>
          )}
          {phase === "recording" && (
            <>
              <div className="flex h-20 items-center gap-1.5 rounded-3xl bg-pink-50 px-6 ring-2 ring-pink-200">
                {[0, 1, 2, 3, 4, 5, 6].map((b) => (
                  <span
                    key={b}
                    className="w-1.5 rounded-full"
                    style={{
                      height: 10 + ((b * 7 + idx * 3) % 30),
                      backgroundColor: "#ec4899",
                      animation: `gr-eq .9s ${b * 0.08}s ease-in-out infinite alternate`,
                    }}
                  />
                ))}
              </div>
              <button
                onClick={stopRec}
                className="mt-4 rounded-full bg-slate-900 px-5 py-2 text-sm font-extrabold text-white shadow active:scale-95"
              >
                ⏹ Stop
              </button>
              {transcript && <p className="mt-3 text-center text-sm italic text-slate-500">"{transcript}"</p>}
            </>
          )}
          {phase === "scored" && result && (
            <div className="w-full">
              <div className="flex justify-center gap-1 text-3xl">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} style={{ color: s <= result.stars ? "#F5B301" : "#e2e8f0" }}>
                    ★
                  </span>
                ))}
              </div>
              <p
                className="mt-2 text-center text-lg font-black"
                style={{ color: result.stars === 5 ? "#16a34a" : result.stars === 3 ? "#004088" : "#E81820" }}
              >
                {result.stars === 5
                  ? "Perfect! +10 coins 🎉"
                  : result.stars === 3
                    ? "Good try! Listen and repeat 👂"
                    : "Try again! 💪"}
              </p>
              <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-center">
                <p className="mb-1 text-[11px] font-extrabold uppercase text-slate-400">Target</p>
                <p className="text-lg font-black">
                  {targetWords.map((w, i) => (
                    <span key={i} style={{ color: result.matchedTarget[i] ? "#16a34a" : "#E81820" }}>
                      {w}{" "}
                    </span>
                  ))}
                </p>
                <p className="mt-2 text-[11px] font-extrabold uppercase text-slate-400">You said</p>
                <p className="text-sm italic text-slate-600">"{result.said || "—"}"</p>
                <p className="mt-2 text-xs font-bold text-slate-500">Match: {result.pct}%</p>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {audioUrl && (
                  <button
                    onClick={playMyVoice}
                    className="rounded-full bg-white px-4 py-2 text-sm font-extrabold text-indigo-700 shadow ring-1 ring-slate-200"
                  >
                    🎧 Play My Voice
                  </button>
                )}
                <button
                  onClick={retry}
                  className="rounded-full bg-pink-500 px-4 py-2 text-sm font-extrabold text-white shadow"
                >
                  Retry
                </button>
                <button
                  onClick={next}
                  className="rounded-full bg-indigo-700 px-4 py-2 text-sm font-extrabold text-white shadow"
                >
                  Next phrase →
                </button>
              </div>
            </div>
          )}
        </div>
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
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300">
          Planet 1 · Vocabulary Orbit
        </p>
        <p className="text-xl font-black text-white">📚 Gadget Galaxy</p>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        {[
          { k: "l1", t: "Lesson 1 · Flashcards" },
          { k: "l5", t: "Lesson 5 · Speaking" },
        ].map((x) => (
          <button
            key={x.k}
            onClick={() => setTab(x.k)}
            className={`rounded-full px-3 py-2 text-xs font-black transition ${tab === x.k ? "text-slate-900" : "text-white"}`}
            style={
              tab === x.k
                ? { background: "linear-gradient(135deg,#67e8f9,#a78bfa)", boxShadow: "0 0 14px #a78bfa88" }
                : { background: "rgba(255,255,255,.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.18)" }
            }
          >
            {x.t}
          </button>
        ))}
      </div>
      {tab === "l1" ? <GadgetFlashcardGrid addCoins={addCoins} /> : <TechPhraseSpeaking addCoins={addCoins} />}
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
      setFlash("ok");
      setFuel((f) => Math.min(4, f + 1));
      setTimeout(() => {
        setFlash(null);
        if (idx + 1 >= FUEL_QUESTIONS.length) {
          setLaunched(true);
          if (!awarded.current) {
            awarded.current = true;
            addCoins?.(15);
            try {
              confetti({ particleCount: 160, spread: 90, startVelocity: 55, origin: { y: 0.6 } });
            } catch {}
          }
          setTimeout(() => setDone(true), 2200);
        } else {
          setIdx((n) => n + 1);
        }
      }, 600);
    } else {
      setFlash("bad");
      setStability((s) => Math.max(0, s - 25));
      setTimeout(() => setFlash(null), 600);
    }
  }
  function retry() {
    setIdx(0);
    setFuel(0);
    setStability(100);
    setLaunched(false);
    setDone(false);
    awarded.current = false;
  }

  const q = FUEL_QUESTIONS[idx];
  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#a78bfa" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #a78bfa66" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-violet-300">
          Planet 2 · Grammar Black Hole
        </p>
        <p className="text-xl font-black text-white">🚀 Rocket Fuel: Past Continuous</p>
        <p className="text-[11px] font-bold text-indigo-200">Fuel the rocket with the correct grammar crystal!</p>
      </div>

      {/* Rocket scene */}
      <div
        className="relative mb-3 overflow-hidden rounded-3xl p-4 ring-1 ring-white/15"
        style={{ background: "linear-gradient(180deg,#020617,#1e1b4b 60%,#4c1d95)", minHeight: 220 }}
      >
        {/* stars */}
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="gx-star"
            style={{
              position: "absolute",
              top: `${(i * 37) % 100}%`,
              left: `${(i * 53) % 100}%`,
              width: 2,
              height: 2,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
        <div className="relative mx-auto flex h-44 w-24 items-end justify-center">
          <div
            style={{
              position: "absolute",
              bottom: launched ? 220 : 8,
              left: "50%",
              transform: "translateX(-50%)",
              transition: "bottom 2.2s cubic-bezier(.55,.05,.3,1)",
              fontSize: 72,
              filter: "drop-shadow(0 0 12px #a78bfa)",
            }}
          >
            🚀
          </div>
          {/* flame */}
          <div
            style={{
              position: "absolute",
              bottom: launched ? 200 : -6,
              left: "50%",
              transform: "translateX(-50%)",
              transition: "bottom 2.2s cubic-bezier(.55,.05,.3,1)",
              fontSize: 32 + fuel * 6,
              filter: `drop-shadow(0 0 ${8 + fuel * 4}px #fb923c)`,
              opacity: fuel === 0 ? 0.3 : 1,
            }}
          >
            🔥
          </div>
          {flash === "bad" && (
            <div className="absolute inset-x-0 bottom-0 text-center text-3xl" style={{ opacity: 0.9 }}>
              💨
            </div>
          )}
        </div>
        {/* gauges */}
        <div className="mt-2 grid grid-cols-2 gap-3 text-xs font-bold text-white">
          <div>
            <p className="mb-1 text-cyan-300">Fuel</p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full transition-all"
                style={{ width: `${(fuel / 4) * 100}%`, background: "linear-gradient(90deg,#22d3ee,#a78bfa)" }}
              />
            </div>
          </div>
          <div>
            <p className="mb-1 text-rose-300">Engine stability</p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full transition-all"
                style={{
                  width: `${stability}%`,
                  background:
                    stability > 50
                      ? "linear-gradient(90deg,#34d399,#22d3ee)"
                      : "linear-gradient(90deg,#fb923c,#f43f5e)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {!done ? (
        <div className="rounded-3xl gx-glass p-4">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-300">
            Question {idx + 1} / {FUEL_QUESTIONS.length}
          </p>
          <p className="mt-1 text-base font-black text-white">{q.q}</p>
          <div className="mt-3 grid gap-2">
            {q.choices.map((c, i) => (
              <button
                key={i}
                onClick={() => pick(i)}
                disabled={!!flash || launched}
                className="rounded-2xl px-3 py-3 text-left text-sm font-black text-white transition hover:scale-[1.02] active:scale-95 disabled:opacity-70"
                style={{
                  background: "linear-gradient(135deg,#0ea5e9,#6366f1)",
                  boxShadow: "0 0 12px #6366f188, inset 0 0 0 1px #a78bfa55",
                }}
              >
                <span className="mr-2">💎</span>
                {c}
              </button>
            ))}
          </div>
          {flash === "ok" && (
            <p className="mt-3 text-center text-sm font-black text-emerald-300">⚡ Fuel injected! +10 pts</p>
          )}
          {flash === "bad" && (
            <p className="mt-3 text-center text-sm font-black text-rose-300">💨 Wrong crystal! Stability dropped.</p>
          )}
        </div>
      ) : (
        <div className="rounded-3xl gx-glass p-5 text-center" style={{ boxShadow: "0 0 22px #22d3ee" }}>
          <p className="text-2xl font-black text-white">🎆 Mission complete!</p>
          <p className="mt-1 text-sm font-bold text-indigo-200">Rocket launched into deep space. +15 coins awarded!</p>
          <div className="mt-3 flex justify-center gap-2">
            <button
              onClick={retry}
              className="rounded-full px-4 py-2 text-sm font-black text-slate-900"
              style={{ background: "linear-gradient(135deg,#67e8f9,#a78bfa)", boxShadow: "0 0 14px #a78bfa88" }}
            >
              Replay
            </button>
            <button
              onClick={onBack}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white ring-1 ring-white/20"
            >
              Back
            </button>
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
    if (!SR) {
      setResult("no");
      setHeard("(Speech not supported)");
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 3;
    rec.onresult = (e) => {
      const txt = Array.from(e.results[0])
        .map((r) => r.transcript.toLowerCase())
        .join(" | ");
      setHeard(txt);
      const norm = (s) =>
        s
          .toLowerCase()
          .replace(/[^a-z ]/g, "")
          .replace(/\s+/g, " ")
          .trim();
      const target = norm(phrase);
      const targetWords = target.split(" ").filter(Boolean);
      const ok = txt.split(" | ").some((alt) => {
        const a = norm(alt);
        if (a.includes(target)) return true;
        const hits = targetWords.filter((w) => a.includes(w)).length;
        return hits / targetWords.length >= 0.7;
      });
      setResult(ok ? "ok" : "no");
      if (ok && !awarded.current.has(idx)) {
        awarded.current.add(idx);
        addCoins?.(3);
      }
    };
    rec.onerror = () => setResult("no");
    rec.onend = () => setListening(false);
    setHeard("");
    setResult(null);
    setListening(true);
    try {
      rec.start();
    } catch {
      setListening(false);
    }
  }

  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#ec4899" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #ec489966" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-pink-300">Planet 3 · AI Voice Nebula</p>
        <p className="text-xl font-black text-white">🌌 Past Continuous Speaking</p>
      </div>
      <div className="rounded-3xl gx-glass p-4">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-300">
          {idx + 1} / {VOICE_PROMPTS_U2.length}
        </p>
        <div className="mt-2 rounded-2xl bg-white/5 p-4 text-center ring-1 ring-white/10">
          <p className="text-xl font-black text-white">"{phrase}"</p>
        </div>
        <div className="mt-3 flex items-center justify-center gap-3">
          <button
            onClick={start}
            disabled={listening}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-white shadow-lg disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#ec4899,#8b5cf6)", boxShadow: "0 0 18px #ec489966" }}
          >
            <Mic size={16} /> {listening ? "Listening…" : "Speak"}
          </button>
          <button
            onClick={() => speak(phrase)}
            className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-black text-cyan-200 ring-1 ring-white/20 hover:bg-white/20"
          >
            <Volume2 size={14} /> Play My Voice 🎧
          </button>
        </div>
        {heard && (
          <p className="mt-3 text-center text-xs text-indigo-200">
            Heard: <span className="font-bold text-white">{heard}</span>
          </p>
        )}
        {result && (
          <div
            className={`mt-3 rounded-xl p-2 text-center text-sm font-extrabold ${result === "ok" ? "text-emerald-200" : "text-rose-200"}`}
            style={{ background: result === "ok" ? "rgba(16,185,129,.15)" : "rgba(244,63,94,.15)" }}
          >
            {result === "ok" ? "🌟 Stellar speaking! +3 coins" : "Try again — speak the full sentence."}
          </div>
        )}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setIdx((i) => (i - 1 + VOICE_PROMPTS_U2.length) % VOICE_PROMPTS_U2.length)}
            className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white ring-1 ring-white/20"
          >
            ◀ Prev
          </button>
          <button
            onClick={() => {
              setIdx((i) => (i + 1) % VOICE_PROMPTS_U2.length);
              setResult(null);
              setHeard("");
            }}
            className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white ring-1 ring-white/20"
          >
            Next ▶
          </button>
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
        awarded.current = true;
        addCoins?.(15);
        try {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        } catch {}
        setDone(true);
      } else if (!allRight) {
        // allow retry
        setTimeout(() => {
          setAnswers({});
        }, 1200);
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
                <p className="text-sm font-black text-white">
                  {i + 1}. {x.q}
                </p>
                <div className="mt-2 flex gap-2">
                  {[true, false].map((v) => {
                    const isPick = chosen === v;
                    const isRight = showFeedback && v === correct;
                    const isWrong = showFeedback && isPick && v !== correct;
                    return (
                      <button
                        key={String(v)}
                        onClick={() => pick(i, v)}
                        className="flex-1 rounded-full px-3 py-1.5 text-xs font-black text-white transition active:scale-95"
                        style={{
                          background: isRight
                            ? "linear-gradient(135deg,#10b981,#34d399)"
                            : isWrong
                              ? "linear-gradient(135deg,#f43f5e,#fb7185)"
                              : "rgba(255,255,255,.08)",
                          boxShadow: isPick ? "0 0 14px #22d3ee88" : "inset 0 0 0 1px rgba(255,255,255,.18)",
                        }}
                      >
                        {v ? (
                          <>
                            <Check size={12} className="inline" /> True
                          </>
                        ) : (
                          <>
                            <X size={12} className="inline" /> False
                          </>
                        )}
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
// PLANET 5 — Supernova Quiz Arena (Unit 2)
// Mode A: Phonics Rocket (oi / oy) · Mode B: Alien Trivia Quest
// =================================================================
const PHONICS_ITEMS = [
  { puzzle: "c _ _ n", word: "coin", sound: "oi" },
  { puzzle: "s _ _ l", word: "soil", sound: "oi" },
  { puzzle: "p _ _ nt", word: "point", sound: "oi" },
  { puzzle: "b _ _", word: "boy", sound: "oy" },
  { puzzle: "t _ _", word: "toy", sound: "oy" },
  { puzzle: "j _ _", word: "joy", sound: "oy" },
];
function PhonicsRocket({ addCoins }) {
  const [queue, setQueue] = useState(() => shuffle(PHONICS_ITEMS));
  const [pos, setPos] = useState(0);
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState(null); // {ok, target}
  const [done, setDone] = useState(false);
  const cur = queue[pos];
  function pick(sound) {
    if (flash || done) return;
    const ok = sound === cur.sound;
    setFlash({ ok, target: sound });
    if (ok) {
      setScore((s) => s + 1);
      addCoins?.(2);
    }
    setTimeout(() => {
      setFlash(null);
      if (pos + 1 >= queue.length) {
        setDone(true);
        try {
          confetti({ particleCount: 130, spread: 80, origin: { y: 0.6 } });
        } catch {}
      } else setPos((p) => p + 1);
    }, 700);
  }
  function reset() {
    setQueue(shuffle(PHONICS_ITEMS));
    setPos(0);
    setScore(0);
    setDone(false);
    setFlash(null);
  }
  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs font-bold text-indigo-200">
        <span>
          Word {Math.min(pos + 1, queue.length)} / {queue.length}
        </span>
        <span>
          Correct: <b className="text-white">{score}</b>
        </span>
        <button
          onClick={reset}
          className="rounded-full bg-white/10 px-3 py-1 font-black text-cyan-200 ring-1 ring-white/20"
        >
          Reset
        </button>
      </div>
      {!done ? (
        <>
          <div className="rounded-3xl gx-glass p-5 text-center" style={{ boxShadow: "0 0 18px #22d3ee44" }}>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-300">
              Fill the missing phonics
            </p>
            <p className="mt-2 text-4xl font-black tracking-widest text-white">{cur.puzzle}</p>
            <p className="mt-1 text-xs font-bold text-indigo-200">Tap the rocket that matches the missing sound.</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { id: "oi", grad: "linear-gradient(135deg,#06b6d4,#22d3ee)", glow: "#22d3ee" },
              { id: "oy", grad: "linear-gradient(135deg,#a78bfa,#ec4899)", glow: "#ec4899" },
            ].map((r) => {
              const showRight = flash && r.id === cur.sound;
              const showWrong = flash && r.id === flash.target && !flash.ok;
              return (
                <button
                  key={r.id}
                  onClick={() => pick(r.id)}
                  disabled={!!flash}
                  className="relative flex h-40 flex-col items-center justify-end rounded-3xl pb-4 text-white shadow-xl transition active:scale-95"
                  style={{ background: r.grad, boxShadow: `0 0 18px ${r.glow}88, inset 0 0 0 1px ${r.glow}` }}
                >
                  <div className="text-6xl" style={{ filter: `drop-shadow(0 0 10px ${r.glow})` }}>
                    🚀
                  </div>
                  <div className="mt-1 rounded-full bg-white/20 px-4 py-1 text-lg font-black tracking-widest">
                    -{r.id}-
                  </div>
                  {showRight && (
                    <div className="absolute inset-0 grid place-items-center rounded-3xl bg-emerald-500/35 text-5xl">
                      ✓
                    </div>
                  )}
                  {showWrong && (
                    <div className="absolute inset-0 grid place-items-center rounded-3xl bg-rose-500/35 text-5xl">
                      ✗
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {flash && (
            <p className="mt-3 text-center text-sm font-black" style={{ color: flash.ok ? "#34d399" : "#fda4af" }}>
              {flash.ok ? `🎉 ${cur.word} → /${cur.sound}/  +2 coins` : `Almost! It's "${cur.word}" → /${cur.sound}/`}
            </p>
          )}
        </>
      ) : (
        <div className="rounded-3xl gx-glass p-5 text-center" style={{ boxShadow: "0 0 22px #22d3ee" }}>
          <p className="text-2xl font-black text-white">🌠 Phonics Mission Complete!</p>
          <p className="mt-1 text-sm font-bold text-indigo-200">
            Score: {score}/{queue.length}
          </p>
          <button
            onClick={reset}
            className="mt-3 rounded-full px-4 py-2 text-sm font-black text-slate-900"
            style={{ background: "linear-gradient(135deg,#67e8f9,#a78bfa)", boxShadow: "0 0 14px #a78bfa88" }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

// ===== Mode B: Alien Trivia Quest with lifelines =====
const TRIVIA_QUESTIONS = [
  {
    q: "Which gadget lets you read books on a screen?",
    choices: ["e-reader", "smartwatch", "portable speaker", "digital camera"],
    correct: 0,
  },
  {
    q: "What do you call a small computer you can hold?",
    choices: ["tablet", "headphones", "printer", "campfire"],
    correct: 0,
  },
  {
    q: "She ___ a song when the Wi-Fi stopped.",
    choices: ["was downloading", "downloaded", "downloads", "is downloading"],
    correct: 0,
  },
  { q: "They ___ playing video games at 8 p.m.", choices: ["were", "was", "did", "are"], correct: 0 },
  {
    q: "Which device plays music out loud?",
    choices: ["portable speaker", "e-reader", "tablet", "laptop"],
    correct: 0,
  },
  { q: "What ___ you doing when I called?", choices: ["were", "was", "did", "are"], correct: 0 },
  {
    q: "Pick the correct past continuous: ",
    choices: ["I was texting a friend.", "I am text a friend.", "I text a friend.", "I texted a friend yesterday."],
    correct: 0,
  },
  { q: "Which word has the /oy/ sound?", choices: ["joy", "soil", "coin", "point"], correct: 0 },
];
function AlienTrivia({ addCoins }) {
  const [pool] = useState(() => shuffle(TRIVIA_QUESTIONS));
  const [idx, setIdx] = useState(0);
  const [pick, setPick] = useState(null);
  const [killed, setKilled] = useState(new Set()); // indexes killed by 50:50
  const [fiftyLeft, setFiftyLeft] = useState(1);
  const [shieldLeft, setShieldLeft] = useState(1);
  const [shieldArmed, setShieldArmed] = useState(false);
  const [hearts, setHearts] = useState(3);
  const [done, setDone] = useState(null); // 'win' | 'lose'
  const awarded = useRef(false);
  const q = pool[idx];
  function choose(i) {
    if (pick !== null || done) return;
    setPick(i);
    const ok = i === q.correct;
    if (!ok) {
      if (shieldArmed) {
        setShieldArmed(false);
        setTimeout(() => nextQ(true), 1100);
        return;
      }
      setHearts((h) => {
        const nh = h - 1;
        if (nh <= 0) setTimeout(() => setDone("lose"), 900);
        return nh;
      });
    }
    setTimeout(() => nextQ(ok), 1000);
  }
  function nextQ(ok) {
    if (idx + 1 >= pool.length) {
      if (!awarded.current && hearts > 0) {
        awarded.current = true;
        addCoins?.(30);
        try {
          confetti({ particleCount: 220, spread: 110, startVelocity: 60, origin: { y: 0.6 } });
        } catch {}
        setDone("win");
      }
      return;
    }
    setIdx((n) => n + 1);
    setPick(null);
    setKilled(new Set());
  }
  function useFifty() {
    if (fiftyLeft <= 0 || pick !== null) return;
    const wrongs = q.choices.map((_, i) => i).filter((i) => i !== q.correct);
    const kill = shuffle(wrongs).slice(0, 2);
    setKilled(new Set(kill));
    setFiftyLeft((n) => n - 1);
  }
  function useShield() {
    if (shieldLeft <= 0 || shieldArmed || pick !== null) return;
    setShieldArmed(true);
    setShieldLeft((n) => n - 1);
  }
  function restart() {
    setIdx(0);
    setPick(null);
    setKilled(new Set());
    setFiftyLeft(1);
    setShieldLeft(1);
    setShieldArmed(false);
    setHearts(3);
    setDone(null);
    awarded.current = false;
  }

  if (done === "win")
    return (
      <div className="rounded-3xl gx-glass p-6 text-center" style={{ boxShadow: "0 0 28px #facc15" }}>
        <div className="text-5xl">🛸✨👨‍🚀</div>
        <p className="mt-2 text-2xl font-black text-white">Astronaut Rescued!</p>
        <p className="mt-1 text-sm font-bold text-indigo-200">+30 coins secured. Mission victory!</p>
        <button
          onClick={restart}
          className="mt-4 rounded-full px-4 py-2 text-sm font-black text-slate-900"
          style={{ background: "linear-gradient(135deg,#fde047,#facc15)", boxShadow: "0 0 14px #facc15" }}
        >
          Play Again
        </button>
      </div>
    );
  if (done === "lose")
    return (
      <div className="rounded-3xl gx-glass p-6 text-center" style={{ boxShadow: "0 0 22px #f43f5e88" }}>
        <div className="text-5xl">💥</div>
        <p className="mt-2 text-2xl font-black text-white">Mission Failed</p>
        <p className="mt-1 text-sm font-bold text-rose-200">The alien fleet won this round. Try again, cadet!</p>
        <button
          onClick={restart}
          className="mt-4 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white ring-1 ring-white/20"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs font-bold text-indigo-200">
        <span>
          Question {idx + 1} / {pool.length}
        </span>
        <span>
          {"❤️".repeat(hearts)}
          {"🖤".repeat(3 - hearts)}
        </span>
      </div>
      <div className="rounded-3xl gx-glass p-4" style={{ boxShadow: "0 0 18px #a78bfa55" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-300">🛸 Alien Trivia Quest</p>
        <p className="mt-1 text-base font-black text-white">{q.q}</p>
        <div className="mt-3 grid gap-2">
          {q.choices.map((c, i) => {
            const isPick = pick === i;
            const showRight = pick !== null && i === q.correct;
            const showWrong = isPick && i !== q.correct;
            const isKilled = killed.has(i);
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={isKilled || pick !== null}
                className="rounded-2xl px-3 py-3 text-left text-sm font-black text-white transition active:scale-95 disabled:opacity-30"
                style={{
                  background: showRight
                    ? "linear-gradient(135deg,#10b981,#34d399)"
                    : showWrong
                      ? "linear-gradient(135deg,#f43f5e,#fb7185)"
                      : "linear-gradient(135deg,#1e1b4b,#4c1d95)",
                  boxShadow: isPick ? "0 0 14px #22d3ee88" : "inset 0 0 0 1px #a78bfa55",
                  textDecoration: isKilled ? "line-through" : "none",
                }}
              >
                <span className="mr-2">{String.fromCharCode(65 + i)}.</span>
                {c}
              </button>
            );
          })}
        </div>
        {shieldArmed && (
          <p className="mt-3 text-center text-xs font-black text-cyan-200">
            🛡️ Cosmic Shield armed — one wrong answer will be blocked.
          </p>
        )}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={useFifty}
          disabled={fiftyLeft <= 0 || pick !== null}
          className="rounded-2xl px-3 py-3 text-xs font-black text-white transition active:scale-95 disabled:opacity-40"
          style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)", boxShadow: "0 0 14px #f59e0b88" }}
        >
          🔫 Laser Beam 50:50 <span className="ml-1 opacity-80">({fiftyLeft})</span>
        </button>
        <button
          onClick={useShield}
          disabled={shieldLeft <= 0 || shieldArmed || pick !== null}
          className="rounded-2xl px-3 py-3 text-xs font-black text-white transition active:scale-95 disabled:opacity-40"
          style={{ background: "linear-gradient(135deg,#06b6d4,#3b82f6)", boxShadow: "0 0 14px #06b6d488" }}
        >
          🛡️ Cosmic Shield <span className="ml-1 opacity-80">({shieldLeft})</span>
        </button>
      </div>
    </div>
  );
}

export function Planet5ArenaU2({ onBack, addCoins }) {
  const [mode, setMode] = useState("a"); // 'a' | 'b'
  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#facc15" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #facc1566" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300">
          Planet 5 · Supernova Quiz Arena
        </p>
        <p className="text-xl font-black text-white">🏆 Choose your challenge</p>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        {[
          { k: "a", t: "🚀 Phonics Rocket" },
          { k: "b", t: "🛸 Alien Trivia" },
        ].map((x) => (
          <button
            key={x.k}
            onClick={() => setMode(x.k)}
            className={`rounded-full px-3 py-2 text-xs font-black transition ${mode === x.k ? "text-slate-900" : "text-white"}`}
            style={
              mode === x.k
                ? { background: "linear-gradient(135deg,#fde047,#facc15)", boxShadow: "0 0 14px #facc15" }
                : { background: "rgba(255,255,255,.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.18)" }
            }
          >
            {x.t}
          </button>
        ))}
      </div>
      {mode === "a" ? <PhonicsRocket addCoins={addCoins} /> : <AlienTrivia addCoins={addCoins} />}
    </div>
  );
}

// =================================================================
// 🌌 LOCKED CURRICULUM DATA MATRIX — feeds AISpeakNebula + other planets
// =================================================================
export { CURRICULUM_DATA, getUnitData };

function normalizeWord(w) {
  return (w || "").toLowerCase().replace(/[^a-z0-9']/g, "");
}

// Locked framework component — UI/audio engine NEVER changes; only data swaps via `unit`.
export function AISpeakNebula({ onBack, addCoins, unit = 1, level = "level_5" }) {
  const sentences = getUnitData(unit, level).ai_speak;

  const [idx, setIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [result, setResult] = useState(null); // { stars, pct, matched:boolean[] }
  const [ttsOn, setTtsOn] = useState(false);

  const recRef = useRef(null);
  const mediaRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const finalRef = useRef("");
  const playbackRef = useRef(null);
  const awarded = useRef(new Set());

  const target = sentences[idx];
  const targetWords = target.split(/\s+/);

  useEffect(
    () => () => {
      try {
        recRef.current && recRef.current.stop();
      } catch {}
      try {
        mediaRef.current && mediaRef.current.state !== "inactive" && mediaRef.current.stop();
      } catch {}
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    },
    [],
  );

  function resetTrial() {
    setTranscript("");
    setResult(null);
    finalRef.current = "";
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  }

  function sayAloud() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(target);
    u.lang = "en-US";
    u.rate = 0.9;
    u.pitch = 1.05;
    u.onstart = () => setTtsOn(true);
    u.onend = () => setTtsOn(false);
    u.onerror = () => setTtsOn(false);
    synth.speak(u);
  }

  async function startRec() {
    resetTrial();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = ["audio/webm", "audio/mp4"].find((t) => MediaRecorder.isTypeSupported(t)) || "";
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        if (blob.size > 0) setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      mediaRef.current = rec;
    } catch {
      alert("Please allow microphone access to play! 🎤");
      return;
    }

    const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (SR) {
      const r = new SR();
      r.lang = "en-US";
      r.continuous = false;
      r.interimResults = true;
      r.onresult = (ev) => {
        let interim = "";
        for (let i = ev.resultIndex; i < ev.results.length; i++) {
          const res = ev.results[i];
          if (res.isFinal) finalRef.current += " " + res[0].transcript;
          else interim += res[0].transcript;
        }
        setTranscript((finalRef.current + " " + interim).trim());
      };
      r.onerror = () => {};
      try {
        r.start();
        recRef.current = r;
      } catch {}
    }
    setRecording(true);
  }

  function stopRec() {
    try {
      recRef.current && recRef.current.stop();
    } catch {}
    try {
      mediaRef.current && mediaRef.current.stop();
    } catch {}
    setRecording(false);
    setTimeout(() => {
      const said = (finalRef.current || transcript || "").trim();
      const saidWords = said.split(/\s+/).map(normalizeWord).filter(Boolean);
      const pool = saidWords.slice();
      const matched = targetWords.map((w) => {
        const n = normalizeWord(w);
        const i = pool.indexOf(n);
        if (i !== -1) {
          pool.splice(i, 1);
          return true;
        }
        return false;
      });
      const hits = matched.filter(Boolean).length;
      const pct = Math.round((hits / targetWords.length) * 100);
      let stars = 1;
      if (pct >= 90) stars = 5;
      else if (pct >= 80) stars = 4;
      else if (pct >= 60) stars = 3;
      else if (pct >= 40) stars = 2;
      setResult({ stars, pct, matched });
      if (pct > 80 && !awarded.current.has(idx)) {
        awarded.current.add(idx);
        try {
          confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
        } catch {}
        addCoins?.(10);
      }
    }, 380);
  }

  function playMyVoice() {
    if (!audioUrl) return;
    if (!playbackRef.current) playbackRef.current = new Audio(audioUrl);
    else playbackRef.current.src = audioUrl;
    playbackRef.current.currentTime = 0;
    playbackRef.current.play().catch(() => {});
  }

  function go(dir) {
    setIdx((i) => (i + dir + sentences.length) % sentences.length);
    resetTrial();
  }

  return (
    <div className="ac-fade">
      {/* Back */}
      <button
        onClick={onBack}
        className="mb-3 inline-flex items-center gap-2 rounded-full gx-glass px-3 py-1.5 text-xs font-black text-white transition hover:scale-105 active:scale-95"
        style={{ boxShadow: "0 0 14px #22d3ee66, inset 0 0 0 1px #22d3ee55" }}
      >
        <ArrowLeft size={14} /> Fly Back to Galaxy
      </button>

      {/* Title */}
      <div className="mb-4 rounded-3xl gx-glass p-4 text-center" style={{ boxShadow: "0 0 22px #ec489966" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-pink-300">Planet 3 · AI Voice Nebula</p>
        <p className="text-xl font-black text-white">🌌 Speak Into the Cosmos</p>
      </div>

      {/* Carousel + target */}
      <div className="rounded-3xl gx-glass p-5" style={{ boxShadow: "0 0 28px rgba(139,92,246,.35)" }}>
        <div className="mb-3 flex items-center justify-between text-xs font-black text-cyan-200">
          <button
            onClick={() => go(-1)}
            className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/20 hover:bg-white/20"
          >
            ◀ Previous
          </button>
          <span className="text-indigo-200">
            Sentence {idx + 1} / {sentences.length}
          </span>
          <button
            onClick={() => go(1)}
            className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/20 hover:bg-white/20"
          >
            Next ▶
          </button>
        </div>

        <div
          className="relative rounded-3xl p-6 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(236,72,153,.12), rgba(139,92,246,.12), rgba(34,211,238,.12))",
            boxShadow:
              "0 0 0 3px rgba(244,114,182,.55), 0 0 28px rgba(244,114,182,.55), inset 0 0 24px rgba(139,92,246,.25)",
          }}
        >
          <div className="flex items-start justify-center gap-3">
            <p className="text-2xl font-black leading-snug text-white sm:text-3xl">
              {result
                ? targetWords.map((w, i) => (
                    <span
                      key={i}
                      style={{
                        color: result.matched[i] ? "#34d399" : "#fb7185",
                        textShadow: result.matched[i] ? "0 0 10px #34d399" : "0 0 10px #fb7185",
                      }}
                    >
                      {w}
                      {i < targetWords.length - 1 ? " " : ""}
                    </span>
                  ))
                : `"${target}"`}
            </p>
            <button
              onClick={sayAloud}
              className="mt-1 shrink-0 rounded-full p-2 text-cyan-200 ring-1 ring-cyan-300/40 hover:bg-white/10"
              title="Listen"
            >
              <Volume2 size={20} className={ttsOn ? "ac-pop" : ""} />
            </button>
          </div>
        </div>

        {/* Giant Mic */}
        <div className="mt-6 flex flex-col items-center">
          <button
            onClick={recording ? stopRec : startRec}
            className="relative grid h-28 w-28 place-items-center rounded-full transition-transform hover:scale-105 active:scale-95"
            style={{
              background: recording
                ? "radial-gradient(circle at 30% 30%, #fda4af, #e11d48 60%, #881337)"
                : "radial-gradient(circle at 30% 30%, #67e8f9, #06b6d4 55%, #0e7490)",
              boxShadow: recording
                ? "0 0 0 6px rgba(244,63,94,.25), 0 0 38px rgba(244,63,94,.85)"
                : "0 0 0 6px rgba(34,211,238,.18), 0 0 26px rgba(34,211,238,.65)",
              animation: "csnFloat 3.4s ease-in-out infinite",
            }}
          >
            {recording && (
              <>
                <span
                  className="absolute inset-0 rounded-full"
                  style={{ animation: "csnHalo 1.2s ease-out infinite", boxShadow: "0 0 0 0 rgba(244,63,94,.55)" }}
                />
                <span
                  className="absolute inset-0 rounded-full"
                  style={{ animation: "csnHalo 1.2s ease-out .35s infinite", boxShadow: "0 0 0 0 rgba(244,63,94,.45)" }}
                />
              </>
            )}
            <Mic size={42} className="text-white drop-shadow" />
          </button>
          <p className="mt-2 text-xs font-black uppercase tracking-widest text-indigo-100">
            {recording ? "Listening… tap to stop" : "Tap to speak"}
          </p>
        </div>

        {/* Live transcript box */}
        <div
          className="mt-5 min-h-[64px] rounded-2xl p-4 text-center"
          style={{
            background: "rgba(15,23,42,.55)",
            backdropFilter: "blur(10px)",
            boxShadow: "inset 0 0 0 1px rgba(34,211,238,.35), 0 0 18px rgba(34,211,238,.25)",
          }}
        >
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-300">Live transcript</p>
          <p className="mt-1 text-base font-bold text-white">
            {transcript || <span className="text-slate-400">Your words will appear here…</span>}
          </p>
        </div>

        {/* Feedback */}
        {result && (
          <div className="mt-5 flex flex-col items-center gap-3">
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="text-3xl transition-transform"
                  style={{
                    transform: i < result.stars ? "scale(1.15)" : "scale(.9)",
                    filter: i < result.stars ? "drop-shadow(0 0 10px #fde047)" : "grayscale(1) opacity(.4)",
                  }}
                >
                  ⭐
                </span>
              ))}
            </div>
            <p className="text-sm font-black text-white">
              Accuracy: <span style={{ color: result.pct > 80 ? "#34d399" : "#fbbf24" }}>{result.pct}%</span>
              {result.pct > 80 && <span className="ml-2 text-emerald-300">+10 cosmic coins!</span>}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={playMyVoice}
                disabled={!audioUrl}
                className="rounded-full px-4 py-2 text-sm font-black text-white shadow-lg disabled:opacity-50"
                style={{ background: "linear-gradient(135deg,#22d3ee,#8b5cf6)", boxShadow: "0 0 18px #22d3ee66" }}
              >
                Play My Voice 🎧
              </button>
              <button
                onClick={resetTrial}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white ring-1 ring-white/20 hover:bg-white/20"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes csnFloat { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
        @keyframes csnHalo  { 0% { box-shadow: 0 0 0 0 rgba(244,63,94,.55) } 100% { box-shadow: 0 0 0 28px rgba(244,63,94,0) } }
      `}</style>
    </div>
  );
}

// =================================================================
// ☄️ UNIT 3 — Surprise! / Daily Life · planet components
// Reuse exact framework housings; only data + dynamic game modes swap.
// =================================================================

// ---------- PLANET 1 U3: Daily Action flashcards + Lesson 5 speaking ----------
function DailyActionFlashcards({ addCoins, unit = 3, level = "level_5" }) {
  const unitData = getUnitData(unit, level);
  const items = unitData.vocabulary.lesson_1;
  const formToggleLabel = unitData.formToggleLabel || "Alt Form";
  const [mastered, setMastered] = useState(() => new Set());
  const [tense, setTense] = useState({}); // id -> 'alt'
  const [meaning, setMeaning] = useState({}); // id -> true
  function toggle(i) {
    setTense((p) => ({ ...p, [i]: p[i] === "alt" ? "base" : "alt" }));
  }
  function toggleMeaning(i) {
    setMeaning((p) => ({ ...p, [i]: !p[i] }));
  }
  function speakSlow(text) {
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 0.5;
      window.speechSynthesis?.cancel();
      window.speechSynthesis?.speak(u);
    } catch {}
  }
  function master(i) {
    if (mastered.has(i)) return;
    setMastered((p) => {
      const n = new Set(p);
      n.add(i);
      addCoins?.(2);
      if (n.size === items.length) {
        try {
          confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });
        } catch {}
      }
      return n;
    });
  }
  function unMaster(i) {
    setMastered((p) => {
      const n = new Set(p);
      n.delete(i);
      return n;
    });
  }
  return (
    <>
      <div className="mb-3 rounded-3xl gx-glass p-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-extrabold text-white">Daily Actions progress</p>
          <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-extrabold text-slate-900">
            {mastered.size}/{items.length} mastered
          </span>
        </div>
        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(mastered.size / items.length) * 100}%`,
              background: "linear-gradient(90deg,#f59e0b,#ec4899)",
            }}
          />
        </div>
      </div>
      {mastered.size === items.length ? (
        <div className="ac-fade rounded-3xl gx-glass p-8 text-center">
          <div className="text-6xl">☄️🎉</div>
          <p className="mt-3 text-lg font-extrabold text-amber-300">All daily actions mastered!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.map((v, i) => {
            if (mastered.has(i)) return null;
            const showAlt = tense[i] === "alt" && !!v.alt;
            const phrase = showAlt ? v.alt : v.word;
            const hasAlt = !!v.alt;
            return (
              <div key={i} className="overflow-hidden rounded-3xl gx-glass shadow-lg ring-1 ring-white/10">
                <div
                  className="relative flex items-center justify-center py-4"
                  style={{
                    background: showAlt
                      ? "linear-gradient(135deg,#8b5cf6,#ec4899)"
                      : "linear-gradient(135deg,#f59e0b,#fbbf24)",
                  }}
                >
                  <div className="grid h-16 w-28 place-items-center rounded-2xl bg-white/90 text-4xl shadow-inner">
                    {v.emoji}
                  </div>
                  {showAlt && (
                    <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-extrabold text-purple-700 shadow">
                      ALT ⚡
                    </span>
                  )}
                </div>
                <div className="px-3 pb-3 pt-3">
                  <p
                    key={phrase}
                    className="ac-fade min-h-12 text-center text-base font-extrabold leading-tight text-white"
                  >
                    {phrase}
                  </p>
                  <div className="mt-1 min-h-7 text-center">
                    {meaning[i] ? (
                      <p
                        className="ac-fade rounded-xl bg-white/15 px-2 py-1 text-sm font-bold text-amber-100 ring-1 ring-amber-300/40"
                        style={{ boxShadow: "0 0 10px #fbbf2455" }}
                      >
                        {v.vn}
                      </p>
                    ) : (
                      <span className="text-sm text-white/30">• • •</span>
                    )}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => toggleMeaning(i)}
                      className="flex items-center justify-center gap-1 rounded-2xl bg-white/10 py-2 text-white transition active:scale-95 ring-1 ring-white/20"
                    >
                      <span className="text-[11px] font-bold">{meaning[i] ? "👁️ Hide" : "👁️ Nghĩa từ"}</span>
                    </button>
                    {hasAlt ? (
                      <button
                        onClick={() => toggle(i)}
                        className={`flex items-center justify-center gap-1 rounded-2xl py-2 transition active:scale-95 ${showAlt ? "bg-purple-500 text-white" : "bg-amber-400/30 text-amber-100 ring-1 ring-amber-300/40"}`}
                      >
                        <span className="text-[11px] font-bold">{formToggleLabel}</span>
                      </button>
                    ) : (
                      <div className="rounded-2xl bg-white/5 py-2 text-center text-[11px] font-bold text-white/40 ring-1 ring-white/10">
                        — No form —
                      </div>
                    )}
                  </div>
                  <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => speak(phrase)}
                      className="flex items-center justify-center gap-1 rounded-2xl bg-cyan-500/20 py-2 text-cyan-200 transition active:scale-95 ring-1 ring-cyan-400/30"
                    >
                      <Volume2 size={14} />
                      <span className="text-[11px] font-bold">🔊 Listen</span>
                    </button>
                    <button
                      onClick={() => speakSlow(phrase)}
                      className="flex items-center justify-center gap-1 rounded-2xl bg-amber-500/20 py-2 text-amber-100 transition active:scale-95 ring-1 ring-amber-300/40"
                    >
                      <Volume2 size={14} />
                      <span className="text-[11px] font-bold">🐌 Slow</span>
                    </button>
                  </div>
                  <button
                    onClick={() => master(i)}
                    className="mt-2 w-full rounded-2xl py-2 text-xs font-extrabold text-white transition active:scale-95"
                    style={{ background: "linear-gradient(90deg,#10b981,#22d3ee)", boxShadow: "0 0 12px #10b98166" }}
                  >
                    Mastered 🎉
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {mastered.size > 0 && mastered.size < items.length && (
        <div className="mt-3 flex flex-wrap gap-2">
          {[...mastered].map((i) => (
            <button
              key={i}
              onClick={() => unMaster(i)}
              className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-black text-white ring-1 ring-white/20"
            >
              ↺ {items[i].word}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function DailyPhraseSpeaking({ addCoins, unit = 3, level = "level_5" }) {
  const phrases = getUnitData(unit, level).vocabulary.lesson_5.map((p) => ({ text: p, emoji: "🎙️" }));
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [result, setResult] = useState(null);
  const recRef = useRef(null);
  const mrRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const finalRef = useRef("");
  const playRef = useRef(null);
  const ph = phrases[idx];
  useEffect(
    () => () => {
      try {
        recRef.current?.stop();
      } catch {}
      try {
        mrRef.current?.state !== "inactive" && mrRef.current?.stop();
      } catch {}
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    },
    [],
  );
  async function startRec() {
    setTranscript("");
    setResult(null);
    finalRef.current = "";
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = ["audio/webm", "audio/mp4"].find((t) => MediaRecorder.isTypeSupported(t)) || "";
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data?.size) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        if (blob.size > 0) setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      mrRef.current = rec;
    } catch {
      alert("Please allow microphone access 🎤");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const r = new SR();
      r.lang = "en-US";
      r.continuous = true;
      r.interimResults = true;
      r.onresult = (ev) => {
        let interim = "";
        for (let i = ev.resultIndex; i < ev.results.length; i++) {
          const res = ev.results[i];
          if (res.isFinal) finalRef.current += " " + res[0].transcript;
          else interim += res[0].transcript;
        }
        setTranscript((finalRef.current + " " + interim).trim());
      };
      try {
        r.start();
        recRef.current = r;
      } catch {}
    }
    setPhase("recording");
  }
  function stopRec() {
    try {
      recRef.current?.stop();
    } catch {}
    try {
      mrRef.current?.stop();
    } catch {}
    setTimeout(() => {
      const said = (finalRef.current || transcript || "").trim();
      const { pct, matchedTarget } = scoreSaid(ph.text, said);
      let stars = 1;
      if (pct > 85) stars = 5;
      else if (pct >= 50) stars = 3;
      setResult({ pct, stars, matchedTarget, said });
      if (stars === 5) {
        addCoins?.(10);
        try {
          confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
        } catch {}
      }
      setPhase("scored");
    }, 350);
  }
  function next() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setResult(null);
    setTranscript("");
    finalRef.current = "";
    setPhase("idle");
    setIdx((i) => (i + 1) % phrases.length);
  }
  function retry() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setResult(null);
    setTranscript("");
    finalRef.current = "";
    setPhase("idle");
  }
  function playMyVoice() {
    if (!audioUrl) return;
    if (!playRef.current) playRef.current = new Audio(audioUrl);
    else playRef.current.src = audioUrl;
    playRef.current.currentTime = 0;
    playRef.current.play().catch(() => {});
  }
  const targetWords = ph.text.split(/\s+/);
  return (
    <div className="ac-fade">
      <div className="mb-3 flex items-center justify-center gap-1.5">
        {phrases.map((_, i) => (
          <span
            key={i}
            className="h-2.5 rounded-full transition-all"
            style={{ width: i === idx ? 24 : 8, backgroundColor: i === idx ? "#fbbf24" : "#cbd5e1" }}
          />
        ))}
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100">
        <div className="flex flex-col items-center">
          <div className="grid h-24 w-24 place-items-center rounded-3xl bg-amber-50 text-6xl shadow-inner">
            {ph.emoji}
          </div>
          <p className="mt-4 text-center text-xs font-extrabold uppercase tracking-wide text-slate-400">
            Say the phrase
          </p>
          <p className="mt-1 text-center text-2xl font-black text-amber-700">"{ph.text}"</p>
          <button
            onClick={() => speak(ph.text)}
            className="mt-3 flex items-center gap-1.5 rounded-full bg-amber-600 px-4 py-1.5 text-sm font-extrabold text-white shadow active:scale-95"
          >
            <Volume2 size={16} /> Hear it
          </button>
        </div>
        <div className="mt-6 flex flex-col items-center">
          {phase === "idle" && (
            <>
              <button
                onClick={startRec}
                className="grid h-16 w-16 place-items-center rounded-full text-white shadow-xl animate-bounce active:scale-95"
                style={{ background: "linear-gradient(135deg,#f59e0b,#ec4899)" }}
                aria-label="Record"
              >
                <Mic size={28} />
              </button>
              <p className="mt-2 text-sm font-extrabold text-amber-700">Tap & say the phrase!</p>
            </>
          )}
          {phase === "recording" && (
            <>
              <div className="flex h-20 items-center gap-1.5 rounded-3xl bg-amber-50 px-6 ring-2 ring-amber-200">
                {[0, 1, 2, 3, 4, 5, 6].map((b) => (
                  <span
                    key={b}
                    className="w-1.5 rounded-full"
                    style={{
                      height: 10 + ((b * 7 + idx * 3) % 30),
                      backgroundColor: "#f59e0b",
                      animation: `gr-eq .9s ${b * 0.08}s ease-in-out infinite alternate`,
                    }}
                  />
                ))}
              </div>
              <button
                onClick={stopRec}
                className="mt-4 rounded-full bg-slate-900 px-5 py-2 text-sm font-extrabold text-white shadow active:scale-95"
              >
                ⏹ Stop
              </button>
              {transcript && <p className="mt-3 text-center text-sm italic text-slate-500">"{transcript}"</p>}
            </>
          )}
          {phase === "scored" && result && (
            <div className="w-full">
              <div className="flex justify-center gap-1 text-3xl">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} style={{ color: s <= result.stars ? "#F5B301" : "#e2e8f0" }}>
                    ★
                  </span>
                ))}
              </div>
              <p
                className="mt-2 text-center text-lg font-black"
                style={{ color: result.stars === 5 ? "#16a34a" : result.stars === 3 ? "#004088" : "#E81820" }}
              >
                {result.stars === 5
                  ? "Perfect! +10 coins 🎉"
                  : result.stars === 3
                    ? "Good try! Listen and repeat 👂"
                    : "Try again! 💪"}
              </p>
              <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-center">
                <p className="mb-1 text-[11px] font-extrabold uppercase text-slate-400">Target</p>
                <p className="text-lg font-black">
                  {targetWords.map((w, i) => (
                    <span key={i} style={{ color: result.matchedTarget[i] ? "#16a34a" : "#E81820" }}>
                      {w}{" "}
                    </span>
                  ))}
                </p>
                <p className="mt-2 text-[11px] font-extrabold uppercase text-slate-400">You said</p>
                <p className="text-sm italic text-slate-600">"{result.said || "—"}"</p>
                <p className="mt-2 text-xs font-bold text-slate-500">Match: {result.pct}%</p>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {audioUrl && (
                  <button
                    onClick={playMyVoice}
                    className="rounded-full bg-white px-4 py-2 text-sm font-extrabold text-amber-700 shadow ring-1 ring-slate-200"
                  >
                    🎧 Play My Voice
                  </button>
                )}
                <button
                  onClick={retry}
                  className="rounded-full bg-amber-500 px-4 py-2 text-sm font-extrabold text-white shadow"
                >
                  Retry
                </button>
                <button
                  onClick={next}
                  className="rounded-full bg-amber-700 px-4 py-2 text-sm font-extrabold text-white shadow"
                >
                  Next phrase →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function VocabularyQuestU3({ onBack, addCoins }) {
  const [tab, setTab] = useState("l1");
  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#fbbf24" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #fbbf2466" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300">
          Planet 1 · Vocabulary Orbit
        </p>
        <p className="text-xl font-black text-white">☄️ Daily Life Galaxy</p>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        {[
          { k: "l1", t: "Lesson 1 · Flashcards" },
          { k: "l5", t: "Lesson 5 · Speaking" },
        ].map((x) => (
          <button
            key={x.k}
            onClick={() => setTab(x.k)}
            className={`rounded-full px-3 py-2 text-xs font-black transition ${tab === x.k ? "text-slate-900" : "text-white"}`}
            style={
              tab === x.k
                ? { background: "linear-gradient(135deg,#fbbf24,#ec4899)", boxShadow: "0 0 14px #ec489988" }
                : { background: "rgba(255,255,255,.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.18)" }
            }
          >
            {x.t}
          </button>
        ))}
      </div>
      {tab === "l1" ? <DailyActionFlashcards addCoins={addCoins} /> : <DailyPhraseSpeaking addCoins={addCoins} />}
    </div>
  );
}

// ---------- PLANET 2 U3: Nebula Clause Connector ----------
const NEBULA_PAIRS = [
  { left: "A man was walking his dog", right: "when it ran into the street." },
  { left: "Dad and Seb were buying groceries", right: "when the accident happened." },
  { left: "Taylor was playing chess", right: "when a truck suddenly stopped." },
];
export function NebulaBridge({ onBack, addCoins }) {
  const [rights, setRights] = useState(() => shuffle(NEBULA_PAIRS.map((p, i) => ({ idx: i, text: p.right }))));
  const [matched, setMatched] = useState({}); // leftIdx -> rightIdx
  const [dragging, setDragging] = useState(null);
  const [flash, setFlash] = useState(null); // {leftIdx, ok}
  const [done, setDone] = useState(false);
  const awarded = useRef(false);

  function tryMatch(leftIdx, rightIdx) {
    if (matched[leftIdx] != null) return;
    const ok = leftIdx === rightIdx;
    setFlash({ leftIdx, ok });
    if (ok) {
      const next = { ...matched, [leftIdx]: rightIdx };
      setMatched(next);
      if (Object.keys(next).length === NEBULA_PAIRS.length && !awarded.current) {
        awarded.current = true;
        addCoins?.(15);
        try {
          confetti({ particleCount: 180, spread: 100, origin: { y: 0.6 } });
        } catch {}
        setTimeout(() => setDone(true), 600);
      }
    }
    setTimeout(() => setFlash(null), 700);
  }

  function reset() {
    setRights(shuffle(NEBULA_PAIRS.map((p, i) => ({ idx: i, text: p.right }))));
    setMatched({});
    setFlash(null);
    setDone(false);
    awarded.current = false;
  }

  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#a78bfa" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #a78bfa66" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-violet-300">
          Planet 2 · Grammar Black Hole
        </p>
        <p className="text-xl font-black text-white">🌉 Nebula Clause Connector</p>
        <p className="text-[11px] font-bold text-indigo-200">Snap matching halves to bridge the galaxy!</p>
      </div>

      {!done ? (
        <div className="space-y-3">
          {NEBULA_PAIRS.map((p, leftIdx) => {
            const matchedRight = matched[leftIdx];
            const isFlash = flash?.leftIdx === leftIdx;
            return (
              <div key={leftIdx} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <div
                  className="rounded-2xl p-3 text-sm font-black text-white shadow-lg"
                  style={{
                    background: "linear-gradient(135deg,#1e1b4b,#4c1d95)",
                    boxShadow: matchedRight != null ? "0 0 14px #34d39988" : "inset 0 0 0 1px #a78bfa55",
                  }}
                >
                  {p.left}
                </div>
                <div
                  onDragOver={(e) => {
                    if (matchedRight == null) e.preventDefault();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragging != null) tryMatch(leftIdx, dragging);
                    setDragging(null);
                  }}
                  className="grid h-10 w-10 place-items-center rounded-full text-2xl"
                  style={{
                    background:
                      matchedRight != null
                        ? "linear-gradient(135deg,#10b981,#34d399)"
                        : isFlash && !flash.ok
                          ? "linear-gradient(135deg,#f43f5e,#fb7185)"
                          : "rgba(255,255,255,.08)",
                    boxShadow: matchedRight != null ? "0 0 18px #34d399" : "inset 0 0 0 1px rgba(255,255,255,.25)",
                  }}
                >
                  {matchedRight != null ? "✓" : isFlash && !flash.ok ? "✗" : "→"}
                </div>
                <div
                  className="rounded-2xl p-3 text-sm font-black text-white shadow-lg min-h-[44px]"
                  style={{
                    background:
                      matchedRight != null ? "linear-gradient(135deg,#10b981,#34d399)" : "rgba(255,255,255,.05)",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,.15)",
                  }}
                >
                  {matchedRight != null ? (
                    NEBULA_PAIRS[matchedRight].right
                  ) : (
                    <span className="opacity-50 text-xs">Drop a clause here</span>
                  )}
                </div>
              </div>
            );
          })}

          <div className="mt-4 rounded-3xl gx-glass p-3">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-300">
              Floating clauses · drag or tap
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {rights
                .filter((r) => !Object.values(matched).includes(r.idx))
                .map((r) => (
                  <button
                    key={r.idx}
                    draggable
                    onDragStart={() => setDragging(r.idx)}
                    onDragEnd={() => setDragging(null)}
                    onClick={() => {
                      // tap-to-match: pick the first unmatched left
                      const target = NEBULA_PAIRS.findIndex((_, i) => matched[i] == null);
                      if (target >= 0) tryMatch(target, r.idx);
                    }}
                    className="cursor-grab rounded-2xl px-3 py-2 text-xs font-black text-white shadow active:scale-95"
                    style={{ background: "linear-gradient(135deg,#0ea5e9,#a78bfa)", boxShadow: "0 0 12px #a78bfa55" }}
                  >
                    {r.text}
                  </button>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl gx-glass p-5 text-center" style={{ boxShadow: "0 0 22px #34d399" }}>
          <p className="text-2xl font-black text-white">🌉 Galaxy bridged!</p>
          <p className="mt-1 text-sm font-bold text-indigo-200">All clauses snapped. +15 coins awarded!</p>
          <div className="mt-3 flex justify-center gap-2">
            <button
              onClick={reset}
              className="rounded-full px-4 py-2 text-sm font-black text-slate-900"
              style={{ background: "linear-gradient(135deg,#67e8f9,#a78bfa)", boxShadow: "0 0 14px #a78bfa88" }}
            >
              Replay
            </button>
            <button
              onClick={onBack}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white ring-1 ring-white/20"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- PLANET 4 U3: Reading Comet · History of News ----------
export function ReadingAdventureU3({
  onBack,
  addCoins,
  unit = 3,
  level = "level_5",
  title = "📰 The History of News",
}) {
  const ud = getUnitData(unit, level);
  const data = ud.reading;
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const awarded = useRef(false);
  function pick(i, v) {
    if (done) return;
    const next = { ...answers, [i]: v };
    setAnswers(next);
    if (Object.keys(next).length === data.questions.length) {
      const allRight = data.questions.every((x, k) => next[k] === x.a);
      if (allRight && !awarded.current) {
        awarded.current = true;
        addCoins?.(15);
        try {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        } catch {}
        setDone(true);
      } else if (!allRight) {
        setTimeout(() => {
          setAnswers({});
        }, 1200);
      }
    }
  }
  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#22d3ee" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #22d3ee66" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-300">Planet 4 · Reading Comet</p>
        <p className="text-xl font-black text-white">
          {ud.icon} {ud.title}
        </p>
      </div>
      <div className="rounded-3xl gx-glass p-4 text-sm leading-relaxed text-indigo-100 whitespace-pre-line">
        {data.text}
      </div>
      <div className="mt-3 rounded-3xl gx-glass p-4">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-300">True or False?</p>
        <div className="mt-2 space-y-2">
          {data.questions.map((x, i) => {
            const chosen = answers[i];
            const showFeedback = chosen !== undefined;
            return (
              <div key={i} className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                <p className="text-sm font-black text-white">
                  {i + 1}. {x.q}
                </p>
                <div className="mt-2 flex gap-2">
                  {[true, false].map((v) => {
                    const isPick = chosen === v;
                    const isRight = showFeedback && v === x.a;
                    const isWrong = showFeedback && isPick && v !== x.a;
                    return (
                      <button
                        key={String(v)}
                        onClick={() => pick(i, v)}
                        className="flex-1 rounded-full px-3 py-1.5 text-xs font-black text-white transition active:scale-95"
                        style={{
                          background: isRight
                            ? "linear-gradient(135deg,#10b981,#34d399)"
                            : isWrong
                              ? "linear-gradient(135deg,#f43f5e,#fb7185)"
                              : "rgba(255,255,255,.08)",
                          boxShadow: isPick ? "0 0 14px #22d3ee88" : "inset 0 0 0 1px rgba(255,255,255,.18)",
                        }}
                      >
                        {v ? (
                          <>
                            <Check size={12} className="inline" /> True
                          </>
                        ) : (
                          <>
                            <X size={12} className="inline" /> False
                          </>
                        )}
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

// ---------- PLANET 5 U3: Phonics Rocket (ow/ou) + Space Defense Trivia ----------
const PHONICS_ITEMS_U3 = [
  { word: "town", sound: "ou" },
  { word: "crier", sound: "ow" },
  { word: "square", sound: "ow" },
  { word: "sound", sound: "ou" },
  { word: "out", sound: "ou" },
  { word: "brown", sound: "ow" },
  { word: "news", sound: "ou" },
];
function PhonicsRocketU3({ addCoins }) {
  const [queue, setQueue] = useState(() => shuffle(PHONICS_ITEMS_U3));
  const [pos, setPos] = useState(0);
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState(null);
  const [done, setDone] = useState(false);
  const cur = queue[pos];
  function pick(sound) {
    if (flash || done) return;
    const ok = sound === cur.sound;
    setFlash({ ok, target: sound });
    if (ok) {
      setScore((s) => s + 1);
      addCoins?.(2);
    }
    setTimeout(() => {
      setFlash(null);
      if (pos + 1 >= queue.length) {
        setDone(true);
        try {
          confetti({ particleCount: 130, spread: 80, origin: { y: 0.6 } });
        } catch {}
      } else setPos((p) => p + 1);
    }, 700);
  }
  function reset() {
    setQueue(shuffle(PHONICS_ITEMS_U3));
    setPos(0);
    setScore(0);
    setDone(false);
    setFlash(null);
  }
  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs font-bold text-indigo-200">
        <span>
          Word {Math.min(pos + 1, queue.length)} / {queue.length}
        </span>
        <span>
          Correct: <b className="text-white">{score}</b>
        </span>
        <button
          onClick={reset}
          className="rounded-full bg-white/10 px-3 py-1 font-black text-cyan-200 ring-1 ring-white/20"
        >
          Reset
        </button>
      </div>
      {!done ? (
        <>
          <div className="rounded-3xl gx-glass p-5 text-center" style={{ boxShadow: "0 0 18px #22d3ee44" }}>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-300">
              Which sound does this word make?
            </p>
            <p className="mt-2 text-4xl font-black tracking-widest text-white">{cur.word}</p>
            <button
              onClick={() => speak(cur.word)}
              className="mt-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-cyan-200 ring-1 ring-white/20"
            >
              🔊 Hear it
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { id: "ow", grad: "linear-gradient(135deg,#06b6d4,#22d3ee)", glow: "#22d3ee" },
              { id: "ou", grad: "linear-gradient(135deg,#a78bfa,#ec4899)", glow: "#ec4899" },
            ].map((r) => {
              const showRight = flash && r.id === cur.sound;
              const showWrong = flash && r.id === flash.target && !flash.ok;
              return (
                <button
                  key={r.id}
                  onClick={() => pick(r.id)}
                  disabled={!!flash}
                  className="relative flex h-40 flex-col items-center justify-end rounded-3xl pb-4 text-white shadow-xl transition active:scale-95"
                  style={{ background: r.grad, boxShadow: `0 0 18px ${r.glow}88, inset 0 0 0 1px ${r.glow}` }}
                >
                  <div className="text-6xl" style={{ filter: `drop-shadow(0 0 10px ${r.glow})` }}>
                    🚀
                  </div>
                  <div className="mt-1 rounded-full bg-white/20 px-4 py-1 text-lg font-black tracking-widest">
                    -{r.id}-
                  </div>
                  {showRight && (
                    <div className="absolute inset-0 grid place-items-center rounded-3xl bg-emerald-500/35 text-5xl">
                      ✓
                    </div>
                  )}
                  {showWrong && (
                    <div className="absolute inset-0 grid place-items-center rounded-3xl bg-rose-500/35 text-5xl">
                      ✗
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {flash && (
            <p className="mt-3 text-center text-sm font-black" style={{ color: flash.ok ? "#34d399" : "#fda4af" }}>
              {flash.ok ? `🎉 ${cur.word} → /${cur.sound}/  +2 coins` : `Almost! "${cur.word}" → /${cur.sound}/`}
            </p>
          )}
        </>
      ) : (
        <div className="rounded-3xl gx-glass p-5 text-center" style={{ boxShadow: "0 0 22px #22d3ee" }}>
          <p className="text-2xl font-black text-white">🌠 Phonics Mission Complete!</p>
          <p className="mt-1 text-sm font-bold text-indigo-200">
            Score: {score}/{queue.length}
          </p>
          <button
            onClick={reset}
            className="mt-3 rounded-full px-4 py-2 text-sm font-black text-slate-900"
            style={{ background: "linear-gradient(135deg,#67e8f9,#a78bfa)", boxShadow: "0 0 14px #a78bfa88" }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

const SPACE_DEFENSE_QUESTIONS = [
  {
    q: "What is the past form of 'buy groceries'?",
    choices: ["bought groceries", "buyed groceries", "buying groceries", "buys groceries"],
    correct: 0,
  },
  {
    q: "Long ago, who shouted news in the town square?",
    choices: ["a town crier", "a news anchor", "a vlogger", "a postman"],
    correct: 0,
  },
  { q: "What ___ Seb doing when the accident happened?", choices: ["was", "were", "did", "is"], correct: 0 },
  {
    q: "Pick the correct past continuous: ",
    choices: ["She was walking the dog.", "She walk the dog.", "She walks the dog.", "She walked the dog yesterday."],
    correct: 0,
  },
  { q: "Which word has the /ou/ sound (like 'out')?", choices: ["town", "brown", "crier", "square"], correct: 0 },
  {
    q: "What did people use BEFORE radios and TVs?",
    choices: ["a town crier", "a smartphone", "a tablet", "headphones"],
    correct: 0,
  },
  { q: "I ___ a present for my mom yesterday.", choices: ["bought", "buy", "buyed", "buying"], correct: 0 },
  { q: "They ___ chess when the bell rang.", choices: ["were playing", "was playing", "play", "plays"], correct: 0 },
];
function SpaceDefenseTrivia({ addCoins }) {
  const [pool] = useState(() => shuffle(SPACE_DEFENSE_QUESTIONS));
  const [idx, setIdx] = useState(0);
  const [pick, setPick] = useState(null);
  const [shield, setShield] = useState(100); // ship health
  const [charge, setCharge] = useState(0); // 0..pool.length
  const [done, setDone] = useState(null); // 'win'|'lose'
  const awarded = useRef(false);
  const q = pool[idx];

  function choose(i) {
    if (pick !== null || done) return;
    setPick(i);
    const ok = i === q.correct;
    if (ok) {
      setCharge((c) => c + 1);
    } else {
      setShield((s) => {
        const nh = s - 25;
        if (nh <= 0) {
          setTimeout(() => setDone("lose"), 800);
          return 0;
        }
        return nh;
      });
    }
    setTimeout(() => {
      if (idx + 1 >= pool.length) {
        if (!awarded.current) {
          awarded.current = true;
          addCoins?.(30);
          try {
            confetti({ particleCount: 220, spread: 110, startVelocity: 60, origin: { y: 0.6 } });
          } catch {}
          setDone("win");
        }
        return;
      }
      setIdx((n) => n + 1);
      setPick(null);
    }, 950);
  }
  function restart() {
    setIdx(0);
    setPick(null);
    setShield(100);
    setCharge(0);
    setDone(null);
    awarded.current = false;
  }

  if (done === "win")
    return (
      <div className="rounded-3xl gx-glass p-6 text-center" style={{ boxShadow: "0 0 28px #facc15" }}>
        <div className="text-5xl">🛡️🚀💥👾</div>
        <p className="mt-2 text-2xl font-black text-white">Boss Wave Cleared!</p>
        <p className="mt-1 text-sm font-bold text-amber-200">
          🏅 "Galaxy Defender" badge unlocked · +30 coins secured.
        </p>
        <button
          onClick={restart}
          className="mt-4 rounded-full px-4 py-2 text-sm font-black text-slate-900"
          style={{ background: "linear-gradient(135deg,#fde047,#facc15)", boxShadow: "0 0 14px #facc15" }}
        >
          Play Again
        </button>
      </div>
    );
  if (done === "lose")
    return (
      <div className="rounded-3xl gx-glass p-6 text-center" style={{ boxShadow: "0 0 22px #f43f5e88" }}>
        <div className="text-5xl">💥🛸</div>
        <p className="mt-2 text-2xl font-black text-white">Ship Shields Down</p>
        <p className="mt-1 text-sm font-bold text-rose-200">The UFOs got through. Re-charge and try again!</p>
        <button
          onClick={restart}
          className="mt-4 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white ring-1 ring-white/20"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div>
      <div className="mb-3 grid grid-cols-2 gap-3 text-xs font-bold text-white">
        <div>
          <p className="mb-1 text-cyan-300">🛡️ Shield</p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full transition-all"
              style={{
                width: `${shield}%`,
                background:
                  shield > 50 ? "linear-gradient(90deg,#34d399,#22d3ee)" : "linear-gradient(90deg,#fb923c,#f43f5e)",
              }}
            />
          </div>
        </div>
        <div>
          <p className="mb-1 text-amber-300">⚡ Laser charge</p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full transition-all"
              style={{
                width: `${(charge / pool.length) * 100}%`,
                background: "linear-gradient(90deg,#fde047,#f59e0b)",
              }}
            />
          </div>
        </div>
      </div>
      <div className="rounded-3xl gx-glass p-4" style={{ boxShadow: "0 0 18px #facc1555" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300">
          🛸 Q {idx + 1} / {pool.length} · Space Defense Trivia
        </p>
        <p className="mt-1 text-base font-black text-white">{q.q}</p>
        <div className="mt-3 grid gap-2">
          {q.choices.map((c, i) => {
            const isPick = pick === i;
            const showRight = pick !== null && i === q.correct;
            const showWrong = isPick && i !== q.correct;
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={pick !== null}
                className="rounded-2xl px-3 py-3 text-left text-sm font-black text-white transition active:scale-95"
                style={{
                  background: showRight
                    ? "linear-gradient(135deg,#10b981,#34d399)"
                    : showWrong
                      ? "linear-gradient(135deg,#f43f5e,#fb7185)"
                      : "linear-gradient(135deg,#1e1b4b,#4c1d95)",
                  boxShadow: isPick ? "0 0 14px #facc1588" : "inset 0 0 0 1px #facc1555",
                }}
              >
                <span className="mr-2">{String.fromCharCode(65 + i)}.</span>
                {c}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function Planet5ArenaU3({ onBack, addCoins }) {
  const [mode, setMode] = useState("a");
  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#facc15" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #facc1566" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300">
          Planet 5 · Supernova Quiz Arena
        </p>
        <p className="text-xl font-black text-white">🏆 Choose your challenge</p>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        {[
          { k: "a", t: "🚀 Phonics Rocket" },
          { k: "b", t: "🛡️ Space Defense" },
        ].map((x) => (
          <button
            key={x.k}
            onClick={() => setMode(x.k)}
            className={`rounded-full px-3 py-2 text-xs font-black transition ${mode === x.k ? "text-slate-900" : "text-white"}`}
            style={
              mode === x.k
                ? { background: "linear-gradient(135deg,#fde047,#facc15)", boxShadow: "0 0 14px #facc15" }
                : { background: "rgba(255,255,255,.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.18)" }
            }
          >
            {x.t}
          </button>
        ))}
      </div>
      {mode === "a" ? <PhonicsRocketU3 addCoins={addCoins} /> : <SpaceDefenseTrivia addCoins={addCoins} />}
    </div>
  );
}

// =================================================================
// 🧜‍♀️ UNIT 4 — Myths & Legends · planet components
// =================================================================

// ---------- PLANET 1 U4: reuses flashcard + speaking shells with unit=4 ----------
// ---------- PLANET 2: Data-driven grammar game — Will or Won't? (future tense) ----------
// Reads sentences from the unit's grammar.willWont; child picks 'will' or "won't".
export function FutureWillWont({ onBack, addCoins, unit = 1, level = "level_5" }) {
  const ud = getUnitData(unit, level);
  const rounds = useMemo(() => shuffle((ud.grammar?.willWont || []).slice()), [unit, level]); // eslint-disable-line react-hooks/exhaustive-deps
  const [idx, setIdx] = useState(0);
  const [pick, setPick] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const awarded = useRef(false);

  if (rounds.length === 0) {
    return (
      <div className="ac-fade">
        <BackBar onBack={onBack} color="#34d399" />
        <div className="rounded-3xl gx-glass p-6 text-center text-indigo-100">
          <p className="text-lg font-black text-white">🔮 Will or Won't?</p>
          <p className="mt-2 text-sm">This unit has no will/won't sentences yet.</p>
        </div>
      </div>
    );
  }

  const cur = rounds[idx];
  const options = ["will", "won't"];

  function choose(opt) {
    if (pick !== null || done) return;
    setPick(opt);
    const ok = opt === cur.answer;
    if (ok) setScore((s) => s + 1);
    setTimeout(() => {
      setPick(null);
      if (idx + 1 >= rounds.length) {
        if (!awarded.current) {
          awarded.current = true;
          addCoins?.(15);
          try {
            confetti({ particleCount: 180, spread: 100, origin: { y: 0.6 } });
          } catch {}
        }
        setDone(true);
      } else setIdx((n) => n + 1);
    }, 850);
  }
  function reset() {
    setIdx(0);
    setPick(null);
    setScore(0);
    setDone(false);
    awarded.current = false;
  }

  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#34d399" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #34d39966" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-300">
          Planet 2 · Grammar Black Hole
        </p>
        <p className="text-xl font-black text-white">🔮 Will or Won't?</p>
        <p className="text-[11px] font-bold text-indigo-200">Choose the correct word for each future sentence.</p>
      </div>

      {!done ? (
        <>
          <div className="mb-4 rounded-3xl gx-glass p-5 text-center">
            <p className="text-[11px] font-bold text-indigo-300">
              Sentence {idx + 1} / {rounds.length}
            </p>
            <p className="mt-2 text-lg font-black leading-snug text-white">
              {cur.before} <span className="mx-1 rounded-md bg-white/15 px-3 py-0.5 text-emerald-200">____</span>{" "}
              {cur.after}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {options.map((opt) => {
              const isPick = pick === opt;
              const isRight = pick !== null && opt === cur.answer;
              const isWrong = isPick && opt !== cur.answer;
              return (
                <button
                  key={opt}
                  onClick={() => choose(opt)}
                  className="rounded-2xl px-4 py-5 text-center text-lg font-black text-white transition active:scale-95"
                  style={{
                    background: isRight
                      ? "linear-gradient(135deg,#10b981,#34d399)"
                      : isWrong
                        ? "linear-gradient(135deg,#f43f5e,#fb7185)"
                        : "rgba(255,255,255,.08)",
                    boxShadow: isPick ? "0 0 14px #34d39988" : "inset 0 0 0 1px rgba(255,255,255,.18)",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="rounded-3xl gx-glass p-6 text-center">
          <p className="text-2xl font-black text-white">🎉 Great future talk!</p>
          <p className="mt-1 text-base font-black text-emerald-200">
            Score: {score} / {rounds.length}
          </p>
          <p className="mt-1 text-sm font-bold text-emerald-200">+15 cosmic coins</p>
          <button
            onClick={reset}
            className="mt-4 rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white ring-1 ring-white/20 hover:bg-white/20"
          >
            Play again 🔄
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- PLANET 5: Data-driven quiz — Alien Trivia ----------
// Builds questions from the unit's vocabulary (word -> meaning) + reading True/False.
export function AlienTriviaArena({ onBack, addCoins, unit = 1, level = "level_5" }) {
  const ud = getUnitData(unit, level);
  const questions = useMemo(() => {
    const qs = [];
    const vocab = (ud.vocabulary?.lesson_1 || []).filter((c) => c.vn);
    shuffle(vocab)
      .slice(0, 4)
      .forEach((it) => {
        const others = shuffle(vocab.filter((o) => o.vn !== it.vn).map((o) => o.vn)).slice(0, 3);
        qs.push({
          q: `What does '${it.word}' mean?`,
          emoji: it.emoji || "👾",
          opts: shuffle([it.vn, ...others]),
          a: it.vn,
        });
      });
    (ud.reading?.questions || []).forEach((rq) => {
      qs.push({ q: rq.q, emoji: "📖", opts: ["True ✅", "False ❌"], a: rq.a ? "True ✅" : "False ❌" });
    });
    return shuffle(qs);
  }, [unit, level]); // eslint-disable-line react-hooks/exhaustive-deps

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const awarded = useRef(false);

  if (questions.length === 0) {
    return (
      <div className="ac-fade">
        <BackBar onBack={onBack} color="#f472b6" />
        <div className="rounded-3xl gx-glass p-6 text-center text-indigo-100">
          <p className="text-lg font-black text-white">👾 Alien Trivia</p>
          <p className="mt-2 text-sm">This unit has no quiz content yet.</p>
        </div>
      </div>
    );
  }

  const cur = questions[idx];

  function choose(opt) {
    if (picked !== null || done) return;
    setPicked(opt);
    const ok = opt === cur.a;
    if (ok) setScore((s) => s + 1);
    setTimeout(() => {
      setPicked(null);
      if (idx + 1 >= questions.length) {
        if (!awarded.current) {
          awarded.current = true;
          addCoins?.(15);
          try {
            confetti({ particleCount: 180, spread: 100, origin: { y: 0.6 } });
          } catch {}
        }
        setDone(true);
      } else setIdx((n) => n + 1);
    }, 900);
  }
  function reset() {
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    awarded.current = false;
  }

  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#f472b6" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #f472b666" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-pink-300">Planet 5 · Quiz Arena</p>
        <p className="text-xl font-black text-white">👾 Alien Trivia</p>
        <p className="text-[11px] font-bold text-indigo-200">Answer the alien's questions to win cosmic coins!</p>
      </div>

      {!done ? (
        <>
          <div className="mb-4 rounded-3xl gx-glass p-5 text-center">
            <p className="text-[11px] font-bold text-indigo-300">
              Question {idx + 1} / {questions.length}
            </p>
            <p className="mt-2 text-lg font-black leading-snug text-white">
              {cur.emoji} {cur.q}
            </p>
          </div>
          <div className="space-y-2">
            {cur.opts.map((opt, i) => {
              const isPick = picked === opt;
              const isRight = picked !== null && opt === cur.a;
              const isWrong = isPick && opt !== cur.a;
              return (
                <button
                  key={i}
                  onClick={() => choose(opt)}
                  className="w-full rounded-2xl px-4 py-3 text-left text-sm font-black text-white transition active:scale-95"
                  style={{
                    background: isRight
                      ? "linear-gradient(135deg,#10b981,#34d399)"
                      : isWrong
                        ? "linear-gradient(135deg,#f43f5e,#fb7185)"
                        : "rgba(255,255,255,.08)",
                    boxShadow: isPick ? "0 0 14px #f472b688" : "inset 0 0 0 1px rgba(255,255,255,.18)",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="rounded-3xl gx-glass p-6 text-center">
          <p className="text-2xl font-black text-white">🎉 Quiz complete!</p>
          <p className="mt-1 text-base font-black text-pink-200">
            Score: {score} / {questions.length}
          </p>
          <p className="mt-1 text-sm font-bold text-emerald-200">+15 cosmic coins</p>
          <button
            onClick={reset}
            className="mt-4 rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white ring-1 ring-white/20 hover:bg-white/20"
          >
            Play again 🔄
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- PLANET 2: Data-driven grammar game — Cosmic Balloon Pop ----------
// Reads word/alt pairs from the unit's vocabulary; works for ANY unit/level.
export function CosmicBalloonPop({ onBack, addCoins, unit = 1, level = "level_5" }) {
  const ud = getUnitData(unit, level);
  const rounds = useMemo(() => {
    const items = (ud.vocabulary?.lesson_1 || []).filter((c) => c.alt && c.alt !== c.word);
    return items.map((it, ri) => {
      const otherAlts = shuffle(items.filter((_, k) => k !== ri).map((o) => o.alt));
      // The unchanged base form is the key trap: the child must APPLY the change, not match the topic.
      const distract = [...new Set([it.word, ...otherAlts.filter((o) => o !== it.alt && o !== it.word)])].slice(0, 3);
      const options = shuffle([it.alt, ...distract]);
      return { prompt: it.word, answer: it.alt, emoji: it.emoji, options };
    });
  }, [unit, level]); // eslint-disable-line react-hooks/exhaustive-deps

  const [idx, setIdx] = useState(0);
  const [pick, setPick] = useState(null);
  const [flash, setFlash] = useState(null);
  const [done, setDone] = useState(false);
  const awarded = useRef(false);

  if (rounds.length === 0) {
    return (
      <div className="ac-fade">
        <BackBar onBack={onBack} color="#34d399" />
        <div className="rounded-3xl gx-glass p-6 text-center text-indigo-100">
          <p className="text-lg font-black text-white">🎈 Cosmic Balloon Pop</p>
          <p className="mt-2 text-sm">This unit has no word-change pairs yet.</p>
        </div>
      </div>
    );
  }

  const cur = rounds[idx];
  const balloonColors = ["#f472b6", "#34d399", "#60a5fa", "#fbbf24", "#a78bfa"];

  function pop(opt) {
    if (pick !== null || done) return;
    setPick(opt);
    const ok = opt === cur.answer;
    setFlash(ok ? "ok" : "bad");
    setTimeout(() => {
      setFlash(null);
      setPick(null);
      if (!ok) return;
      if (idx + 1 >= rounds.length) {
        if (!awarded.current) {
          awarded.current = true;
          addCoins?.(15);
          try {
            confetti({ particleCount: 180, spread: 100, origin: { y: 0.6 } });
          } catch {}
        }
        setDone(true);
      } else setIdx((n) => n + 1);
    }, 800);
  }
  function reset() {
    setIdx(0);
    setPick(null);
    setFlash(null);
    setDone(false);
    awarded.current = false;
  }

  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#34d399" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #34d39966" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-300">
          Planet 2 · Grammar Black Hole
        </p>
        <p className="text-xl font-black text-white">🎈 Cosmic Balloon Pop</p>
        <p className="text-[11px] font-bold text-indigo-200">
          Pop the balloon with the correct {ud.formToggleLabel || "form"}.
        </p>
      </div>

      {!done ? (
        <>
          <div className="mb-4 rounded-3xl gx-glass p-5 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">Change this word</p>
            <p className="mt-1 text-3xl font-black text-white">
              {cur.emoji} {cur.prompt}
            </p>
            <p className="mt-2 text-[11px] font-bold text-indigo-300">
              Balloon {idx + 1} / {rounds.length}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {cur.options.map((opt, i) => {
              const isPick = pick === opt;
              const isAnsRight = flash && opt === cur.answer;
              const isPickWrong = flash && isPick && opt !== cur.answer;
              const base = balloonColors[i % balloonColors.length];
              return (
                <button
                  key={i}
                  onClick={() => pop(opt)}
                  className="relative flex h-24 items-center justify-center rounded-full px-3 text-center text-sm font-black text-white transition active:scale-90"
                  style={{
                    background: isAnsRight
                      ? "radial-gradient(circle at 35% 30%, #6ee7b7, #059669)"
                      : isPickWrong
                        ? "radial-gradient(circle at 35% 30%, #fda4af, #e11d48)"
                        : `radial-gradient(circle at 35% 30%, #ffffffcc, ${base} 62%, ${base})`,
                    boxShadow: `0 0 16px ${base}88, inset -6px -8px 12px rgba(0,0,0,.25)`,
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="rounded-3xl gx-glass p-6 text-center">
          <p className="text-2xl font-black text-white">🎉 All balloons popped!</p>
          <p className="mt-1 text-sm font-bold text-emerald-200">+15 cosmic coins</p>
          <button
            onClick={reset}
            className="mt-4 rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white ring-1 ring-white/20 hover:bg-white/20"
          >
            Play again 🔄
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- PLANET 1: One data-driven Vocabulary screen for ALL units/levels ----------
export function VocabularyQuestData({ onBack, addCoins, unit = 1, level = "level_5" }) {
  const [tab, setTab] = useState("l1");
  const ud = getUnitData(unit, level);
  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#a78bfa" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #a78bfa66" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-violet-300">
          Planet 1 · Vocabulary Orbit
        </p>
        <p className="text-xl font-black text-white">
          {ud.icon} {ud.title}
        </p>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        {[
          { k: "l1", t: "Lesson 1 · Flashcards" },
          { k: "l5", t: "Lesson 5 · Speaking" },
        ].map((x) => (
          <button
            key={x.k}
            onClick={() => setTab(x.k)}
            className={`rounded-full px-3 py-2 text-xs font-black transition ${tab === x.k ? "text-slate-900" : "text-white"}`}
            style={
              tab === x.k
                ? { background: "linear-gradient(135deg,#a78bfa,#ec4899)", boxShadow: "0 0 14px #a78bfa88" }
                : { background: "rgba(255,255,255,.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.18)" }
            }
          >
            {x.t}
          </button>
        ))}
      </div>
      {tab === "l1" ? (
        <DailyActionFlashcards addCoins={addCoins} unit={unit} level={level} />
      ) : (
        <DailyPhraseSpeaking addCoins={addCoins} unit={unit} level={level} />
      )}
    </div>
  );
}

export function VocabularyQuestU4({ onBack, addCoins, level = "level_5" }) {
  const [tab, setTab] = useState("l1");
  const ud = getUnitData(4, level);
  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#a78bfa" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #a78bfa66" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-violet-300">
          Planet 1 · Vocabulary Orbit
        </p>
        <p className="text-xl font-black text-white">
          {ud.icon} {ud.title}
        </p>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        {[
          { k: "l1", t: "Lesson 1 · Flashcards" },
          { k: "l5", t: "Lesson 5 · Speaking" },
        ].map((x) => (
          <button
            key={x.k}
            onClick={() => setTab(x.k)}
            className={`rounded-full px-3 py-2 text-xs font-black transition ${tab === x.k ? "text-slate-900" : "text-white"}`}
            style={
              tab === x.k
                ? { background: "linear-gradient(135deg,#a78bfa,#ec4899)", boxShadow: "0 0 14px #a78bfa88" }
                : { background: "rgba(255,255,255,.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.18)" }
            }
          >
            {x.t}
          </button>
        ))}
      </div>
      {tab === "l1" ? (
        <DailyActionFlashcards addCoins={addCoins} unit={4} level={level} />
      ) : (
        <DailyPhraseSpeaking addCoins={addCoins} unit={4} level={level} />
      )}
    </div>
  );
}

// ---------- PLANET 4 U4: Atlantis reading ----------
export function ReadingAdventureU4({ onBack, addCoins, level = "level_5" }) {
  return (
    <ReadingAdventureU3 onBack={onBack} addCoins={addCoins} unit={4} level={level} title="🏛️ The Legend of Atlantis" />
  );
}

// ---------- PLANET 2 U4: Orbital Sentence Alignment ----------
const ORBITAL_SENTENCES = [
  { words: ["A", "mermaid", "is", "a", "creature", "that", "has", "a", "fish", "tail."] },
  { words: ["Centaurs", "were", "warriors", "who", "were", "half", "man", "and", "half", "horse."] },
  { words: ["Dragons", "are", "monsters", "which", "breathe", "fire."] },
];
export function OrbitalAlignment({ onBack, addCoins }) {
  const [idx, setIdx] = useState(0);
  const [pool, setPool] = useState(() => shuffle(ORBITAL_SENTENCES[0].words.map((w, i) => ({ w, i }))));
  const [picked, setPicked] = useState([]); // array of {w,i}
  const [flash, setFlash] = useState(null); // 'ok'|'bad'
  const [done, setDone] = useState(false);
  const awarded = useRef(false);
  const target = ORBITAL_SENTENCES[idx].words;

  function pick(node) {
    if (flash) return;
    const nextPicked = [...picked, node];
    const expected = target[nextPicked.length - 1];
    if (node.w !== expected) {
      setFlash("bad");
      setTimeout(() => {
        setFlash(null);
        setPicked([]);
        setPool(shuffle(target.map((w, i) => ({ w, i }))));
      }, 700);
      return;
    }
    setPicked(nextPicked);
    setPool(pool.filter((p) => p.i !== node.i));
    if (nextPicked.length === target.length) {
      setFlash("ok");
      setTimeout(() => {
        setFlash(null);
        if (idx + 1 >= ORBITAL_SENTENCES.length) {
          if (!awarded.current) {
            awarded.current = true;
            addCoins?.(15);
            try {
              confetti({ particleCount: 180, spread: 100, origin: { y: 0.6 } });
            } catch {}
          }
          setDone(true);
        } else {
          const ni = idx + 1;
          setIdx(ni);
          setPicked([]);
          setPool(shuffle(ORBITAL_SENTENCES[ni].words.map((w, i) => ({ w, i }))));
        }
      }, 700);
    }
  }

  function reset() {
    setIdx(0);
    setPicked([]);
    setPool(shuffle(ORBITAL_SENTENCES[0].words.map((w, i) => ({ w, i }))));
    setDone(false);
    awarded.current = false;
  }

  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#a78bfa" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #a78bfa66" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-violet-300">
          Planet 2 · Grammar Black Hole
        </p>
        <p className="text-xl font-black text-white">🪐 Orbital Sentence Alignment</p>
        <p className="text-[11px] font-bold text-indigo-200">
          Tap floating word nodes in the right order to form a stable gravity beam.
        </p>
      </div>

      {!done ? (
        <>
          <div className="mb-3 flex items-center justify-between text-xs font-bold text-indigo-200">
            <span>
              Sentence {idx + 1} / {ORBITAL_SENTENCES.length}
            </span>
            <button
              onClick={reset}
              className="rounded-full bg-white/10 px-3 py-1 font-black text-violet-200 ring-1 ring-white/20"
            >
              Reset
            </button>
          </div>

          <div
            className="rounded-3xl gx-glass p-4 min-h-[80px]"
            style={{
              boxShadow:
                flash === "ok" ? "0 0 22px #34d399" : flash === "bad" ? "0 0 22px #f43f5e" : "0 0 14px #a78bfa55",
            }}
          >
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-300">⚡ Gravity beam</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {picked.length === 0 && (
                <span className="text-xs text-white/40">Tap a word below to start aligning…</span>
              )}
              {picked.map((p, i) => (
                <span
                  key={i}
                  className="rounded-2xl px-3 py-1.5 text-sm font-black text-white"
                  style={{ background: "linear-gradient(135deg,#10b981,#22d3ee)", boxShadow: "0 0 10px #22d3ee88" }}
                >
                  {p.w}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3 rounded-3xl gx-glass p-3">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-violet-300">Floating word nodes</p>
            <div className="mt-2 flex flex-wrap gap-2 justify-center">
              {pool.map((p) => (
                <button
                  key={p.i}
                  onClick={() => pick(p)}
                  disabled={!!flash}
                  className="rounded-full px-3 py-2 text-sm font-black text-white shadow active:scale-95 transition"
                  style={{
                    background: "radial-gradient(circle at 30% 30%, #c4b5fd, #6d28d9 70%)",
                    boxShadow: "0 0 14px #a78bfa88, inset 0 0 0 1px #c4b5fd66",
                    animation: "csnFloat 3s ease-in-out infinite",
                  }}
                >
                  {p.w}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-3xl gx-glass p-5 text-center" style={{ boxShadow: "0 0 22px #34d399" }}>
          <p className="text-2xl font-black text-white">🪐 Orbits aligned!</p>
          <p className="mt-1 text-sm font-bold text-indigo-200">All three gravity beams stable. +15 coins awarded!</p>
          <div className="mt-3 flex justify-center gap-2">
            <button
              onClick={reset}
              className="rounded-full px-4 py-2 text-sm font-black text-slate-900"
              style={{ background: "linear-gradient(135deg,#c4b5fd,#a78bfa)", boxShadow: "0 0 14px #a78bfa88" }}
            >
              Replay
            </button>
            <button
              onClick={onBack}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white ring-1 ring-white/20"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- PLANET 5 U4 · Mode A: Phonics Rocket -tion/-sion ----------
const PHONICS_ITEMS_U4 = [
  { word: "invention", sound: "tion" },
  { word: "decision", sound: "sion" },
  { word: "celebration", sound: "tion" },
  { word: "vision", sound: "sion" },
  { word: "exploration", sound: "tion" },
  { word: "television", sound: "sion" },
];
function PhonicsRocketU4({ addCoins }) {
  const [queue, setQueue] = useState(() => shuffle(PHONICS_ITEMS_U4));
  const [pos, setPos] = useState(0);
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState(null);
  const [done, setDone] = useState(false);
  const cur = queue[pos];
  function pick(sound) {
    if (flash || done) return;
    const ok = sound === cur.sound;
    setFlash({ ok, target: sound });
    if (ok) {
      setScore((s) => s + 1);
      addCoins?.(2);
    }
    setTimeout(() => {
      setFlash(null);
      if (pos + 1 >= queue.length) {
        setDone(true);
        try {
          confetti({ particleCount: 130, spread: 80, origin: { y: 0.6 } });
        } catch {}
      } else setPos((p) => p + 1);
    }, 700);
  }
  function reset() {
    setQueue(shuffle(PHONICS_ITEMS_U4));
    setPos(0);
    setScore(0);
    setDone(false);
    setFlash(null);
  }
  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs font-bold text-indigo-200">
        <span>
          Word {Math.min(pos + 1, queue.length)} / {queue.length}
        </span>
        <span>
          Correct: <b className="text-white">{score}</b>
        </span>
        <button
          onClick={reset}
          className="rounded-full bg-white/10 px-3 py-1 font-black text-cyan-200 ring-1 ring-white/20"
        >
          Reset
        </button>
      </div>
      {!done ? (
        <>
          <div className="rounded-3xl gx-glass p-5 text-center" style={{ boxShadow: "0 0 18px #a78bfa44" }}>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-violet-300">
              Which suffix sound does this word make?
            </p>
            <p className="mt-2 text-3xl font-black tracking-wide text-white">{cur.word}</p>
            <button
              onClick={() => speak(cur.word)}
              className="mt-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-violet-200 ring-1 ring-white/20"
            >
              🔊 Hear it
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { id: "tion", label: "-tion /ʃn/", grad: "linear-gradient(135deg,#06b6d4,#22d3ee)", glow: "#22d3ee" },
              { id: "sion", label: "-sion /ʒn/", grad: "linear-gradient(135deg,#a78bfa,#ec4899)", glow: "#ec4899" },
            ].map((r) => {
              const showRight = flash && r.id === cur.sound;
              const showWrong = flash && r.id === flash.target && !flash.ok;
              return (
                <button
                  key={r.id}
                  onClick={() => pick(r.id)}
                  disabled={!!flash}
                  className="relative flex h-40 flex-col items-center justify-end rounded-3xl pb-4 text-white shadow-xl transition active:scale-95"
                  style={{ background: r.grad, boxShadow: `0 0 18px ${r.glow}88, inset 0 0 0 1px ${r.glow}` }}
                >
                  <div className="text-6xl" style={{ filter: `drop-shadow(0 0 10px ${r.glow})` }}>
                    🚀
                  </div>
                  <div className="mt-1 rounded-full bg-white/20 px-4 py-1 text-sm font-black tracking-wide">
                    {r.label}
                  </div>
                  {showRight && (
                    <div className="absolute inset-0 grid place-items-center rounded-3xl bg-emerald-500/35 text-5xl">
                      ✓
                    </div>
                  )}
                  {showWrong && (
                    <div className="absolute inset-0 grid place-items-center rounded-3xl bg-rose-500/35 text-5xl">
                      ✗
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {flash && (
            <p className="mt-3 text-center text-sm font-black" style={{ color: flash.ok ? "#34d399" : "#fda4af" }}>
              {flash.ok ? `🎉 ${cur.word} → -${cur.sound}  +2 coins` : `Almost! "${cur.word}" → -${cur.sound}`}
            </p>
          )}
        </>
      ) : (
        <div className="rounded-3xl gx-glass p-5 text-center" style={{ boxShadow: "0 0 22px #a78bfa" }}>
          <p className="text-2xl font-black text-white">🌠 Phonics Mission Complete!</p>
          <p className="mt-1 text-sm font-bold text-indigo-200">
            Score: {score}/{queue.length}
          </p>
          <button
            onClick={reset}
            className="mt-3 rounded-full px-4 py-2 text-sm font-black text-slate-900"
            style={{ background: "linear-gradient(135deg,#c4b5fd,#a78bfa)", boxShadow: "0 0 14px #a78bfa88" }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- PLANET 5 U4 · Mode B: Quantum Memory Match ----------
function QuantumMemoryMatch({ addCoins }) {
  const PAIRS = [
    { id: "minotaur", word: "Minotaur", emoji: "🐂" },
    { id: "dragon", word: "Dragon", emoji: "🐉" },
    { id: "mermaid", word: "Mermaid", emoji: "🧜‍♀️" },
    { id: "phoenix", word: "Phoenix", emoji: "🦅" },
    { id: "unicorn", word: "Unicorn", emoji: "🦄" },
    { id: "kraken", word: "Kraken", emoji: "🦑" },
  ];
  const build = () =>
    shuffle(
      PAIRS.flatMap((p) => [
        { key: `${p.id}-w`, pairId: p.id, label: p.word, kind: "word" },
        { key: `${p.id}-e`, pairId: p.id, label: p.emoji, kind: "emoji" },
      ]),
    );
  const [cards, setCards] = useState(build);
  const [flipped, setFlipped] = useState([]); // indexes
  const [matched, setMatched] = useState(() => new Set());
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);
  const awarded = useRef(false);
  const lock = useRef(false);

  function flip(i) {
    if (lock.current) return;
    if (flipped.includes(i) || matched.has(cards[i].pairId)) return;
    const next = [...flipped, i];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (cards[a].pairId === cards[b].pairId) {
        setTimeout(() => {
          setMatched((p) => {
            const n = new Set(p);
            n.add(cards[a].pairId);
            if (n.size === PAIRS.length && !awarded.current) {
              awarded.current = true;
              addCoins?.(30);
              try {
                confetti({ particleCount: 220, spread: 110, startVelocity: 60, origin: { y: 0.6 } });
              } catch {}
              setTimeout(() => setDone(true), 400);
            }
            return n;
          });
          setFlipped([]);
        }, 450);
      } else {
        lock.current = true;
        setTimeout(() => {
          setFlipped([]);
          lock.current = false;
        }, 850);
      }
    }
  }
  function reset() {
    setCards(build());
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setDone(false);
    awarded.current = false;
    lock.current = false;
  }

  if (done)
    return (
      <div className="rounded-3xl gx-glass p-6 text-center" style={{ boxShadow: "0 0 28px #a78bfa" }}>
        <div className="text-5xl">🎴✨🪐</div>
        <p className="mt-2 text-2xl font-black text-white">Quantum board cleared!</p>
        <p className="mt-1 text-sm font-bold text-violet-200">
          All pairs matched in {moves} moves · +30 coins secured to your profile.
        </p>
        <button
          onClick={reset}
          className="mt-4 rounded-full px-4 py-2 text-sm font-black text-slate-900"
          style={{ background: "linear-gradient(135deg,#c4b5fd,#a78bfa)", boxShadow: "0 0 14px #a78bfa" }}
        >
          Play Again
        </button>
      </div>
    );

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs font-bold text-indigo-200">
        <span>
          Matched:{" "}
          <b className="text-white">
            {matched.size}/{PAIRS.length}
          </b>
        </span>
        <span>
          Moves: <b className="text-white">{moves}</b>
        </span>
        <button
          onClick={reset}
          className="rounded-full bg-white/10 px-3 py-1 font-black text-violet-200 ring-1 ring-white/20"
        >
          Reset
        </button>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
        {cards.map((c, i) => {
          const isOpen = flipped.includes(i) || matched.has(c.pairId);
          const isMatched = matched.has(c.pairId);
          return (
            <button
              key={c.key}
              onClick={() => flip(i)}
              className="relative aspect-[3/4] rounded-2xl text-white font-black transition active:scale-95"
              style={{
                background: isMatched
                  ? "linear-gradient(135deg,#10b981,#34d399)"
                  : isOpen
                    ? "linear-gradient(135deg,#1e1b4b,#4c1d95)"
                    : "radial-gradient(circle at 30% 30%, #4338ca, #1e1b4b 70%)",
                boxShadow: isOpen
                  ? "0 0 16px #a78bfa88, inset 0 0 0 1px #c4b5fd66"
                  : "0 0 10px #4338ca88, inset 0 0 0 1px #6366f155",
              }}
            >
              <div className="absolute inset-0 grid place-items-center">
                {isOpen ? (
                  <span
                    className={c.kind === "emoji" ? "text-4xl sm:text-5xl" : "text-sm sm:text-base px-1 text-center"}
                  >
                    {c.label}
                  </span>
                ) : (
                  <span className="text-3xl opacity-80">🌌</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Planet5ArenaU4({ onBack, addCoins }) {
  const [mode, setMode] = useState("a");
  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#a78bfa" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #a78bfa66" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-violet-300">
          Planet 5 · Supernova Quiz Arena
        </p>
        <p className="text-xl font-black text-white">🏆 Choose your challenge</p>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        {[
          { k: "a", t: "🚀 Phonics Rocket" },
          { k: "b", t: "🎴 Quantum Memory" },
        ].map((x) => (
          <button
            key={x.k}
            onClick={() => setMode(x.k)}
            className={`rounded-full px-3 py-2 text-xs font-black transition ${mode === x.k ? "text-slate-900" : "text-white"}`}
            style={
              mode === x.k
                ? { background: "linear-gradient(135deg,#c4b5fd,#a78bfa)", boxShadow: "0 0 14px #a78bfa" }
                : { background: "rgba(255,255,255,.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.18)" }
            }
          >
            {x.t}
          </button>
        ))}
      </div>
      {mode === "a" ? <PhonicsRocketU4 addCoins={addCoins} /> : <QuantumMemoryMatch addCoins={addCoins} />}
    </div>
  );
}

// =================================================================
// 🍳 UNIT 5 — Let's Cook! — Planet wiring (reuses frozen UI shells)
// =================================================================

// ---------- PLANET 1 U5: Cooking vocabulary ----------
export function VocabularyQuestU5({ onBack, addCoins, level = "level_5" }) {
  const [tab, setTab] = useState("l1");
  const ud = getUnitData(5, level);
  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#fb923c" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #fb923c66" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300">
          Planet 1 · Vocabulary Orbit
        </p>
        <p className="text-xl font-black text-white">
          {ud.icon} {ud.title}
        </p>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        {[
          { k: "l1", t: "Lesson 1 · Flashcards" },
          { k: "l5", t: "Lesson 8 · Speaking" },
        ].map((x) => (
          <button
            key={x.k}
            onClick={() => setTab(x.k)}
            className={`rounded-full px-3 py-2 text-xs font-black transition ${tab === x.k ? "text-slate-900" : "text-white"}`}
            style={
              tab === x.k
                ? { background: "linear-gradient(135deg,#fde047,#fb923c)", boxShadow: "0 0 14px #fb923c88" }
                : { background: "rgba(255,255,255,.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.18)" }
            }
          >
            {x.t}
          </button>
        ))}
      </div>
      {tab === "l1" ? (
        <DailyActionFlashcards addCoins={addCoins} unit={5} level={level} />
      ) : (
        <DailyPhraseSpeaking addCoins={addCoins} unit={5} level={level} />
      )}
    </div>
  );
}

// ---------- PLANET 4 U5: Galaxy Bakery reading ----------
export function ReadingAdventureU5({ onBack, addCoins, level = "level_5" }) {
  return <ReadingAdventureU3 onBack={onBack} addCoins={addCoins} unit={5} level={level} title="🍰 The Galaxy Bakery" />;
}

// ---------- PLANET 2 U5: Quantum Ingredient Scale ----------
const QUANTUM_SCALE_ITEMS = [
  {
    sentence: "There is ___ salt in the soup. It is too salty!",
    choices: ["too much", "too many", "a few"],
    correct: 0,
  },
  {
    sentence: "There are ___ cupcakes for ten kids. Two children have nothing!",
    choices: ["not enough", "too many", "too much"],
    correct: 0,
  },
  { sentence: "We have ___ apples to bake three complete pies.", choices: ["enough", "much", "little"], correct: 0 },
  {
    sentence: "There are ___ mushrooms on my pizza. I cannot see the cheese!",
    choices: ["too many", "too much", "an"],
    correct: 0,
  },
];
export function QuantumScale({ onBack, addCoins }) {
  const [idx, setIdx] = useState(0);
  const [pick, setPick] = useState(null);
  const [flash, setFlash] = useState(null);
  const [done, setDone] = useState(false);
  const awarded = useRef(false);
  const cur = QUANTUM_SCALE_ITEMS[idx];

  function choose(i) {
    if (pick !== null || done) return;
    setPick(i);
    const ok = i === cur.correct;
    setFlash(ok ? "ok" : "bad");
    setTimeout(() => {
      setFlash(null);
      setPick(null);
      if (!ok) return;
      if (idx + 1 >= QUANTUM_SCALE_ITEMS.length) {
        if (!awarded.current) {
          awarded.current = true;
          addCoins?.(15);
          try {
            confetti({ particleCount: 180, spread: 100, origin: { y: 0.6 } });
          } catch {}
        }
        setDone(true);
      } else setIdx((n) => n + 1);
    }, 900);
  }
  function reset() {
    setIdx(0);
    setPick(null);
    setFlash(null);
    setDone(false);
    awarded.current = false;
  }

  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#fb923c" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #fb923c66" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300">
          Planet 2 · Grammar Black Hole
        </p>
        <p className="text-xl font-black text-white">⚖️ Quantum Ingredient Scale</p>
        <p className="text-[11px] font-bold text-indigo-200">Tap an energy crystal to balance the cooking pot.</p>
      </div>

      {!done ? (
        <>
          <div className="mb-3 flex items-center justify-between text-xs font-bold text-indigo-200">
            <span>
              Recipe {idx + 1} / {QUANTUM_SCALE_ITEMS.length}
            </span>
            <button
              onClick={reset}
              className="rounded-full bg-white/10 px-3 py-1 font-black text-amber-200 ring-1 ring-white/20"
            >
              Reset
            </button>
          </div>

          <div
            className="rounded-3xl gx-glass p-5 text-center"
            style={{
              boxShadow:
                flash === "ok" ? "0 0 22px #34d399" : flash === "bad" ? "0 0 22px #f43f5e" : "0 0 14px #fb923c55",
            }}
          >
            <div className="text-6xl" style={{ filter: "drop-shadow(0 0 12px #fb923ccc)" }}>
              🍲
            </div>
            <p className="mt-3 text-base font-black text-white">{cur.sentence}</p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {cur.choices.map((c, i) => {
              const isPick = pick === i;
              const showRight = pick !== null && i === cur.correct;
              const showWrong = isPick && i !== cur.correct;
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={pick !== null}
                  className="relative rounded-2xl px-2 py-4 text-sm font-black text-white transition active:scale-95 disabled:opacity-60"
                  style={{
                    background: showRight
                      ? "linear-gradient(135deg,#10b981,#34d399)"
                      : showWrong
                        ? "linear-gradient(135deg,#f43f5e,#fb7185)"
                        : "radial-gradient(circle at 30% 30%, #fde047, #ea580c 70%)",
                    boxShadow: isPick ? "0 0 14px #fb923c" : "0 0 12px #fb923c66, inset 0 0 0 1px #fde04766",
                    animation: "csnFloat 3s ease-in-out infinite",
                  }}
                >
                  <div className="text-2xl">💎</div>
                  <div className="mt-1">{c}</div>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="rounded-3xl gx-glass p-5 text-center" style={{ boxShadow: "0 0 22px #34d399" }}>
          <p className="text-2xl font-black text-white">⚖️ Recipe perfectly balanced!</p>
          <p className="mt-1 text-sm font-bold text-indigo-200">Master space recipe launched. +15 coins awarded!</p>
          <div className="mt-3 flex justify-center gap-2">
            <button
              onClick={reset}
              className="rounded-full px-4 py-2 text-sm font-black text-slate-900"
              style={{ background: "linear-gradient(135deg,#fde047,#fb923c)", boxShadow: "0 0 14px #fb923c88" }}
            >
              Replay
            </button>
            <button
              onClick={onBack}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white ring-1 ring-white/20"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- PLANET 5 U5 · Mode A: Phonics Rocket -oo- sounds ----------
const PHONICS_ITEMS_U5 = [
  { word: "cook", sound: "short" },
  { word: "spoon", sound: "long" },
  { word: "foot", sound: "short" },
  { word: "food", sound: "long" },
  { word: "wood", sound: "short" },
  { word: "moon", sound: "long" },
];
function PhonicsRocketU5({ addCoins }) {
  const [queue, setQueue] = useState(() => shuffle(PHONICS_ITEMS_U5));
  const [pos, setPos] = useState(0);
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState(null);
  const [done, setDone] = useState(false);
  const cur = queue[pos];
  function pick(sound) {
    if (flash || done) return;
    const ok = sound === cur.sound;
    setFlash({ ok, target: sound });
    if (ok) {
      setScore((s) => s + 1);
      addCoins?.(2);
    }
    setTimeout(() => {
      setFlash(null);
      if (pos + 1 >= queue.length) {
        setDone(true);
        try {
          confetti({ particleCount: 130, spread: 80, origin: { y: 0.6 } });
        } catch {}
      } else setPos((p) => p + 1);
    }, 700);
  }
  function reset() {
    setQueue(shuffle(PHONICS_ITEMS_U5));
    setPos(0);
    setScore(0);
    setDone(false);
    setFlash(null);
  }
  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs font-bold text-indigo-200">
        <span>
          Word {Math.min(pos + 1, queue.length)} / {queue.length}
        </span>
        <span>
          Correct: <b className="text-white">{score}</b>
        </span>
        <button
          onClick={reset}
          className="rounded-full bg-white/10 px-3 py-1 font-black text-amber-200 ring-1 ring-white/20"
        >
          Reset
        </button>
      </div>
      {!done ? (
        <>
          <div className="rounded-3xl gx-glass p-5 text-center" style={{ boxShadow: "0 0 18px #fb923c44" }}>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300">
              Which "-oo-" sound does this word make?
            </p>
            <p className="mt-2 text-3xl font-black tracking-wide text-white">{cur.word}</p>
            <button
              onClick={() => speak(cur.word)}
              className="mt-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-amber-200 ring-1 ring-white/20"
            >
              🔊 Hear it
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              {
                id: "short",
                label: "Short -oo- (cook)",
                grad: "linear-gradient(135deg,#f59e0b,#ef4444)",
                glow: "#f59e0b",
              },
              {
                id: "long",
                label: "Long -oo- (spoon)",
                grad: "linear-gradient(135deg,#06b6d4,#3b82f6)",
                glow: "#06b6d4",
              },
            ].map((r) => {
              const showRight = flash && r.id === cur.sound;
              const showWrong = flash && r.id === flash.target && !flash.ok;
              return (
                <button
                  key={r.id}
                  onClick={() => pick(r.id)}
                  disabled={!!flash}
                  className="relative flex h-40 flex-col items-center justify-end rounded-3xl pb-4 text-white shadow-xl transition active:scale-95"
                  style={{ background: r.grad, boxShadow: `0 0 18px ${r.glow}88, inset 0 0 0 1px ${r.glow}` }}
                >
                  <div className="text-6xl" style={{ filter: `drop-shadow(0 0 10px ${r.glow})` }}>
                    🚀
                  </div>
                  <div className="mt-1 rounded-full bg-white/20 px-4 py-1 text-sm font-black tracking-wide">
                    {r.label}
                  </div>
                  {showRight && (
                    <div className="absolute inset-0 grid place-items-center rounded-3xl bg-emerald-500/35 text-5xl">
                      ✓
                    </div>
                  )}
                  {showWrong && (
                    <div className="absolute inset-0 grid place-items-center rounded-3xl bg-rose-500/35 text-5xl">
                      ✗
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {flash && (
            <p className="mt-3 text-center text-sm font-black" style={{ color: flash.ok ? "#34d399" : "#fda4af" }}>
              {flash.ok ? `🎉 ${cur.word} → ${cur.sound} -oo-  +2 coins` : `Almost! "${cur.word}" → ${cur.sound} -oo-`}
            </p>
          )}
        </>
      ) : (
        <div className="rounded-3xl gx-glass p-5 text-center" style={{ boxShadow: "0 0 22px #fb923c" }}>
          <p className="text-2xl font-black text-white">🌠 Phonics Mission Complete!</p>
          <p className="mt-1 text-sm font-bold text-indigo-200">
            Score: {score}/{queue.length}
          </p>
          <button
            onClick={reset}
            className="mt-3 rounded-full px-4 py-2 text-sm font-black text-slate-900"
            style={{ background: "linear-gradient(135deg,#fde047,#fb923c)", boxShadow: "0 0 14px #fb923c88" }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- PLANET 5 U5 · Mode B: Alien Trivia Quest ----------
const TRIVIA_QUESTIONS_U5 = [
  { q: "Which ingredient makes things sweet?", choices: ["sugar", "salt", "pepper", "flour"], correct: 0 },
  { q: "Which kitchen tool do you use to cut food?", choices: ["knife", "plate", "glass", "bowl"], correct: 0 },
  { q: "There ___ too much salt in the soup.", choices: ["is", "are", "am", "be"], correct: 0 },
  { q: "We don't have ___ strawberries to make the jelly.", choices: ["enough", "much", "many", "a"], correct: 0 },
  { q: "Which tool is used to drink water?", choices: ["glass", "fork", "spoon", "knife"], correct: 0 },
  {
    q: "There are ___ olives on the pizza! I can't see the cheese!",
    choices: ["too many", "too much", "a little", "much"],
    correct: 0,
  },
  { q: "Which ingredient comes from bees?", choices: ["honey", "butter", "flour", "jelly"], correct: 0 },
  { q: "Which word has the LONG -oo- sound?", choices: ["spoon", "cook", "foot", "wood"], correct: 0 },
];
function AlienTriviaU5({ addCoins }) {
  const [pool] = useState(() => shuffle(TRIVIA_QUESTIONS_U5));
  const [idx, setIdx] = useState(0);
  const [pick, setPick] = useState(null);
  const [killed, setKilled] = useState(new Set());
  const [fiftyLeft, setFiftyLeft] = useState(1);
  const [shieldLeft, setShieldLeft] = useState(1);
  const [shieldArmed, setShieldArmed] = useState(false);
  const [hearts, setHearts] = useState(3);
  const [done, setDone] = useState(null);
  const awarded = useRef(false);
  const q = pool[idx];
  function choose(i) {
    if (pick !== null || done) return;
    setPick(i);
    const ok = i === q.correct;
    if (!ok) {
      if (shieldArmed) {
        setShieldArmed(false);
        setTimeout(() => nextQ(true), 1100);
        return;
      }
      setHearts((h) => {
        const nh = h - 1;
        if (nh <= 0) setTimeout(() => setDone("lose"), 900);
        return nh;
      });
    }
    setTimeout(() => nextQ(ok), 1000);
  }
  function nextQ(_ok) {
    if (idx + 1 >= pool.length) {
      if (!awarded.current && hearts > 0) {
        awarded.current = true;
        addCoins?.(30);
        try {
          confetti({ particleCount: 220, spread: 110, startVelocity: 60, origin: { y: 0.6 } });
        } catch {}
        setDone("win");
      }
      return;
    }
    setIdx((n) => n + 1);
    setPick(null);
    setKilled(new Set());
  }
  function useFifty() {
    if (fiftyLeft <= 0 || pick !== null) return;
    const wrongs = q.choices.map((_, i) => i).filter((i) => i !== q.correct);
    const kill = shuffle(wrongs).slice(0, 2);
    setKilled(new Set(kill));
    setFiftyLeft((n) => n - 1);
  }
  function useShield() {
    if (shieldLeft <= 0 || shieldArmed || pick !== null) return;
    setShieldArmed(true);
    setShieldLeft((n) => n - 1);
  }
  function restart() {
    setIdx(0);
    setPick(null);
    setKilled(new Set());
    setFiftyLeft(1);
    setShieldLeft(1);
    setShieldArmed(false);
    setHearts(3);
    setDone(null);
    awarded.current = false;
  }

  if (done === "win")
    return (
      <div className="rounded-3xl gx-glass p-6 text-center" style={{ boxShadow: "0 0 28px #fb923c" }}>
        <div className="text-5xl">🎆🍰🛸</div>
        <p className="mt-2 text-2xl font-black text-white">Space Recipe Mastered!</p>
        <p className="mt-1 text-sm font-bold text-indigo-200">+30 coins secured to your profile. Victory!</p>
        <button
          onClick={restart}
          className="mt-4 rounded-full px-4 py-2 text-sm font-black text-slate-900"
          style={{ background: "linear-gradient(135deg,#fde047,#fb923c)", boxShadow: "0 0 14px #fb923c" }}
        >
          Play Again
        </button>
      </div>
    );
  if (done === "lose")
    return (
      <div className="rounded-3xl gx-glass p-6 text-center" style={{ boxShadow: "0 0 22px #f43f5e88" }}>
        <div className="text-5xl">💥</div>
        <p className="mt-2 text-2xl font-black text-white">Mission Failed</p>
        <p className="mt-1 text-sm font-bold text-rose-200">The cosmic chefs out-cooked you! Try again, cadet!</p>
        <button
          onClick={restart}
          className="mt-4 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white ring-1 ring-white/20"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs font-bold text-indigo-200">
        <span>
          Question {idx + 1} / {pool.length}
        </span>
        <span>
          {"❤️".repeat(hearts)}
          {"🖤".repeat(3 - hearts)}
        </span>
      </div>
      <div className="rounded-3xl gx-glass p-4" style={{ boxShadow: "0 0 18px #fb923c55" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300">🛸 Alien Trivia Quest</p>
        <p className="mt-1 text-base font-black text-white">{q.q}</p>
        <div className="mt-3 grid gap-2">
          {q.choices.map((c, i) => {
            const isPick = pick === i;
            const showRight = pick !== null && i === q.correct;
            const showWrong = isPick && i !== q.correct;
            const isKilled = killed.has(i);
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={isKilled || pick !== null}
                className="rounded-2xl px-3 py-3 text-left text-sm font-black text-white transition active:scale-95 disabled:opacity-30"
                style={{
                  background: showRight
                    ? "linear-gradient(135deg,#10b981,#34d399)"
                    : showWrong
                      ? "linear-gradient(135deg,#f43f5e,#fb7185)"
                      : "linear-gradient(135deg,#1e1b4b,#7c2d12)",
                  boxShadow: isPick ? "0 0 14px #fb923c88" : "inset 0 0 0 1px #fb923c55",
                  textDecoration: isKilled ? "line-through" : "none",
                }}
              >
                <span className="mr-2">{String.fromCharCode(65 + i)}.</span>
                {c}
              </button>
            );
          })}
        </div>
        {shieldArmed && (
          <p className="mt-3 text-center text-xs font-black text-cyan-200">
            🛡️ Cosmic Shield armed — one wrong answer will be blocked.
          </p>
        )}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={useFifty}
          disabled={fiftyLeft <= 0 || pick !== null}
          className="rounded-2xl px-3 py-3 text-xs font-black text-white transition active:scale-95 disabled:opacity-40"
          style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)", boxShadow: "0 0 14px #f59e0b88" }}
        >
          🔫 Laser Beam 50:50 <span className="ml-1 opacity-80">({fiftyLeft})</span>
        </button>
        <button
          onClick={useShield}
          disabled={shieldLeft <= 0 || shieldArmed || pick !== null}
          className="rounded-2xl px-3 py-3 text-xs font-black text-white transition active:scale-95 disabled:opacity-40"
          style={{ background: "linear-gradient(135deg,#06b6d4,#3b82f6)", boxShadow: "0 0 14px #06b6d488" }}
        >
          🛡️ Cosmic Shield <span className="ml-1 opacity-80">({shieldLeft})</span>
        </button>
      </div>
    </div>
  );
}

export function Planet5ArenaU5({ onBack, addCoins }) {
  const [mode, setMode] = useState("a");
  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#fb923c" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #fb923c66" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300">
          Planet 5 · Supernova Quiz Arena
        </p>
        <p className="text-xl font-black text-white">🏆 Choose your challenge</p>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        {[
          { k: "a", t: "🚀 Phonics Rocket" },
          { k: "b", t: "🛸 Alien Trivia" },
        ].map((x) => (
          <button
            key={x.k}
            onClick={() => setMode(x.k)}
            className={`rounded-full px-3 py-2 text-xs font-black transition ${mode === x.k ? "text-slate-900" : "text-white"}`}
            style={
              mode === x.k
                ? { background: "linear-gradient(135deg,#fde047,#fb923c)", boxShadow: "0 0 14px #fb923c" }
                : { background: "rgba(255,255,255,.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.18)" }
            }
          >
            {x.t}
          </button>
        ))}
      </div>
      {mode === "a" ? <PhonicsRocketU5 addCoins={addCoins} /> : <AlienTriviaU5 addCoins={addCoins} />}
    </div>
  );
}

// =================================================================
// UNIT 6 · Save Our Planet! — Vocabulary / Grammar / Reading / Arena
// =================================================================
export function VocabularyQuestU6({ onBack, addCoins }) {
  const [tab, setTab] = useState("l1");
  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#34d399" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #34d39966" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-300">
          Planet 1 · Vocabulary Orbit
        </p>
        <p className="text-xl font-black text-white">🌍 Endangered Wildlife Atlas</p>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        {[
          { k: "l1", t: "Lesson 1 · Flashcards" },
          { k: "l5", t: "Lesson 8 · Speaking" },
        ].map((x) => (
          <button
            key={x.k}
            onClick={() => setTab(x.k)}
            className={`rounded-full px-3 py-2 text-xs font-black transition ${tab === x.k ? "text-slate-900" : "text-white"}`}
            style={
              tab === x.k
                ? { background: "linear-gradient(135deg,#bef264,#34d399)", boxShadow: "0 0 14px #34d39988" }
                : { background: "rgba(255,255,255,.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.18)" }
            }
          >
            {x.t}
          </button>
        ))}
      </div>
      {tab === "l1" ? (
        <DailyActionFlashcards addCoins={addCoins} unit={6} />
      ) : (
        <DailyPhraseSpeaking addCoins={addCoins} unit={6} />
      )}
    </div>
  );
}

export function ReadingAdventureU6({ onBack, addCoins }) {
  return <ReadingAdventureU3 onBack={onBack} addCoins={addCoins} unit={6} title="🌱 The Green Mission" />;
}

// ---------- PLANET 2 U6: Eco Goal Balancer ----------
const ECO_BALANCER_ITEMS = [
  {
    sentence: "If we ___ trash, we will protect the wild rivers.",
    choices: ["recycle", "recycled", "recycling"],
    correct: 0,
  },
  { sentence: "What ___ happen if the oceans become too warm?", choices: ["will", "does", "did"], correct: 0 },
  {
    sentence: "We ___ turn off the computer when we leave the room.",
    choices: ["should", "shouldn't", "are"],
    correct: 0,
  },
  {
    sentence: "If people ___ more trees, the forests will grow fast.",
    choices: ["plant", "plants", "planting"],
    correct: 0,
  },
];
export function EcoBalancer({ onBack, addCoins }) {
  const [idx, setIdx] = useState(0);
  const [pick, setPick] = useState(null);
  const [flash, setFlash] = useState(null);
  const [done, setDone] = useState(false);
  const awarded = useRef(false);
  const cur = ECO_BALANCER_ITEMS[idx];

  function choose(i) {
    if (pick !== null || done) return;
    setPick(i);
    const ok = i === cur.correct;
    setFlash(ok ? "ok" : "bad");
    setTimeout(() => {
      setFlash(null);
      setPick(null);
      if (!ok) return;
      if (idx + 1 >= ECO_BALANCER_ITEMS.length) {
        if (!awarded.current) {
          awarded.current = true;
          addCoins?.(15);
          try {
            confetti({ particleCount: 200, spread: 110, origin: { y: 0.6 } });
          } catch {}
        }
        setDone(true);
      } else setIdx((n) => n + 1);
    }, 900);
  }
  function reset() {
    setIdx(0);
    setPick(null);
    setFlash(null);
    setDone(false);
    awarded.current = false;
  }

  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#34d399" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #34d39966" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-300">
          Planet 2 · Grammar Black Hole
        </p>
        <p className="text-xl font-black text-white">🌱 Eco Goal Balancer</p>
        <p className="text-[11px] font-bold text-indigo-200">Tap a green crystal to complete the eco rule.</p>
      </div>

      {!done ? (
        <>
          <div className="mb-3 flex items-center justify-between text-xs font-bold text-indigo-200">
            <span>
              Goal {idx + 1} / {ECO_BALANCER_ITEMS.length}
            </span>
            <button
              onClick={reset}
              className="rounded-full bg-white/10 px-3 py-1 font-black text-emerald-200 ring-1 ring-white/20"
            >
              Reset
            </button>
          </div>

          <div
            className="rounded-3xl gx-glass p-5 text-center"
            style={{
              boxShadow:
                flash === "ok" ? "0 0 22px #34d399" : flash === "bad" ? "0 0 22px #f43f5e" : "0 0 14px #34d39955",
            }}
          >
            <div className="text-6xl" style={{ filter: "drop-shadow(0 0 12px #34d399cc)" }}>
              🌍
            </div>
            <p className="mt-3 text-base font-black text-white">{cur.sentence}</p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {cur.choices.map((c, i) => {
              const isPick = pick === i;
              const showRight = pick !== null && i === cur.correct;
              const showWrong = isPick && i !== cur.correct;
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={pick !== null}
                  className="relative rounded-2xl px-2 py-4 text-sm font-black text-white transition active:scale-95 disabled:opacity-60"
                  style={{
                    background: showRight
                      ? "linear-gradient(135deg,#10b981,#34d399)"
                      : showWrong
                        ? "linear-gradient(135deg,#f43f5e,#fb7185)"
                        : "radial-gradient(circle at 30% 30%, #bef264, #15803d 70%)",
                    boxShadow: isPick ? "0 0 14px #34d399" : "0 0 12px #34d39966, inset 0 0 0 1px #bef26466",
                    animation: "csnFloat 3s ease-in-out infinite",
                  }}
                >
                  <div className="text-2xl">💚</div>
                  <div className="mt-1">{c}</div>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="rounded-3xl gx-glass p-5 text-center" style={{ boxShadow: "0 0 22px #34d399" }}>
          <p className="text-2xl font-black text-white">🌳 Forest restored!</p>
          <p className="mt-1 text-sm font-bold text-indigo-200">All eco goals balanced. +15 coins awarded!</p>
          <div className="mt-3 flex justify-center gap-2">
            <button
              onClick={reset}
              className="rounded-full px-4 py-2 text-sm font-black text-slate-900"
              style={{ background: "linear-gradient(135deg,#bef264,#34d399)", boxShadow: "0 0 14px #34d39988" }}
            >
              Replay
            </button>
            <button
              onClick={onBack}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white ring-1 ring-white/20"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- PLANET 5 U6 · Mode A: Phonics Rocket -au-/-aw- ----------
const PHONICS_ITEMS_U6 = [
  { word: "autumn", sound: "au" },
  { word: "sauce", sound: "au" },
  { word: "astronaut", sound: "au" },
  { word: "saw", sound: "aw" },
  { word: "draw", sound: "aw" },
  { word: "straw", sound: "aw" },
];
function PhonicsRocketU6({ addCoins }) {
  const [queue, setQueue] = useState(() => shuffle(PHONICS_ITEMS_U6));
  const [pos, setPos] = useState(0);
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState(null);
  const [done, setDone] = useState(false);
  const cur = queue[pos];
  function pick(sound) {
    if (flash || done) return;
    const ok = sound === cur.sound;
    setFlash({ ok, target: sound });
    if (ok) {
      setScore((s) => s + 1);
      addCoins?.(2);
    }
    setTimeout(() => {
      setFlash(null);
      if (pos + 1 >= queue.length) {
        setDone(true);
        try {
          confetti({ particleCount: 130, spread: 80, origin: { y: 0.6 } });
        } catch {}
      } else setPos((p) => p + 1);
    }, 700);
  }
  function reset() {
    setQueue(shuffle(PHONICS_ITEMS_U6));
    setPos(0);
    setScore(0);
    setDone(false);
    setFlash(null);
  }
  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs font-bold text-indigo-200">
        <span>
          Word {Math.min(pos + 1, queue.length)} / {queue.length}
        </span>
        <span>
          Correct: <b className="text-white">{score}</b>
        </span>
        <button
          onClick={reset}
          className="rounded-full bg-white/10 px-3 py-1 font-black text-emerald-200 ring-1 ring-white/20"
        >
          Reset
        </button>
      </div>
      {!done ? (
        <>
          <div className="rounded-3xl gx-glass p-5 text-center" style={{ boxShadow: "0 0 18px #34d39944" }}>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-300">
              Which spelling suffix does this word use?
            </p>
            <p className="mt-2 text-3xl font-black tracking-wide text-white">{cur.word}</p>
            <button
              onClick={() => speak(cur.word)}
              className="mt-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-emerald-200 ring-1 ring-white/20"
            >
              🔊 Hear it
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              {
                id: "au",
                label: "Suffix -au- (autumn)",
                grad: "linear-gradient(135deg,#84cc16,#16a34a)",
                glow: "#84cc16",
              },
              {
                id: "aw",
                label: "Suffix -aw- (saw)",
                grad: "linear-gradient(135deg,#06b6d4,#3b82f6)",
                glow: "#06b6d4",
              },
            ].map((r) => {
              const showRight = flash && r.id === cur.sound;
              const showWrong = flash && r.id === flash.target && !flash.ok;
              return (
                <button
                  key={r.id}
                  onClick={() => pick(r.id)}
                  disabled={!!flash}
                  className="relative flex h-40 flex-col items-center justify-end rounded-3xl pb-4 text-white shadow-xl transition active:scale-95"
                  style={{ background: r.grad, boxShadow: `0 0 18px ${r.glow}88, inset 0 0 0 1px ${r.glow}` }}
                >
                  <div className="text-6xl" style={{ filter: `drop-shadow(0 0 10px ${r.glow})` }}>
                    🚀
                  </div>
                  <div className="mt-1 rounded-full bg-white/20 px-4 py-1 text-sm font-black tracking-wide">
                    {r.label}
                  </div>
                  {showRight && (
                    <div className="absolute inset-0 grid place-items-center rounded-3xl bg-emerald-500/35 text-5xl">
                      ✓
                    </div>
                  )}
                  {showWrong && (
                    <div className="absolute inset-0 grid place-items-center rounded-3xl bg-rose-500/35 text-5xl">
                      ✗
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {flash && (
            <p className="mt-3 text-center text-sm font-black" style={{ color: flash.ok ? "#34d399" : "#fda4af" }}>
              {flash.ok ? `🎉 ${cur.word} → -${cur.sound}-  +2 coins` : `Almost! "${cur.word}" → -${cur.sound}-`}
            </p>
          )}
        </>
      ) : (
        <div className="rounded-3xl gx-glass p-5 text-center" style={{ boxShadow: "0 0 22px #34d399" }}>
          <p className="text-2xl font-black text-white">🌠 Phonics Mission Complete!</p>
          <p className="mt-1 text-sm font-bold text-indigo-200">
            Score: {score}/{queue.length}
          </p>
          <button
            onClick={reset}
            className="mt-3 rounded-full px-4 py-2 text-sm font-black text-slate-900"
            style={{ background: "linear-gradient(135deg,#bef264,#34d399)", boxShadow: "0 0 14px #34d39988" }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- PLANET 5 U6 · Mode B: Alien Trivia Quest ----------
const TRIVIA_QUESTIONS_U6 = [
  {
    q: "Which animal lives in the icy Arctic?",
    choices: ["polar bear", "orangutan", "blue whale", "snow leopard"],
    correct: 0,
  },
  {
    q: "If we don't protect the giant pandas, they ___ disappear.",
    choices: ["will", "do", "were", "are"],
    correct: 0,
  },
  { q: "We ___ turn off the lights to save energy.", choices: ["should", "shouldn't", "didn't", "won't"], correct: 0 },
  {
    q: "Which action helps save trees and forests?",
    choices: ["recycle paper", "waste water", "throw plastic", "drive more"],
    correct: 0,
  },
  { q: "What harms sea turtles the most in the ocean?", choices: ["plastic", "sand", "seaweed", "coral"], correct: 0 },
  {
    q: "If people ___ more trees, the air will be cleaner.",
    choices: ["plant", "plants", "planted", "planting"],
    correct: 0,
  },
  { q: "Which word uses the -aw- suffix sound?", choices: ["draw", "sauce", "autumn", "astronaut"], correct: 0 },
  {
    q: "Which big animal is endangered in the deep ocean?",
    choices: ["blue whale", "mountain gorilla", "black rhino", "panda"],
    correct: 0,
  },
];
function AlienTriviaU6({ addCoins }) {
  const [pool] = useState(() => shuffle(TRIVIA_QUESTIONS_U6));
  const [idx, setIdx] = useState(0);
  const [pick, setPick] = useState(null);
  const [killed, setKilled] = useState(new Set());
  const [fiftyLeft, setFiftyLeft] = useState(1);
  const [shieldLeft, setShieldLeft] = useState(1);
  const [shieldArmed, setShieldArmed] = useState(false);
  const [hearts, setHearts] = useState(3);
  const [done, setDone] = useState(null);
  const awarded = useRef(false);
  const q = pool[idx];
  function choose(i) {
    if (pick !== null || done) return;
    setPick(i);
    const ok = i === q.correct;
    if (!ok) {
      if (shieldArmed) {
        setShieldArmed(false);
        setTimeout(() => nextQ(true), 1100);
        return;
      }
      setHearts((h) => {
        const nh = h - 1;
        if (nh <= 0) setTimeout(() => setDone("lose"), 900);
        return nh;
      });
    }
    setTimeout(() => nextQ(ok), 1000);
  }
  function nextQ(_ok) {
    if (idx + 1 >= pool.length) {
      if (!awarded.current && hearts > 0) {
        awarded.current = true;
        addCoins?.(30);
        try {
          confetti({ particleCount: 220, spread: 110, startVelocity: 60, origin: { y: 0.6 } });
        } catch {}
        setDone("win");
      }
      return;
    }
    setIdx((n) => n + 1);
    setPick(null);
    setKilled(new Set());
  }
  function useFifty() {
    if (fiftyLeft <= 0 || pick !== null) return;
    const wrongs = q.choices.map((_, i) => i).filter((i) => i !== q.correct);
    const kill = shuffle(wrongs).slice(0, 2);
    setKilled(new Set(kill));
    setFiftyLeft((n) => n - 1);
  }
  function useShield() {
    if (shieldLeft <= 0 || shieldArmed || pick !== null) return;
    setShieldArmed(true);
    setShieldLeft((n) => n - 1);
  }
  function restart() {
    setIdx(0);
    setPick(null);
    setKilled(new Set());
    setFiftyLeft(1);
    setShieldLeft(1);
    setShieldArmed(false);
    setHearts(3);
    setDone(null);
    awarded.current = false;
  }

  if (done === "win")
    return (
      <div className="rounded-3xl gx-glass p-6 text-center" style={{ boxShadow: "0 0 28px #34d399" }}>
        <div className="text-5xl">🎆🌍🛸</div>
        <p className="mt-2 text-2xl font-black text-white">Wildlife Drone Rescued!</p>
        <p className="mt-1 text-sm font-bold text-indigo-200">+30 coins secured to your profile. Planet protected!</p>
        <button
          onClick={restart}
          className="mt-4 rounded-full px-4 py-2 text-sm font-black text-slate-900"
          style={{ background: "linear-gradient(135deg,#bef264,#34d399)", boxShadow: "0 0 14px #34d399" }}
        >
          Play Again
        </button>
      </div>
    );
  if (done === "lose")
    return (
      <div className="rounded-3xl gx-glass p-6 text-center" style={{ boxShadow: "0 0 22px #f43f5e88" }}>
        <div className="text-5xl">💥</div>
        <p className="mt-2 text-2xl font-black text-white">Mission Failed</p>
        <p className="mt-1 text-sm font-bold text-rose-200">The eco crisis worsened! Try again, ranger!</p>
        <button
          onClick={restart}
          className="mt-4 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white ring-1 ring-white/20"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs font-bold text-indigo-200">
        <span>
          Question {idx + 1} / {pool.length}
        </span>
        <span>
          {"❤️".repeat(hearts)}
          {"🖤".repeat(3 - hearts)}
        </span>
      </div>
      <div className="rounded-3xl gx-glass p-4" style={{ boxShadow: "0 0 18px #34d39955" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-300">🛸 Alien Trivia Quest</p>
        <p className="mt-1 text-base font-black text-white">{q.q}</p>
        <div className="mt-3 grid gap-2">
          {q.choices.map((c, i) => {
            const isPick = pick === i;
            const showRight = pick !== null && i === q.correct;
            const showWrong = isPick && i !== q.correct;
            const isKilled = killed.has(i);
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={isKilled || pick !== null}
                className="rounded-2xl px-3 py-3 text-left text-sm font-black text-white transition active:scale-95 disabled:opacity-30"
                style={{
                  background: showRight
                    ? "linear-gradient(135deg,#10b981,#34d399)"
                    : showWrong
                      ? "linear-gradient(135deg,#f43f5e,#fb7185)"
                      : "linear-gradient(135deg,#064e3b,#15803d)",
                  boxShadow: isPick ? "0 0 14px #34d39988" : "inset 0 0 0 1px #34d39955",
                  textDecoration: isKilled ? "line-through" : "none",
                }}
              >
                <span className="mr-2">{String.fromCharCode(65 + i)}.</span>
                {c}
              </button>
            );
          })}
        </div>
        {shieldArmed && (
          <p className="mt-3 text-center text-xs font-black text-cyan-200">
            🛡️ Cosmic Shield armed — one wrong answer will be blocked.
          </p>
        )}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={useFifty}
          disabled={fiftyLeft <= 0 || pick !== null}
          className="rounded-2xl px-3 py-3 text-xs font-black text-white transition active:scale-95 disabled:opacity-40"
          style={{ background: "linear-gradient(135deg,#84cc16,#16a34a)", boxShadow: "0 0 14px #84cc1688" }}
        >
          🔫 Laser Beam 50:50 <span className="ml-1 opacity-80">({fiftyLeft})</span>
        </button>
        <button
          onClick={useShield}
          disabled={shieldLeft <= 0 || shieldArmed || pick !== null}
          className="rounded-2xl px-3 py-3 text-xs font-black text-white transition active:scale-95 disabled:opacity-40"
          style={{ background: "linear-gradient(135deg,#06b6d4,#3b82f6)", boxShadow: "0 0 14px #06b6d488" }}
        >
          🛡️ Cosmic Shield <span className="ml-1 opacity-80">({shieldLeft})</span>
        </button>
      </div>
    </div>
  );
}

export function Planet5ArenaU6({ onBack, addCoins }) {
  const [mode, setMode] = useState("a");
  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#34d399" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #34d39966" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-300">
          Planet 5 · Supernova Quiz Arena
        </p>
        <p className="text-xl font-black text-white">🏆 Choose your challenge</p>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        {[
          { k: "a", t: "🚀 Phonics Rocket" },
          { k: "b", t: "🛸 Alien Trivia" },
        ].map((x) => (
          <button
            key={x.k}
            onClick={() => setMode(x.k)}
            className={`rounded-full px-3 py-2 text-xs font-black transition ${mode === x.k ? "text-slate-900" : "text-white"}`}
            style={
              mode === x.k
                ? { background: "linear-gradient(135deg,#bef264,#34d399)", boxShadow: "0 0 14px #34d399" }
                : { background: "rgba(255,255,255,.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.18)" }
            }
          >
            {x.t}
          </button>
        ))}
      </div>
      {mode === "a" ? <PhonicsRocketU6 addCoins={addCoins} /> : <AlienTriviaU6 addCoins={addCoins} />}
    </div>
  );
}

// =================================================================
// UNIT 8 · On Vacation! — Vocabulary / Grammar / Reading / Arena
// =================================================================
export function VocabularyQuestU8({ onBack, addCoins }) {
  const [tab, setTab] = useState("l1");
  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#22d3ee" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #22d3ee66" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-300">
          Planet 1 · Vocabulary Orbit
        </p>
        <p className="text-xl font-black text-white">🛳️ Galactic Travel Atlas</p>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        {[
          { k: "l1", t: "Lesson 1 · Flashcards" },
          { k: "l5", t: "Lesson 8 · Speaking" },
        ].map((x) => (
          <button
            key={x.k}
            onClick={() => setTab(x.k)}
            className={`rounded-full px-3 py-2 text-xs font-black transition ${tab === x.k ? "text-slate-900" : "text-white"}`}
            style={
              tab === x.k
                ? { background: "linear-gradient(135deg,#67e8f9,#3b82f6)", boxShadow: "0 0 14px #22d3ee88" }
                : { background: "rgba(255,255,255,.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.18)" }
            }
          >
            {x.t}
          </button>
        ))}
      </div>
      {tab === "l1" ? (
        <DailyActionFlashcards addCoins={addCoins} unit={8} />
      ) : (
        <DailyPhraseSpeaking addCoins={addCoins} unit={8} />
      )}
    </div>
  );
}

export function ReadingAdventureU8({ onBack, addCoins }) {
  return <ReadingAdventureU3 onBack={onBack} addCoins={addCoins} unit={8} title="🛳️ The Galactic Vacation" />;
}

// ---------- PLANET 2 U8: Nebula Perfect Gateway ----------
const NEBULA_GATEWAY_ITEMS = [
  { sentence: "Have you ___ gone on a luxury cruise ship?", choices: ["ever", "yet", "already"], correct: 0 },
  { sentence: "I have ___ stayed in a five-star hotel. I love it!", choices: ["already", "yet", "ever"], correct: 0 },
  { sentence: "We haven't visited the history museum ___.", choices: ["yet", "already", "never"], correct: 0 },
  {
    sentence: "She has ___ seen a Broadway show before. This is her first time!",
    choices: ["never", "yet", "already"],
    correct: 0,
  },
];
export function NebulaGateway({ onBack, addCoins }) {
  const [idx, setIdx] = useState(0);
  const [pick, setPick] = useState(null);
  const [flash, setFlash] = useState(null);
  const [done, setDone] = useState(false);
  const awarded = useRef(false);
  const cur = NEBULA_GATEWAY_ITEMS[idx];

  function choose(i) {
    if (pick !== null || done) return;
    setPick(i);
    const ok = i === cur.correct;
    setFlash(ok ? "ok" : "bad");
    setTimeout(() => {
      setFlash(null);
      setPick(null);
      if (!ok) return;
      if (idx + 1 >= NEBULA_GATEWAY_ITEMS.length) {
        if (!awarded.current) {
          awarded.current = true;
          addCoins?.(15);
          try {
            confetti({ particleCount: 200, spread: 110, origin: { y: 0.6 } });
          } catch {}
        }
        setDone(true);
      } else setIdx((n) => n + 1);
    }, 900);
  }
  function reset() {
    setIdx(0);
    setPick(null);
    setFlash(null);
    setDone(false);
    awarded.current = false;
  }

  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#22d3ee" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #22d3ee66" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-300">
          Planet 2 · Grammar Black Hole
        </p>
        <p className="text-xl font-black text-white">🌌 Nebula Perfect Gateway</p>
        <p className="text-[11px] font-bold text-indigo-200">Tap a fuel crystal to open the hyper-drive gateway.</p>
      </div>

      {!done ? (
        <>
          <div className="mb-3 flex items-center justify-between text-xs font-bold text-indigo-200">
            <span>
              Gate {idx + 1} / {NEBULA_GATEWAY_ITEMS.length}
            </span>
            <button
              onClick={reset}
              className="rounded-full bg-white/10 px-3 py-1 font-black text-cyan-200 ring-1 ring-white/20"
            >
              Reset
            </button>
          </div>

          <div
            className="rounded-3xl gx-glass p-5 text-center"
            style={{
              boxShadow:
                flash === "ok" ? "0 0 22px #22d3ee" : flash === "bad" ? "0 0 22px #f43f5e" : "0 0 14px #22d3ee55",
            }}
          >
            <div className="text-6xl" style={{ filter: "drop-shadow(0 0 12px #22d3eecc)" }}>
              🌠
            </div>
            <p className="mt-3 text-base font-black text-white">{cur.sentence}</p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {cur.choices.map((c, i) => {
              const isPick = pick === i;
              const showRight = pick !== null && i === cur.correct;
              const showWrong = isPick && i !== cur.correct;
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={pick !== null}
                  className="relative rounded-2xl px-2 py-4 text-sm font-black text-white transition active:scale-95 disabled:opacity-60"
                  style={{
                    background: showRight
                      ? "linear-gradient(135deg,#10b981,#34d399)"
                      : showWrong
                        ? "linear-gradient(135deg,#f43f5e,#fb7185)"
                        : "radial-gradient(circle at 30% 30%, #67e8f9, #1e3a8a 70%)",
                    boxShadow: isPick ? "0 0 14px #22d3ee" : "0 0 12px #22d3ee66, inset 0 0 0 1px #67e8f966",
                    animation: "csnFloat 3s ease-in-out infinite",
                  }}
                >
                  <div className="text-2xl">💎</div>
                  <div className="mt-1">{c}</div>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="rounded-3xl gx-glass p-5 text-center" style={{ boxShadow: "0 0 22px #22d3ee" }}>
          <p className="text-2xl font-black text-white">🌌 Gateway opened!</p>
          <p className="mt-1 text-sm font-bold text-indigo-200">Hyper-drive engaged. +15 coins awarded!</p>
          <div className="mt-3 flex justify-center gap-2">
            <button
              onClick={reset}
              className="rounded-full px-4 py-2 text-sm font-black text-slate-900"
              style={{ background: "linear-gradient(135deg,#67e8f9,#3b82f6)", boxShadow: "0 0 14px #22d3ee88" }}
            >
              Replay
            </button>
            <button
              onClick={onBack}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white ring-1 ring-white/20"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- PLANET 5 U8 · Mode A: Phonics Rocket silent k-/w- ----------
const PHONICS_ITEMS_U8 = [
  { word: "knee", sound: "k" },
  { word: "knife", sound: "k" },
  { word: "knit", sound: "k" },
  { word: "write", sound: "w" },
  { word: "wrong", sound: "w" },
  { word: "wrap", sound: "w" },
];
function PhonicsRocketU8({ addCoins }) {
  const [queue, setQueue] = useState(() => shuffle(PHONICS_ITEMS_U8));
  const [pos, setPos] = useState(0);
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState(null);
  const [done, setDone] = useState(false);
  const cur = queue[pos];
  function pick(sound) {
    if (flash || done) return;
    const ok = sound === cur.sound;
    setFlash({ ok, target: sound });
    if (ok) {
      setScore((s) => s + 1);
      addCoins?.(2);
    }
    setTimeout(() => {
      setFlash(null);
      if (pos + 1 >= queue.length) {
        setDone(true);
        try {
          confetti({ particleCount: 130, spread: 80, origin: { y: 0.6 } });
        } catch {}
      } else setPos((p) => p + 1);
    }, 700);
  }
  function reset() {
    setQueue(shuffle(PHONICS_ITEMS_U8));
    setPos(0);
    setScore(0);
    setDone(false);
    setFlash(null);
  }
  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs font-bold text-indigo-200">
        <span>
          Word {Math.min(pos + 1, queue.length)} / {queue.length}
        </span>
        <span>
          Correct: <b className="text-white">{score}</b>
        </span>
        <button
          onClick={reset}
          className="rounded-full bg-white/10 px-3 py-1 font-black text-cyan-200 ring-1 ring-white/20"
        >
          Reset
        </button>
      </div>
      {!done ? (
        <>
          <div className="rounded-3xl gx-glass p-5 text-center" style={{ boxShadow: "0 0 18px #22d3ee44" }}>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-300">
              Which silent letter starts this word?
            </p>
            <p className="mt-2 text-3xl font-black tracking-wide text-white">{cur.word}</p>
            <button
              onClick={() => speak(cur.word)}
              className="mt-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-cyan-200 ring-1 ring-white/20"
            >
              🔊 Hear it
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { id: "k", label: "Silent k- (knee)", grad: "linear-gradient(135deg,#67e8f9,#0891b2)", glow: "#22d3ee" },
              { id: "w", label: "Silent w- (write)", grad: "linear-gradient(135deg,#a78bfa,#6d28d9)", glow: "#a78bfa" },
            ].map((r) => {
              const showRight = flash && r.id === cur.sound;
              const showWrong = flash && r.id === flash.target && !flash.ok;
              return (
                <button
                  key={r.id}
                  onClick={() => pick(r.id)}
                  disabled={!!flash}
                  className="relative flex h-40 flex-col items-center justify-end rounded-3xl pb-4 text-white shadow-xl transition active:scale-95"
                  style={{ background: r.grad, boxShadow: `0 0 18px ${r.glow}88, inset 0 0 0 1px ${r.glow}` }}
                >
                  <div className="text-6xl" style={{ filter: `drop-shadow(0 0 10px ${r.glow})` }}>
                    🚀
                  </div>
                  <div className="mt-1 rounded-full bg-white/20 px-4 py-1 text-sm font-black tracking-wide">
                    {r.label}
                  </div>
                  {showRight && (
                    <div className="absolute inset-0 grid place-items-center rounded-3xl bg-emerald-500/35 text-5xl">
                      ✓
                    </div>
                  )}
                  {showWrong && (
                    <div className="absolute inset-0 grid place-items-center rounded-3xl bg-rose-500/35 text-5xl">
                      ✗
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {flash && (
            <p className="mt-3 text-center text-sm font-black" style={{ color: flash.ok ? "#34d399" : "#fda4af" }}>
              {flash.ok
                ? `🎉 ${cur.word} → silent ${cur.sound}-  +2 coins`
                : `Almost! "${cur.word}" → silent ${cur.sound}-`}
            </p>
          )}
        </>
      ) : (
        <div className="rounded-3xl gx-glass p-5 text-center" style={{ boxShadow: "0 0 22px #22d3ee" }}>
          <p className="text-2xl font-black text-white">🌠 Phonics Mission Complete!</p>
          <p className="mt-1 text-sm font-bold text-indigo-200">
            Score: {score}/{queue.length}
          </p>
          <button
            onClick={reset}
            className="mt-3 rounded-full px-4 py-2 text-sm font-black text-slate-900"
            style={{ background: "linear-gradient(135deg,#67e8f9,#3b82f6)", boxShadow: "0 0 14px #22d3ee88" }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- PLANET 5 U8 · Mode B: Alien Trivia Quest ----------
const TRIVIA_QUESTIONS_U8 = [
  {
    q: "Which activity means traveling on a big ship?",
    choices: ["go on a cruise", "visit a museum", "see a show", "check in"],
    correct: 0,
  },
  { q: "Have you ___ stayed in a luxury hotel?", choices: ["ever", "yet", "already", "never"], correct: 0 },
  { q: "We have ___ bought souvenirs for our family.", choices: ["already", "yet", "ever", "since"], correct: 0 },
  { q: "She hasn't visited the theme park ___.", choices: ["yet", "already", "ever", "never"], correct: 0 },
  {
    q: "Which action do you do BEFORE you board the plane?",
    choices: ["check in", "explore the city", "see a show", "buy souvenirs"],
    correct: 0,
  },
  { q: "Which word starts with a silent k-?", choices: ["knee", "write", "wrap", "theme"], correct: 0 },
  {
    q: "Past form of 'buy souvenirs' is ___.",
    choices: ["bought souvenirs", "buyed souvenirs", "buys souvenirs", "buying"],
    correct: 0,
  },
  {
    q: "Which place do you visit to learn history?",
    choices: ["a museum", "the beach", "a theme park", "a hotel"],
    correct: 0,
  },
];
function AlienTriviaU8({ addCoins }) {
  const [pool] = useState(() => shuffle(TRIVIA_QUESTIONS_U8));
  const [idx, setIdx] = useState(0);
  const [pick, setPick] = useState(null);
  const [killed, setKilled] = useState(new Set());
  const [fiftyLeft, setFiftyLeft] = useState(1);
  const [shieldLeft, setShieldLeft] = useState(1);
  const [shieldArmed, setShieldArmed] = useState(false);
  const [hearts, setHearts] = useState(3);
  const [done, setDone] = useState(null);
  const awarded = useRef(false);
  const q = pool[idx];
  function choose(i) {
    if (pick !== null || done) return;
    setPick(i);
    const ok = i === q.correct;
    if (!ok) {
      if (shieldArmed) {
        setShieldArmed(false);
        setTimeout(() => nextQ(true), 1100);
        return;
      }
      setHearts((h) => {
        const nh = h - 1;
        if (nh <= 0) setTimeout(() => setDone("lose"), 900);
        return nh;
      });
    }
    setTimeout(() => nextQ(ok), 1000);
  }
  function nextQ(_ok) {
    if (idx + 1 >= pool.length) {
      if (!awarded.current && hearts > 0) {
        awarded.current = true;
        addCoins?.(30);
        try {
          confetti({ particleCount: 220, spread: 110, startVelocity: 60, origin: { y: 0.6 } });
        } catch {}
        setDone("win");
      }
      return;
    }
    setIdx((n) => n + 1);
    setPick(null);
    setKilled(new Set());
  }
  function useFifty() {
    if (fiftyLeft <= 0 || pick !== null) return;
    const wrongs = q.choices.map((_, i) => i).filter((i) => i !== q.correct);
    const kill = shuffle(wrongs).slice(0, 2);
    setKilled(new Set(kill));
    setFiftyLeft((n) => n - 1);
  }
  function useShield() {
    if (shieldLeft <= 0 || shieldArmed || pick !== null) return;
    setShieldArmed(true);
    setShieldLeft((n) => n - 1);
  }
  function restart() {
    setIdx(0);
    setPick(null);
    setKilled(new Set());
    setFiftyLeft(1);
    setShieldLeft(1);
    setShieldArmed(false);
    setHearts(3);
    setDone(null);
    awarded.current = false;
  }

  if (done === "win")
    return (
      <div className="rounded-3xl gx-glass p-6 text-center" style={{ boxShadow: "0 0 28px #22d3ee" }}>
        <div className="text-5xl">🎆🛳️🛸</div>
        <p className="mt-2 text-2xl font-black text-white">Reward Chamber Unlocked!</p>
        <p className="mt-1 text-sm font-bold text-indigo-200">+30 coins secured to your profile. Bon voyage!</p>
        <button
          onClick={restart}
          className="mt-4 rounded-full px-4 py-2 text-sm font-black text-slate-900"
          style={{ background: "linear-gradient(135deg,#67e8f9,#3b82f6)", boxShadow: "0 0 14px #22d3ee" }}
        >
          Play Again
        </button>
      </div>
    );
  if (done === "lose")
    return (
      <div className="rounded-3xl gx-glass p-6 text-center" style={{ boxShadow: "0 0 22px #f43f5e88" }}>
        <div className="text-5xl">💥</div>
        <p className="mt-2 text-2xl font-black text-white">Mission Failed</p>
        <p className="mt-1 text-sm font-bold text-rose-200">The starship lost course! Try again, traveler!</p>
        <button
          onClick={restart}
          className="mt-4 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white ring-1 ring-white/20"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs font-bold text-indigo-200">
        <span>
          Question {idx + 1} / {pool.length}
        </span>
        <span>
          {"❤️".repeat(hearts)}
          {"🖤".repeat(3 - hearts)}
        </span>
      </div>
      <div className="rounded-3xl gx-glass p-4" style={{ boxShadow: "0 0 18px #22d3ee55" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-300">🛸 Alien Trivia Quest</p>
        <p className="mt-1 text-base font-black text-white">{q.q}</p>
        <div className="mt-3 grid gap-2">
          {q.choices.map((c, i) => {
            const isPick = pick === i;
            const showRight = pick !== null && i === q.correct;
            const showWrong = isPick && i !== q.correct;
            const isKilled = killed.has(i);
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={isKilled || pick !== null}
                className="rounded-2xl px-3 py-3 text-left text-sm font-black text-white transition active:scale-95 disabled:opacity-30"
                style={{
                  background: showRight
                    ? "linear-gradient(135deg,#10b981,#34d399)"
                    : showWrong
                      ? "linear-gradient(135deg,#f43f5e,#fb7185)"
                      : "linear-gradient(135deg,#0e7490,#1e3a8a)",
                  boxShadow: isPick ? "0 0 14px #22d3ee88" : "inset 0 0 0 1px #22d3ee55",
                  textDecoration: isKilled ? "line-through" : "none",
                }}
              >
                <span className="mr-2">{String.fromCharCode(65 + i)}.</span>
                {c}
              </button>
            );
          })}
        </div>
        {shieldArmed && (
          <p className="mt-3 text-center text-xs font-black text-cyan-200">
            🛡️ Cosmic Shield armed — one wrong answer will be blocked.
          </p>
        )}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={useFifty}
          disabled={fiftyLeft <= 0 || pick !== null}
          className="rounded-2xl px-3 py-3 text-xs font-black text-white transition active:scale-95 disabled:opacity-40"
          style={{ background: "linear-gradient(135deg,#67e8f9,#0891b2)", boxShadow: "0 0 14px #22d3ee88" }}
        >
          🔫 Laser Beam 50:50 <span className="ml-1 opacity-80">({fiftyLeft})</span>
        </button>
        <button
          onClick={useShield}
          disabled={shieldLeft <= 0 || shieldArmed || pick !== null}
          className="rounded-2xl px-3 py-3 text-xs font-black text-white transition active:scale-95 disabled:opacity-40"
          style={{ background: "linear-gradient(135deg,#a78bfa,#6d28d9)", boxShadow: "0 0 14px #a78bfa88" }}
        >
          🛡️ Cosmic Shield <span className="ml-1 opacity-80">({shieldLeft})</span>
        </button>
      </div>
    </div>
  );
}

export function Planet5ArenaU8({ onBack, addCoins }) {
  const [mode, setMode] = useState("a");
  return (
    <div className="ac-fade">
      <BackBar onBack={onBack} color="#22d3ee" />
      <div className="mb-3 rounded-3xl p-4 text-center gx-glass" style={{ boxShadow: "0 0 18px #22d3ee66" }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-300">
          Planet 5 · Supernova Quiz Arena
        </p>
        <p className="text-xl font-black text-white">🏆 Choose your challenge</p>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        {[
          { k: "a", t: "🚀 Phonics Rocket" },
          { k: "b", t: "🛸 Alien Trivia" },
        ].map((x) => (
          <button
            key={x.k}
            onClick={() => setMode(x.k)}
            className={`rounded-full px-3 py-2 text-xs font-black transition ${mode === x.k ? "text-slate-900" : "text-white"}`}
            style={
              mode === x.k
                ? { background: "linear-gradient(135deg,#67e8f9,#3b82f6)", boxShadow: "0 0 14px #22d3ee" }
                : { background: "rgba(255,255,255,.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.18)" }
            }
          >
            {x.t}
          </button>
        ))}
      </div>
      {mode === "a" ? <PhonicsRocketU8 addCoins={addCoins} /> : <AlienTriviaU8 addCoins={addCoins} />}
    </div>
  );
}

// Backward-compat alias (deprecated name)
export const CosmicSpeakingNebula = AISpeakNebula;
