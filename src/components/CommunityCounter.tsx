"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  suffix?: string;
  label: string;
  since?: string;
};

export function CommunityCounter({ value, suffix = "+", label, since }: Props) {
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1600;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value]);

  return (
    <div
      ref={ref}
      className="counter"
      data-review-id="community-counter"
      data-review-label="Community counter"
      aria-label={label}
      role="group"
    >
      <p className="counter__kicker">{since}</p>
      <p className="counter__value">
        <span className="counter__num">{display.toLocaleString("en-US")}</span>
        <span className="counter__suffix">{suffix}</span>
      </p>
      <p className="counter__label">{label}</p>
    </div>
  );
}
