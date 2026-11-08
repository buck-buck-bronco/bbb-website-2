import assert from "node:assert/strict";
import { bodyRejectionStatus, readBoundedBody } from "../src/lib/read-bounded-body.mjs";

const small = new Request("http://127.0.0.1/api/staging-auth", {
  method: "POST",
  headers: { "content-length": "2" },
  body: "ok",
});
assert.deepEqual(await readBoundedBody(small, 4), { ok: true, text: "ok" });

let declaredCancelled = false;
const declaredStream = new ReadableStream({
  start(controller) {
    controller.enqueue(new TextEncoder().encode("123456789"));
  },
  cancel() {
    declaredCancelled = true;
  },
});
const declared = new Request("http://127.0.0.1/api/staging-auth", {
  method: "POST",
  headers: { "content-length": "9" },
  body: declaredStream,
  duplex: "half",
});
const declaredResult = await readBoundedBody(declared, 4);
assert.equal(declaredResult.ok, false);
assert.equal(declaredResult.reason, "length");
assert.equal(declaredCancelled, true);
assert.equal(bodyRejectionStatus(declaredResult.reason), 413);

let streamedCancelled = false;
const overflow = new ReadableStream({
  pull(controller) {
    controller.enqueue(new TextEncoder().encode("123456789"));
  },
  cancel() {
    streamedCancelled = true;
  },
});
const stream = new Request("http://127.0.0.1/api/staging-auth", {
  method: "POST",
  body: overflow,
  duplex: "half",
});
const streamed = await readBoundedBody(stream, 4);
assert.equal(streamed.reason, "length");
assert.equal(streamedCancelled, true);
assert.equal(bodyRejectionStatus("length"), 413);

const malformed = new Request("http://127.0.0.1/api/staging-auth", {
  method: "POST",
  headers: { "content-length": "nope" },
  body: "short",
});
const malformedResult = await readBoundedBody(malformed, 4);
assert.equal(malformedResult.reason, "malformed");
assert.equal(bodyRejectionStatus(malformedResult.reason), 400);
assert.equal(bodyRejectionStatus("read"), 400);

console.log("read-bounded-body checks ok");
