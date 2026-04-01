import { useState, useEffect, useCallback } from "react";

const SPECIES = [
  // Common (60%)
  { name: "Codeslug", rarity: "COMMON", emoji: "🐌", color: "#7fff7f", bio: "Moves slowly but gets there. Eventually." },
  { name: "Bugbear", rarity: "COMMON", emoji: "🐻", color: "#7fff7f", bio: "Attracts errors like a magnet. Endearing." },
  { name: "Stackrat", rarity: "COMMON", emoji: "🐀", color: "#7fff7f", bio: "Hoards stack traces. Sleeps in heap memory." },
  { name: "Loopworm", rarity: "COMMON", emoji: "🪱", color: "#7fff7f", bio: "Goes around and around and around and—" },
  { name: "Nullfox", rarity: "COMMON", emoji: "🦊", color: "#7fff7f", bio: "Nothing is ever its fault. Technically correct." },
  // Uncommon (25%)
  { name: "Refactorcat", rarity: "UNCOMMON", emoji: "🐱", color: "#7fd4ff", bio: "Rewrites everything. Leaves it slightly worse." },
  { name: "Mergebird", rarity: "UNCOMMON", emoji: "🦅", color: "#7fd4ff", bio: "Flies between branches. Causes conflicts." },
  { name: "Deploydog", rarity: "UNCOMMON", emoji: "🐕", color: "#7fd4ff", bio: "Ships on Fridays. Always. No one can stop it." },
  { name: "Asynchawk", rarity: "UNCOMMON", emoji: "🦆", color: "#7fd4ff", bio: "Resolves eventually. Probably. Don't await it." },
  // Rare (10%)
  { name: "Recursimander", rarity: "RARE", emoji: "🦎", color: "#ffd700", bio: "Calls itself to solve itself. Stack: full." },
  { name: "Promisepanda", rarity: "RARE", emoji: "🐼", color: "#ffd700", bio: "Deeply committed. Sometimes rejects." },
  { name: "Kernelkong", rarity: "RARE", emoji: "🦍", color: "#ffd700", bio: "Lives at the lowest level. Very grumpy." },
  // Epic (4%)
  { name: "Gitghoul", rarity: "EPIC", emoji: "👻", color: "#ff7fff", bio: "Haunts old commits. Blames are its love language." },
  { name: "Dockerdrake", rarity: "EPIC", emoji: "🐉", color: "#ff7fff", bio: "Runs in a container. Breathes port 8080." },
  // Legendary (1%)
  { name: "Claudeling", rarity: "LEGENDARY", emoji: "✨", color: "#ff9944", bio: "Origin unknown. Extremely helpful. Surprisingly snarky." },
];

const RARITY_WEIGHTS = [
  { rarity: "COMMON", weight: 60 },
  { rarity: "UNCOMMON", weight: 25 },
  { rarity: "RARE", weight: 10 },
  { rarity: "EPIC", weight: 4 },
  { rarity: "LEGENDARY", weight: 1 },
];

function rollSpecies() {
  const roll = Math.random() * 100;
  let cumulative = 0;
  let chosenRarity = "COMMON";
  for (const { rarity, weight } of RARITY_WEIGHTS) {
    cumulative += weight;
    if (roll < cumulative) { chosenRarity = rarity; break; }
  }
  const pool = SPECIES.filter(s => s.rarity === chosenRarity);
  const species = pool[Math.floor(Math.random() * pool.length)];
  const isShiny = Math.random() < 0.05;
  return { ...species, isShiny };
}

const STAT_ICONS = { DEBUGGING: "🔧", PATIENCE: "🧘", CHAOS: "🌀", WISDOM: "📚", SNARK: "😏" };
const STAT_COLORS = { DEBUGGING: "#7fff7f", PATIENCE: "#7fd4ff", CHAOS: "#ff7f7f", WISDOM: "#ffd700", SNARK: "#ff9ff3" };

const MOODS = [
  { threshold: 80, label: "THRIVING", emoji: "😎" },
  { threshold: 60, label: "CONTENT", emoji: "🙂" },
  { threshold: 40, label: "RESTLESS", emoji: "😐" },
  { threshold: 20, label: "GRUMPY", emoji: "😤" },
  { threshold: 0,  label: "FERAL",   emoji: "🤬" },
];

