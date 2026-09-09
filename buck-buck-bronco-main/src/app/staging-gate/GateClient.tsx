"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { siteConfig } from "@/lib/site";

export function GateClient() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await fetch("/api/staging-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, next }),
      });
      if (!res.ok) {
        setError("Incorrect password. Check STAGING.md.");
        return;
      }
      const data = (await res.json()) as { next?: string };
      router.replace(data.next || (next.startsWith("/") ? next : "/"));
      router.refresh();
    });
  }

  return (
    <div className="gate">
      <div className="gate__panel">
        <Image
          src={siteConfig.images.logo}
          alt={siteConfig.name}
          width={200}
          height={200}
          className="gate__logo"
          priority
        />
        <h1 className="gate__title">Staging preview</h1>
        <p className="gate__lede">
          Password-protected review build for {siteConfig.name}. Damien has the
          password in STAGING.md.
        </p>
        <form className="gate__form" onSubmit={onSubmit}>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error ? <p className="gate__error">{error}</p> : null}
          <button type="submit" className="btn-cta" disabled={pending}>
            {pending ? "Checking…" : "Enter staging"}
          </button>
        </form>
      </div>
    </div>
  );
}
