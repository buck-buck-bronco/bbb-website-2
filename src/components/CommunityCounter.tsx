"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Props = {
  value: number;
  suffix?: string;
  label: string;
  since?: string;
};

function subscribeMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

export function CommunityCounter({ value, suffix = "+", label, since }: Props) {
  const [animated, setAnimated] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

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
    if (!started || reduceMotion) return;
    const duration = 1600;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimated(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value, reduceMotion]);

  const display = reduceMotion ? value : animated;

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
