"use client";

import { useEffect, useRef, useState } from "react";

type Pet = "cat" | "horse";

const pets = {
  cat: {
    name: "Рыжик",
    image: "./ryzhik-scene-v2.jpg",
    treats: [
      { emoji: "🐟", name: "рыбку", color: "#bdeaf3" },
      { emoji: "🍗", name: "курочку", color: "#ffd8ad" },
      { emoji: "🧀", name: "сыр", color: "#ffe98d" },
    ],
  },
  horse: {
    name: "Звёздочка",
    image: "./zvezdochka-scene-v2.jpg",
    treats: [
      { emoji: "🥕", name: "морковку", color: "#ffd2aa" },
      { emoji: "🍎", name: "яблоко", color: "#ffc6bd" },
      { emoji: "🌾", name: "сено", color: "#f3e1a3" },
    ],
  },
} as const;

type FlyingTreat = {
  pet: Pet;
  emoji: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
};

function playSound(kind: "happy" | "sleep" | "bite", enabled = true) {
  if (!enabled) return;
  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const notes = kind === "happy" ? [520, 660, 820] : kind === "bite" ? [230, 175, 205] : [520, 440, 350];
  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = context.currentTime + index * 0.11;
    oscillator.type = kind === "happy" ? "sine" : kind === "bite" ? "square" : "triangle";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(kind === "happy" ? 0.08 : kind === "bite" ? 0.025 : 0.045, start + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + (kind === "bite" ? 0.1 : 0.23));
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + (kind === "bite" ? 0.11 : 0.24));
  });
  window.setTimeout(() => context.close(), 700);
}

