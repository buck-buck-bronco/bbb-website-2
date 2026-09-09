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

/** Fast at first, then crawls into the last digits. */
function easeToFinish(t: number) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return 1 - Math.pow(1 - t, 4);
}

export function CommunityCounter({ value, suffix = "+", label, since }: Props) {
  const [animated, setAnimated] = useState(value);
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
      { threshold: 0.08, rootMargin: "0px 0px 18% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started || reduceMotion) return;

    const delay = 280;
    const duration = 2400;
    let frame = 0;
    const timer = window.setTimeout(() => {
      const start = performance.now() - 80;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        setAnimated(Math.max(1, Math.round(value * easeToFinish(t))));
        if (t < 1) {
          frame = requestAnimationFrame(tick);
        } else {
          setAnimated(value);
        }
      };
      frame = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [started, value, reduceMotion]);

  const display = reduceMotion ? value : animated;

  return (
    <div
      ref={ref}
      className="counter"
      data-review-id="community-counter"
      data-review-label="Community counter"
      aria-label={`${value.toLocaleString("en-US")}${suffix} ${label}`}
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
