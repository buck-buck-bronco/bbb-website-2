import assert from "node:assert/strict";
import { safeNextPath } from "../src/lib/safe-next-path.mjs";

assert.equal(safeNextPath("/"), "/");
assert.equal(safeNextPath("/bucked"), "/bucked");
assert.equal(safeNextPath("/bucked?x=1#cards"), "/bucked?x=1#cards");
assert.equal(safeNextPath("/play/../bucked"), "/bucked");
assert.equal(safeNextPath(""), "/");
assert.equal(safeNextPath("bucked"), "/");
assert.equal(safeNextPath("https://buckbuckbronco.com/bucked"), "/");
assert.equal(safeNextPath("//buckbuckbronco.com"), "/");
assert.equal(safeNextPath("/\\bucked"), "/");
assert.equal(safeNextPath("/bucked\nbad"), "/");
assert.equal(safeNextPath("/bucked\tbad"), "/");
assert.equal(safeNextPath("/bucked bad"), "/");
assert.equal(safeNextPath("/%09bucked"), "/");
assert.equal(safeNextPath("/%2f%2fbucked"), "/");
assert.equal(safeNextPath("/x/..//y"), "/");
assert.equal(safeNextPath("/.//bucked"), "/");
assert.equal(safeNextPath("/a/.//bucked"), "/");
assert.equal(safeNextPath("/a/..//"), "/");
assert.equal(safeNextPath("/%2e%2e//bucked"), "/");
assert.equal(safeNextPath("/bucked?q=%2541"), "/bucked?q=%2541");
assert.equal(safeNextPath("/play/../bucked?q=%2541"), "/bucked?q=%2541");
assert.equal(safeNextPath("/play/../%2fbucked"), "/");
assert.equal(safeNextPath("/play/../%2Fbucked"), "/");
assert.equal(safeNextPath("/play/../%5cbucked"), "/");
assert.equal(safeNextPath("/bucked?q=%2F"), "/bucked?q=%2F");
assert.equal(safeNextPath("/play%3Fpart=%252fbucked"), "/");
assert.equal(safeNextPath("/play%23part=%255cbucked"), "/");
assert.equal(safeNextPath("/bucked%252f"), "/");
assert.equal(safeNextPath("/bucked%255C"), "/");

const samples = [
  "/",
  "/bucked",
  "/bucked?x=1#cards",
  "/play/../bucked",
  "/x/..//y",
  "/.//bucked",
  "/a/.//bucked",
  "/bucked?q=%2541",
  "/play/../bucked?q=%2541",
  "/play/../%2fbucked",
  "/bucked?q=%2F",
  "/play%3Fpart=%252fbucked",
  "/play%23part=%255cbucked",
  "",
  "bucked",
  "//bucked",
  "/\\bucked",
];
for (const sample of samples) {
  const once = safeNextPath(sample);
  assert.equal(safeNextPath(once), once);
  assert.equal(once.startsWith("//"), false);
  assert.equal(once.startsWith("/\\"), false);
  assert.equal(once.includes("\\"), false);
  assert.equal(once.includes("//"), false);
}

console.log("safe-next-path checks ok");