export default function Home() {
  const mouthRef = useRef<HTMLDivElement>(null);
  const flightTimerRef = useRef<number | null>(null);
  const reactionTimerRef = useRef<number | null>(null);
  const [pet, setPet] = useState<Pet>("cat");
  const [sleeping, setSleeping] = useState(false);
  const [flying, setFlying] = useState<FlyingTreat | null>(null);
  const [fed, setFed] = useState<Record<Pet, number>>({ cat: 0, horse: 0 });
  const [chewing, setChewing] = useState(false);
  const [lastTreat, setLastTreat] = useState("🐟");
  const [celebrating, setCelebrating] = useState(false);
  const [petting, setPetting] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const currentPet = pets[pet];

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const base = window.location.pathname.startsWith("/pokormi-kotika") ? "/pokormi-kotika/" : "/";
      navigator.serviceWorker.register(`${base}sw.js`, { scope: base, updateViaCache: "none" }).catch(() => undefined);
    }
    const preventMenu = (event: Event) => event.preventDefault();
    document.addEventListener("contextmenu", preventMenu);
    return () => {
      document.removeEventListener("contextmenu", preventMenu);
      if (flightTimerRef.current !== null) window.clearTimeout(flightTimerRef.current);
      if (reactionTimerRef.current !== null) window.clearTimeout(reactionTimerRef.current);
    };
  }, []);

  function choosePet(nextPet: Pet) {
    setHasInteracted(true);
    if (flightTimerRef.current !== null) window.clearTimeout(flightTimerRef.current);
    if (reactionTimerRef.current !== null) window.clearTimeout(reactionTimerRef.current);
    flightTimerRef.current = null;
    reactionTimerRef.current = null;
    setPet(nextPet);
    setSleeping(false);
    setChewing(false);
    setFlying(null);
  }

  function feed(emoji: string, button: HTMLButtonElement) {
    if (flying || chewing) return;
    const source = button.getBoundingClientRect();
    const mouth = mouthRef.current?.getBoundingClientRect();
    if (!mouth) return;

    setSleeping(false);
    setChewing(false);
    setHasInteracted(true);
    setLastTreat(emoji);
    setFlying({
      pet,
      emoji,
      fromX: source.left + source.width / 2,
      fromY: source.top + source.height / 2,
      toX: mouth.left + mouth.width / 2,
      toY: mouth.top + mouth.height / 2,
    });
    flightTimerRef.current = window.setTimeout(() => finishBite(pet), 760);
  }

  function finishBite(fedPet: Pet) {
    flightTimerRef.current = null;
    setFlying(null);
    setChewing(true);
    playSound("bite", soundEnabled);
    setFed((value) => {
      const next = value[fedPet] + 1;
      if (next >= 5) {
        setCelebrating(true);
        window.setTimeout(() => setCelebrating(false), 1600);
      }
      return { ...value, [fedPet]: next >= 5 ? 0 : next };
    });
    reactionTimerRef.current = window.setTimeout(() => {
      setChewing(false);
      reactionTimerRef.current = null;
    }, 1120);
  }

  function toggleSleep() {
    if (flying || chewing) return;
    setHasInteracted(true);
    const next = !sleeping;
    setSleeping(next);
    setChewing(false);
    if (next) playSound("sleep", soundEnabled);
  }

  function petAnimal() {
    if (flying || chewing) return;
    setHasInteracted(true);
    if (sleeping) {
      setSleeping(false);
      playSound("happy", soundEnabled);
      return;
    }
    if (petting) return;
    setPetting(true);
    playSound("happy", soundEnabled);
    window.setTimeout(() => setPetting(false), 800);
  }

  const message = sleeping
    ? `Тс-с-с… ${currentPet.name} спит`
    : celebrating
      ? `${currentPet.name} счастлив${pet === "horse" ? "а" : ""}!`
      : chewing
        ? "Хрум-хрум!"
        : `Угости ${pet === "cat" ? "Рыжика" : "Звёздочку"}`;

  return (
    <main className={`game ${sleeping ? "is-night" : "is-day"}`} aria-label="Игра Мои зверята">
      <div className="ambient-glow" aria-hidden="true" />
      <div className="stars" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
      <div className="sun-or-moon" aria-hidden="true" />
      <div className="cloud cloud-one" aria-hidden="true" />
      <div className="cloud cloud-two" aria-hidden="true" />
      <div className="hill hill-back" aria-hidden="true" />
      <div className="hill hill-front" aria-hidden="true" />

      <header className="topbar">
        <div className="brand"><span aria-hidden="true">♥</span><strong>Мои зверята</strong></div>
        <div className="top-actions">
          <button
            className="sound-toggle"
            onPointerDown={() => setSoundEnabled((value) => !value)}
            aria-label={soundEnabled ? "Выключить звук" : "Включить звук"}
            aria-pressed={soundEnabled}
          ><span aria-hidden="true">{soundEnabled ? "♫" : "×"}</span></button>
          <nav className="pet-picker" aria-label="Выбрать питомца">
            {(Object.keys(pets) as Pet[]).map((key) => (
              <button
                key={key}
                className={pet === key ? "is-selected" : ""}
                onPointerDown={() => choosePet(key)}
                aria-label={`Выбрать питомца ${pets[key].name}`}
                aria-pressed={pet === key}
              >
                <img src={pets[key].image} alt="" draggable={false} />
                <small>{pets[key].name}</small>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <section className="playground">
        <div className="message" aria-live="polite"><span aria-hidden="true">{sleeping ? "☾" : chewing ? "♥" : "✦"}</span>{message}</div>

        <div
          className={`pet-stage pet-${pet} ${flying ? "is-reaching" : ""} ${chewing ? "is-chewing" : ""} ${celebrating ? "is-celebrating" : ""} ${sleeping ? "is-sleeping" : ""} ${petting ? "is-petting" : ""}`}
          onPointerDown={petAnimal}
          onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") petAnimal(); }}
          role="button"
          tabIndex={0}
          aria-label={`Погладить питомца ${currentPet.name}`}
        >
          <div className="pet-art-frame">
            <img className="pet-art" src={currentPet.image} alt="" draggable={false} />
            <div className="night-wash" aria-hidden="true" />
          </div>
          <div ref={mouthRef} className="mouth-target" aria-hidden="true" />
          {chewing && (
            <div className="bite-effect" aria-hidden="true">
              <span className="bite-treat">{lastTreat}</span>
              <i /><i /><i /><i /><b>✦</b>
            </div>
          )}
          {sleeping && <div className="blanket" aria-hidden="true"><i /><i /><i /><span /></div>}
          {sleeping && <div className="sleep-bubbles" aria-hidden="true"><i>z</i><i>z</i><i>z</i></div>}
          {petting && <div className="petting-hearts" aria-hidden="true"><i>♥</i><i>♥</i><i>♥</i></div>}
        </div>

        <div className="hearts" aria-label={`${currentPet.name}: ${fed[pet]} из 5 сердечек`}>
          {[0, 1, 2, 3, 4].map((item) => <span key={item} className={item < fed[pet] ? "is-full" : ""}>♥</span>)}
        </div>
      </section>

      <section className="care-dock" aria-label="Уход за питомцем">
        <div className="dock-caption">Чем угостим?</div>
        <div className="food-group">
          {currentPet.treats.map((treat, index) => (
            <button
              key={treat.name}
              className="care-button food-button"
              style={{ "--button-color": treat.color } as React.CSSProperties}
              aria-label={`Дать ${pet === "cat" ? "Рыжику" : "Звёздочке"} ${treat.name}`}
              onPointerDown={(event) => feed(treat.emoji, event.currentTarget)}
            >
              <span aria-hidden="true">{treat.emoji}</span>
              {index === 0 && !hasInteracted && <i className="first-hint" aria-hidden="true">☝</i>}
            </button>
          ))}
        </div>
        <div className="dock-divider" />
        <button
          className={`care-button sleep-button ${sleeping ? "is-active" : ""}`}
          onPointerDown={toggleSleep}
          aria-label={sleeping ? "Разбудить питомца" : "Уложить питомца спать"}
        >
          <span className="sleep-glyph" aria-hidden="true">{sleeping ? "☀" : "☾"}</span>
          <small>{sleeping ? "Утро" : "Спать"}</small>
        </button>
      </section>

      {flying && (
        <div className="flying-treat" aria-hidden="true" style={{
          "--from-x": `${flying.fromX}px`, "--from-y": `${flying.fromY}px`,
          "--to-x": `${flying.toX}px`, "--to-y": `${flying.toY}px`,
        } as React.CSSProperties}>{flying.emoji}</div>
      )}

      {celebrating && <div className="celebration" aria-hidden="true">{["♥", "✦", "★", "●", "♥", "✦", "★", "●"].map((shape, index) => <span key={index}>{shape}</span>)}</div>}
    </main>
  );
}
