import assert from "node:assert/strict";
import { isStagingGateExempt } from "../src/lib/staging-gate-exempt.mjs";

for (const path of [
  "/staging-gate",
  "/api/staging-auth",
  "/_next/static",
  "/_next/static/chunks/app.js",
  "/favicon.ico",
  "/robots.txt",
  "/brand/buck-buck-bronco-mark.webp",
]) {
  assert.equal(isStagingGateExempt(path), true, path);
}

for (const path of [
  "/bucked",
  "/play",
  "/join",
  "/review",
  "/api/review",
  "/sitemap.xml",
  "/llms.txt",
  "/staging-gate/",
  "/staging-gate/extra",
  "/staging-gate-extra",
  "/api/staging-auth/extra",
  "/api/staging-auth-extra",
  "/_next",
  "/_next/data",
  "/_next/image",
  "/_next/static-extra",
  "/_next/image/extra",
  "/_next/image-extra",
  "/favicon",
  "/favicon.ico/extra",
  "/robots.txt/extra",
  "/brand/facebook-group-qr.svg",
  "/images/og.jpg",
]) {
  assert.equal(isStagingGateExempt(path), false, path);
}

console.log("staging-gate-exempt checks ok");