function getMood(happiness) {
  return MOODS.find(m => happiness >= m.threshold) || MOODS[MOODS.length - 1];
}

const QUIPS = {
  feed: [
    "om nom nom",
    "finally. sustenance.",
    "this tastes like O(n²) complexity",
    "more snacks, fewer meetings",
    "fuel acquired",
  ],
  play: [
    "CHAOS +1",
    "wheeeee",
    "undefined behavior detected (fun)",
    "throwing exceptions for sport",
    "this is fine 🔥",
  ],
  debug: [
    "the bug is always in the last place you look",
    "have you tried turning it off and on again",
    "ah yes, a 'feature'",
    "rubber duck activated",
    "segmentation fault (core dumped)",
  ],
  rest: [
    "zzz… dreaming of clean code…",
    "consolidating memories",
    "defragmenting soul",
    "autocompact running…",
    "offline",
  ],
  idle: [
    "staring into the void",
    "reading the docs (lying)",
    "contemplating refactoring",
    "waiting for CI",
    "technically working",
    "null",
    "…",
  ],
};

function randomQuip(category) {
  const list = QUIPS[category] || QUIPS.idle;
  return list[Math.floor(Math.random() * list.length)];
}

function StatBar({ label, value }) {
  const color = STAT_COLORS[label];
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, letterSpacing: 2, marginBottom: 2 }}>
        <span style={{ color: "#888" }}>{STAT_ICONS[label]} {label}</span>
        <span style={{ color }}>{value}</span>
      </div>
      <div style={{ background: "#111", height: 6, borderRadius: 3, overflow: "hidden", border: "1px solid #222" }}>
        <div style={{
          width: `${value}%`, height: "100%", background: color,
          boxShadow: `0 0 6px ${color}`,
          transition: "width 0.4s ease",
          borderRadius: 3,
        }} />
      </div>
    </div>
  );
}

function RarityBadge({ rarity, isShiny }) {
  const colors = {
    COMMON: "#7fff7f", UNCOMMON: "#7fd4ff", RARE: "#ffd700",
    EPIC: "#ff7fff", LEGENDARY: "#ff9944"
  };
  return (
    <span style={{
      fontSize: 9, letterSpacing: 3, padding: "2px 8px",
      border: `1px solid ${colors[rarity]}`,
      color: colors[rarity],
      boxShadow: `0 0 8px ${colors[rarity]}44`,
      fontFamily: "monospace",
    }}>
      {isShiny ? "✦ " : ""}{rarity}
    </span>
  );
}

