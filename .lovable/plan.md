
# Cosmic Progression Refactor — Unit 1 + Unit 2 + Profile Center

This is a large change to `src/components/AdventureCamp.tsx` (~3,750 lines). Here's exactly what I'll build before I touch code, so we agree on scope.

## 1. Cosmic Profile Center (Header)
- Database migration: add `avatar_id text` column to `public.profiles` (nullable, default `'astronaut'`).
- Header name + avatar becomes clickable → opens an animated neon modal:
  - Text input for `student_name`
  - 5-avatar grid: 👨‍🚀 Astro-Camper, 👽 Friendly Martian, 🤖 Cyber-Bot, 🐱 Star-Cat, 🚀 Rocket-Puppy (glowing neon border on selected)
  - "Save My Profile 📝" → upserts both fields to `profiles`, updates header immediately, persists on refresh
  - Header avatar emoji reflects the saved `avatar_id`

## 2. Tier Router
- `view` state stays (`levels | galaxy | hub | vocab | grammar | speaking | reading | quiz`).
- New `currentUnit` state (1 | 2). Tier 2 unlocks Unit 2 (Gadget Nebula 🌀). Units 3–8 stay locked with toast.
- Tier 3 hub subtitle becomes dynamic: `Exploring: Share It! 5 🚀 Unit {n} - {Adventure Camp | Gadget Nebula}`.
- All 5 planet routes branch on `currentUnit` and render either the existing Unit 1 component or the new Unit 2 component.

## 3. Unit 1 (kept as-is, no gameplay changes)
- Wording-only: change "Level 5" subtitle to "Share It! 5".
- All existing games (flashcards, Cosmic Grammar Smasher, AI voice, reading + T/F, Phonics Rocket + 4-in-a-row) remain intact and Supabase-synced.

## 4. Unit 2 — Gadget Nebula (NEW)
Five new planet components, each fully implemented (no stubs):

**Planet 1 — Vocabulary Orbit (Unit 2)**
- Tab toggle: "Lesson 1: Gadgets" / "Lesson 5: Tech Actions"
- L1: **Quantum Memory Match** — 4x4 grid (8 word/emoji pairs: smartwatch ⌚, laptop 💻, smartphone 📱, tablet 📟, digital camera 📷, e-reader 📖, headphones 🎧, portable speaker 🔊). Flip animation, neon pulse on match, +10 coins on clear.
- L5: Mic phrase challenge (Web Speech API) for: upload a photo, text a friend, stream a video, download a song, charge a phone, log in, print a document, search the internet. Correct → green highlight + "Play My Voice 🎧" playback via SpeechSynthesis.

**Planet 2 — Rocket Fuel: Past Continuous Mission (NEW)**
- Animated rocket sprite + 3 floating fuel-crystal answer choices per question.
- 4 questions exactly as specified (was playing / weren't / were / died).
- Correct → energy beam into engines + fuel bar fills (+10 pts). Wrong → smoke puff + stability drops.
- All 4 correct → liftoff animation + fireworks + **+15 coins** to Supabase.

**Planet 3 — AI Voice Nebula (Unit 2)**
- Past-continuous speaking prompts ("I was streaming a video", "He was texting a friend", + 4 more from the lesson). Same mic/grade/playback pattern as Unit 1.

**Planet 4 — Reading Comet (Unit 2)**
- Text passage: "Vlogging Kit & Tech Tools" (Lesson 3).
- 3 interactive True/False questions. Clearing → **+15 coins**.

**Planet 5 — Cosmic Word Hunter (NEW)**
- Glowing letter-grid (~10x10) with 6 hidden words: **coin, soil, point, boy, toy, joy** (oi/oy phonics).
- Click-drag (and tap-drag on mobile) selection. Found word → neon-gold lock-in + chime + phoneme pop-up.
- All 6 → "Master Word Hunter" badge + **+30 coins** to Supabase.

## 5. Theme & polish
- Keep existing cosmic dark blue/purple bg, neon grid, star particles.
- All new games are mobile-first (touch events on memory match, word hunter, fuel crystals).
- All animations CSS/`requestAnimationFrame`-based, no new deps.
- Coin writes use the existing `addCoins` Supabase helper (loading spinner already wired in header).

## Technical notes
- Single file: continue to extend `src/components/AdventureCamp.tsx`. New sub-components: `ProfileModal`, `VocabularyQuestU2`, `RocketFuelMission`, `AISpeakingWorldU2`, `ReadingAdventureU2`, `WordHunterArena`.
- Router map at Tier 3: `view === 'vocab' && currentUnit === 2 ? <VocabularyQuestU2 …/> : <VocabularyQuest …/>` (same shape for all 5 planets).
- Migration runs first (separate approval step), then code edits in one batch.

## Out of scope (will not touch)
- Existing Unit 1 game logic, Supabase coin sync logic, Galaxy/Header structure, auth flow.

Approve and I'll ship the migration first, then the code.
