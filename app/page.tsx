"use client";

import { useRef, useState } from "react";

type Pet = "cat" | "horse";

const pets = {
  cat: {
    name: "Рыжик",
    icon: "🐱",
    treats: [
      { emoji: "🐟", name: "рыбку", color: "#9fe2f2" },
      { emoji: "🍗", name: "курочку", color: "#ffd09a" },
      { emoji: "🧀", name: "сыр", color: "#ffe980" },
    ],
  },
  horse: {
    name: "Звёздочка",
    icon: "🐴",
    treats: [
      { emoji: "🥕", name: "морковку", color: "#ffd0a2" },
      { emoji: "🍎", name: "яблоко", color: "#ffc0b7" },
      { emoji: "🌾", name: "сено", color: "#f3df91" },
    ],
  },
} as const;

type FlyingTreat = {
  emoji: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
};

function playSound(kind: "happy" | "sleep") {
  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const notes = kind === "happy" ? [520, 660, 820] : [520, 440, 350];
  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = context.currentTime + index * 0.11;
    oscillator.type = kind === "happy" ? "sine" : "triangle";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(kind === "happy" ? 0.08 : 0.045, start + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.23);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.24);
  });
  window.setTimeout(() => context.close(), 700);
}

export default function Home() {
  const mouthRef = useRef<HTMLDivElement>(null);
  const [pet, setPet] = useState<Pet>("cat");
  const [sleeping, setSleeping] = useState(false);
  const [flying, setFlying] = useState<FlyingTreat | null>(null);
  const [fed, setFed] = useState<Record<Pet, number>>({ cat: 0, horse: 0 });
  const [chewing, setChewing] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  const currentPet = pets[pet];

  function choosePet(nextPet: Pet) {
    setPet(nextPet);
    setSleeping(false);
    setChewing(false);
    setFlying(null);
  }

  function feed(emoji: string, button: HTMLButtonElement) {
    if (flying) return;
    const source = button.getBoundingClientRect();
    const mouth = mouthRef.current?.getBoundingClientRect();
    if (!mouth) return;

    setSleeping(false);
    setChewing(false);
    playSound("happy");
    setFlying({
      emoji,
      fromX: source.left + source.width / 2,
      fromY: source.top + source.height / 2,
      toX: mouth.left + mouth.width / 2,
      toY: mouth.top + mouth.height / 2,
    });
  }

  function finishBite() {
    setFlying(null);
    setChewing(true);
    const next = fed[pet] + 1;
    setFed((value) => ({ ...value, [pet]: next >= 5 ? 0 : next }));

    if (next >= 5) {
      setCelebrating(true);
      window.setTimeout(() => setCelebrating(false), 1600);
    }
    window.setTimeout(() => setChewing(false), 620);
  }

  function toggleSleep() {
    const next = !sleeping;
    setSleeping(next);
    setChewing(false);
    if (next) playSound("sleep");
  }

  const message = sleeping
    ? `Тс-с-с… ${currentPet.name} спит`
    : celebrating
      ? `${currentPet.name} счастлив${pet === "horse" ? "а" : ""}!`
      : chewing
        ? "Ням-ням!"
        : `Угости ${currentPet.name === "Рыжик" ? "Рыжика" : "Звёздочку"}`;

  return (
    <main className={`game ${sleeping ? "is-night" : "is-day"}`} aria-label="Игра Мои зверята">
      <div className="sky-glow" />
      <div className="stars" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
      <div className="sun-or-moon" aria-hidden="true" />
      <div className="cloud cloud-one" /><div className="cloud cloud-two" />
      <div className="hill hill-back" /><div className="hill hill-front" />
      <div className="barn" aria-hidden="true">
        <div className="barn-roof" /><div className="barn-window" /><div className="barn-door"><i /></div>
      </div>
      <div className="fence" aria-hidden="true"><i /><i /><i /><i /><span /><span /></div>
      <div className="flowers" aria-hidden="true"><i>✿</i><i>✿</i><i>✿</i><i>✿</i></div>

      <header className="topbar">
        <div className="brand"><span>♡</span><strong>Мои зверята</strong></div>
        <nav className="pet-picker" aria-label="Выбрать питомца">
          {(Object.keys(pets) as Pet[]).map((key) => (
            <button
              key={key}
              className={pet === key ? "is-selected" : ""}
              onPointerDown={() => choosePet(key)}
              aria-label={`Выбрать питомца ${pets[key].name}`}
              aria-pressed={pet === key}
            >
              <span aria-hidden="true">{pets[key].icon}</span>
              <small>{pets[key].name}</small>
            </button>
          ))}
        </nav>
      </header>

      <section className="playground">
        <div className="message" aria-live="polite"><span>{sleeping ? "☾" : chewing ? "♥" : "✦"}</span>{message}</div>

        <div className={`pet-stage pet-${pet} ${chewing ? "is-chewing" : ""} ${celebrating ? "is-celebrating" : ""} ${sleeping ? "is-sleeping" : ""}`}>
          <div className="pet-shadow" />
          {pet === "cat" ? (
            <div className="cat-figure">
              <div className="cat-tail"><i /><i /></div>
              <div className="cat-body"><div className="cat-chest" /></div>
              <div className="cat-head">
                <div className="cat-ear cat-ear-left"><i /></div>
                <div className="cat-ear cat-ear-right"><i /></div>
                <div className="cat-stripes"><i /><i /><i /></div>
                <div className="pet-eye pet-eye-left"><i /></div>
                <div className="pet-eye pet-eye-right"><i /></div>
                <div className="cat-muzzle cat-muzzle-left" /><div className="cat-muzzle cat-muzzle-right" />
                <div className="cat-nose" />
                <div className="cat-whiskers cat-whiskers-left" /><div className="cat-whiskers cat-whiskers-right" />
                <div ref={mouthRef} className="pet-mouth cat-mouth"><i /></div>
              </div>
              <div className="cat-paw cat-paw-left" /><div className="cat-paw cat-paw-right" />
            </div>
          ) : (
            <div className="horse-figure">
              <div className="horse-tail" />
              <div className="horse-body"><div className="horse-spot" /></div>
              <div className="horse-leg horse-leg-one"><i /></div><div className="horse-leg horse-leg-two"><i /></div>
              <div className="horse-leg horse-leg-three"><i /></div><div className="horse-leg horse-leg-four"><i /></div>
              <div className="horse-neck" />
              <div className="horse-mane"><i /><i /><i /><i /></div>
              <div className="horse-head">
                <div className="horse-ear horse-ear-left"><i /></div><div className="horse-ear horse-ear-right"><i /></div>
                <div className="horse-blaze" />
                <div className="pet-eye pet-eye-left"><i /></div><div className="pet-eye pet-eye-right"><i /></div>
                <div className="horse-muzzle"><i /><i /></div>
                <div ref={mouthRef} className="pet-mouth horse-mouth"><i /></div>
              </div>
            </div>
          )}

          {sleeping && <div className="blanket"><i>★</i><i>★</i><span /></div>}
          {sleeping && <div className="sleep-bubbles" aria-hidden="true"><i>z</i><i>z</i><i>z</i></div>}
        </div>

        <div className="hearts" aria-label={`${currentPet.name}: ${fed[pet]} из 5 сердечек`}>
          {[0, 1, 2, 3, 4].map((item) => <span key={item} className={item < fed[pet] ? "is-full" : ""}>♥</span>)}
        </div>
      </section>

      <section className="care-dock" aria-label="Уход за питомцем">
        <div className="food-group">
          {currentPet.treats.map((treat) => (
            <button
              key={treat.name}
              className="care-button food-button"
              style={{ "--button-color": treat.color } as React.CSSProperties}
              aria-label={`Дать ${currentPet.name === "Рыжик" ? "Рыжику" : "Звёздочке"} ${treat.name}`}
              onPointerDown={(event) => feed(treat.emoji, event.currentTarget)}
            ><span aria-hidden="true">{treat.emoji}</span></button>
          ))}
        </div>
        <div className="dock-divider" />
        <button className={`care-button sleep-button ${sleeping ? "is-active" : ""}`} onPointerDown={toggleSleep} aria-label={sleeping ? "Разбудить питомца" : "Уложить питомца спать"}>
          <span aria-hidden="true">{sleeping ? "☀️" : "🌙"}</span><small>{sleeping ? "Доброе утро" : "Спать"}</small>
        </button>
      </section>

      {flying && (
        <div className="flying-treat" aria-hidden="true" onAnimationEnd={finishBite} style={{
          "--from-x": `${flying.fromX}px`, "--from-y": `${flying.fromY}px`,
          "--to-x": `${flying.toX}px`, "--to-y": `${flying.toY}px`,
        } as React.CSSProperties}>{flying.emoji}</div>
      )}

      {celebrating && <div className="celebration" aria-hidden="true">{["♥", "✦", "★", "●", "♥", "✦", "★", "●"].map((shape, index) => <span key={index} style={{ "--i": index } as React.CSSProperties}>{shape}</span>)}</div>}
    </main>
  );
}
