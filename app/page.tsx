"use client";

import { useRef, useState } from "react";

const treats = [
  { emoji: "🐟", name: "рыбку", color: "#8edcf3" },
  { emoji: "🍗", name: "курочку", color: "#ffc276" },
  { emoji: "🧀", name: "сыр", color: "#ffe46b" },
];

type FlyingTreat = {
  emoji: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
};

function playHappySound() {
  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(520, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(760, context.currentTime + 0.16);
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.24);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.25);
  oscillator.addEventListener("ended", () => context.close());
}

export default function Home() {
  const mouthRef = useRef<HTMLDivElement>(null);
  const [flying, setFlying] = useState<FlyingTreat | null>(null);
  const [fed, setFed] = useState(0);
  const [chewing, setChewing] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  function feed(emoji: string, button: HTMLButtonElement) {
    if (flying) return;

    const source = button.getBoundingClientRect();
    const mouth = mouthRef.current?.getBoundingClientRect();
    if (!mouth) return;

    playHappySound();
    setChewing(false);
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
    const nextFed = fed + 1;
    setFed(nextFed % 5);

    if (nextFed >= 5) {
      setCelebrating(true);
      window.setTimeout(() => setCelebrating(false), 1500);
    }

    window.setTimeout(() => setChewing(false), 620);
  }

  return (
    <main className="game" aria-label="Игра Покорми котика">
      <div className="cloud cloud-one" />
      <div className="cloud cloud-two" />
      <div className="sun" aria-hidden="true" />

      <section className="playground">
        <div className="prompt" aria-live="polite">
          {chewing ? "Ням-ням!" : celebrating ? "Котик рад!" : "Покорми котика"}
        </div>

        <div className={`cat ${chewing ? "cat-chewing" : ""} ${celebrating ? "cat-happy" : ""}`}>
          <div className="tail" />
          <div className="body" />
          <div className="head">
            <div className="ear ear-left"><span /></div>
            <div className="ear ear-right"><span /></div>
            <div className="face-patch" />
            <div className="eye eye-left" />
            <div className="eye eye-right" />
            <div className="nose" />
            <div className="whiskers whiskers-left" />
            <div className="whiskers whiskers-right" />
            <div ref={mouthRef} className="mouth"><span /></div>
          </div>
          <div className="paw paw-left" />
          <div className="paw paw-right" />
        </div>

        <div className="progress" aria-label={`Котик съел ${fed} из 5 угощений`}>
          {[0, 1, 2, 3, 4].map((item) => (
            <span key={item} className={item < fed ? "filled" : ""} />
          ))}
        </div>
      </section>

      <section className="treat-tray" aria-label="Угощения">
        {treats.map((treat) => (
          <button
            key={treat.name}
            className="treat"
            style={{ "--treat-color": treat.color } as React.CSSProperties}
            aria-label={`Дать котику ${treat.name}`}
            onPointerDown={(event) => feed(treat.emoji, event.currentTarget)}
          >
            <span aria-hidden="true">{treat.emoji}</span>
          </button>
        ))}
      </section>

      {flying && (
        <div
          className="flying-treat"
          aria-hidden="true"
          onAnimationEnd={finishBite}
          style={{
            "--from-x": `${flying.fromX}px`,
            "--from-y": `${flying.fromY}px`,
            "--to-x": `${flying.toX}px`,
            "--to-y": `${flying.toY}px`,
          } as React.CSSProperties}
        >
          {flying.emoji}
        </div>
      )}

      {celebrating && (
        <div className="celebration" aria-hidden="true">
          {["★", "●", "★", "●", "★", "●", "★", "●"].map((shape, index) => (
            <span key={index} style={{ "--i": index } as React.CSSProperties}>{shape}</span>
          ))}
        </div>
      )}
    </main>
  );
}