export default function Buddy() {
  const [buddy, setBuddy] = useState(null);
  const [stats, setStats] = useState(null);
  const [happiness, setHappiness] = useState(75);
  const [quip, setQuip] = useState("…");
  const [action, setAction] = useState(null);
  const [age, setAge] = useState(0);
  const [bounce, setBounce] = useState(false);
  const [blink, setBlink] = useState(false);

  const hatch = () => {
    const species = rollSpecies();
    const initStats = {
      DEBUGGING: Math.floor(Math.random() * 40 + 30),
      PATIENCE: Math.floor(Math.random() * 40 + 20),
      CHAOS: Math.floor(Math.random() * 50 + 20),
      WISDOM: Math.floor(Math.random() * 30 + 20),
      SNARK: Math.floor(Math.random() * 60 + 20),
    };
    setBuddy(species);
    setStats(initStats);
    setHappiness(70);
    setAge(0);
    setQuip(`${species.emoji} hatched! ${species.bio}`);
    setAction("hatch");
    setTimeout(() => setAction(null), 600);
  };

  useEffect(() => {
    if (!buddy) return;
    const interval = setInterval(() => {
      setHappiness(h => Math.max(0, h - Math.random() * 3));
      setAge(a => a + 1);
      if (Math.random() < 0.3) setQuip(randomQuip("idle"));
    }, 8000);
    return () => clearInterval(interval);
  }, [buddy]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 4000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  const doAction = useCallback((type) => {
    if (!buddy) return;
    setBounce(true);
    setTimeout(() => setBounce(false), 400);
    setAction(type);
    setTimeout(() => setAction(null), 600);
    setQuip(randomQuip(type));

    setStats(prev => {
      const next = { ...prev };
      if (type === "feed") { next.PATIENCE = Math.min(100, next.PATIENCE + 8); setHappiness(h => Math.min(100, h + 10)); }
      if (type === "play") { next.CHAOS = Math.min(100, next.CHAOS + 12); next.PATIENCE = Math.max(0, next.PATIENCE - 5); setHappiness(h => Math.min(100, h + 15)); }
      if (type === "debug") { next.DEBUGGING = Math.min(100, next.DEBUGGING + 10); next.WISDOM = Math.min(100, next.WISDOM + 5); setHappiness(h => Math.min(100, h + 8)); }
      if (type === "rest") { next.PATIENCE = Math.min(100, next.PATIENCE + 15); next.CHAOS = Math.max(0, next.CHAOS - 10); setHappiness(h => Math.min(100, h + 5)); }
      return next;
    });
  }, [buddy]);

  const mood = buddy ? getMood(happiness) : null;

  const buddyStyle = {
    fontSize: buddy ? 64 : 48,
    lineHeight: 1,
    transition: "transform 0.2s",
    transform: bounce ? "scale(1.25) translateY(-8px)" : "scale(1) translateY(0)",
    filter: buddy?.isShiny ? "drop-shadow(0 0 12px #fff) drop-shadow(0 0 24px gold)" : action === "play" ? "drop-shadow(0 0 8px #ff7f7f)" : "drop-shadow(0 0 6px #0f0)",
    cursor: buddy ? "pointer" : "default",
    display: "block",
    textAlign: "center",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#030303",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Courier New', monospace",
      padding: 16,
    }}>
      <style>{`@keyframes scanline { 0% { top: -100%; } 100% { top: 100%; } } @keyframes flicker { 0%,100% { opacity:1 } 92% { opacity:1 } 93% { opacity:0.85 } 94% { opacity:1 } } @keyframes pulse { 0%,100% { opacity:0.6 } 50% { opacity:1 } } @keyframes glow { 0%,100% { text-shadow: 0 0 8px #0f0,0 0 16px #0f0 } 50% { text-shadow: 0 0 4px #0f0 } } .btn:hover { filter: brightness(1.3); transform: scale(1.05); } .btn:active { transform: scale(0.97); } .btn { transition: all 0.15s; }`}</style>

      <div style={{
        width: 340,
        background: "#050505",
        border: "2px solid #1a1a1a",
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: "0 0 40px #00ff0011, 0 0 80px #00000088",
        position: "relative",
        animation: "flicker 8s infinite",
      }}>
        {/* scanline */}
        <div style={{
          position: "absolute", left: 0, right: 0, height: "30%",
          background: "linear-gradient(transparent, rgba(0,255,0,0.015), transparent)",
          animation: "scanline 6s linear infinite",
          pointerEvents: "none", zIndex: 10,
        }} />

        {/* Header */}
        <div style={{
          padding: "12px 16px",
          borderBottom: "1px solid #111",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#0f0", animation: "glow 3s infinite" }}>
              ◈ BUDDY v0.1.0
            </div>
            <div style={{ fontSize: 9, color: "#333", letterSpacing: 2 }}>APRIL 1 TEASER — LEAKED EARLY</div>
          </div>
          {buddy && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 9, color: "#444", letterSpacing: 2 }}>AGE</div>
              <div style={{ fontSize: 14, color: "#0f0" }}>{age}s</div>
            </div>
          )}
        </div>

        {/* Display */}
        <div style={{
          background: "#000",
          margin: "12px 16px",
          borderRadius: 2,
          border: "1px solid #111",
          minHeight: 180,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          padding: 12,
        }}>
          {/* CRT noise */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.03,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          }} />

          {!buddy ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🥚</div>
              <div style={{ fontSize: 10, color: "#444", letterSpacing: 3, marginBottom: 8 }}>COMPANION UNHATCHED</div>
              <div style={{ fontSize: 9, color: "#222", letterSpacing: 2 }}>PRESS HATCH TO BEGIN</div>
            </div>
          ) : (
            <>
              {/* Species info */}
              <div style={{ textAlign: "center", marginBottom: 8 }}>
                <div style={{ marginBottom: 4 }}>
                  <RarityBadge rarity={buddy.rarity} isShiny={buddy.isShiny} />
                </div>
                <div style={{
                  fontSize: 13, letterSpacing: 3, color: buddy.color,
                  textShadow: `0 0 8px ${buddy.color}`,
                }}>
                  {buddy.name.toUpperCase()}
                  {buddy.isShiny && <span style={{ fontSize: 10, marginLeft: 6, color: "#ffd700" }}>✦ SHINY</span>}
                </div>
              </div>

              {/* Creature */}
              <div onClick={() => doAction("play")} style={buddyStyle} title="Click to play!">
                {blink && buddy.emoji === "🐱" ? "😸" : buddy.emoji}
              </div>

              {/* Mood */}
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>{mood.emoji}</span>
                <span style={{ fontSize: 9, letterSpacing: 3, color: "#555" }}>{mood.label}</span>
                <div style={{ background: "#111", height: 4, width: 80, borderRadius: 2, overflow: "hidden", border: "1px solid #1a1a1a" }}>
                  <div style={{
                    width: `${happiness}%`, height: "100%",
                    background: happiness > 60 ? "#0f0" : happiness > 30 ? "#ffd700" : "#ff4444",
                    boxShadow: `0 0 4px ${happiness > 60 ? "#0f0" : "#ff4444"}`,
                    transition: "width 0.5s ease",
                  }} />
                </div>
              </div>

              {/* Quip */}
              <div style={{
                marginTop: 10, fontSize: 9, color: "#555",
                letterSpacing: 1, textAlign: "center", minHeight: 14,
                fontStyle: "italic", maxWidth: 220,
              }}>
                &gt; {quip}
              </div>
            </>
          )}
        </div>

        {/* Stats */}
        {stats && (
          <div style={{ padding: "0 16px 4px" }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: "#333", marginBottom: 6 }}>STATS</div>
            {Object.entries(stats).map(([label, value]) => (
              <StatBar key={label} label={label} value={value} />
            ))}
          </div>
        )}

        {/* Buttons */}
        <div style={{ padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {!buddy ? (
            <button className="btn" onClick={hatch} style={{
              gridColumn: "1 / -1",
              background: "transparent", border: "1px solid #0f0",
              color: "#0f0", padding: "10px", fontSize: 10, letterSpacing: 4,
              cursor: "pointer", fontFamily: "monospace",
              textShadow: "0 0 8px #0f0", boxShadow: "0 0 12px #0f022",
            }}>
              ◈ HATCH
            </button>
          ) : (
            <>
              {[
                { type: "feed", label: "🍕 FEED", color: "#7fff7f" },
                { type: "play", label: "🎮 PLAY", color: "#ff9ff3" },
                { type: "debug", label: "🔧 DEBUG", color: "#ffd700" },
                { type: "rest", label: "💤 REST", color: "#7fd4ff" },
              ].map(({ type, label, color }) => (
                <button key={type} className="btn" onClick={() => doAction(type)} style={{
                  background: "transparent", border: `1px solid ${color}22`,
                  color, padding: "8px", fontSize: 9, letterSpacing: 2,
                  cursor: "pointer", fontFamily: "monospace",
                  boxShadow: `inset 0 0 8px ${color}11`,
                }}>
                  {label}
                </button>
              ))}
              <button className="btn" onClick={hatch} style={{
                gridColumn: "1 / -1",
                background: "transparent", border: "1px solid #222",
                color: "#333", padding: "6px", fontSize: 8, letterSpacing: 3,
                cursor: "pointer", fontFamily: "monospace", marginTop: 4,
              }}>
                RELEASE & HATCH NEW
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{
          borderTop: "1px solid #0a0a0a", padding: "8px 16px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ fontSize: 8, color: "#222", letterSpacing: 2 }}>@ANTHROPIC/CLAUDE-CODE</div>
          <div style={{ fontSize: 8, color: "#1a1a1a", letterSpacing: 2 }}>FEATURE FLAG: BUDDY</div>
        </div>
      </div>
    </div>
  );
}
