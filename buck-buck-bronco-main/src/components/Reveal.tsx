"use client";

import {
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3 | 4;
  as?: ElementType;
  id?: string;
  once?: boolean;
} & Omit<HTMLAttributes<HTMLElement>, "children" | "className" | "id">;

export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  id,
  once = true,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const alreadyVisible =
      rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
    if (alreadyVisible) {
      setInView(true);
      if (once) return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold: 0.02, rootMargin: "0px 0px 12% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  const delayClass = delay > 0 ? `reveal-delay-${delay}` : "";

  return (
    <Tag
      ref={ref}
      id={id}
      className={`reveal-scroll ${delayClass} ${inView ? "is-inview" : ""} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  );
}
