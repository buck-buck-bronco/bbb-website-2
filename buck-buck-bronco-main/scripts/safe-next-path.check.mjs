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

console.log("safe-next-path checks ok");
