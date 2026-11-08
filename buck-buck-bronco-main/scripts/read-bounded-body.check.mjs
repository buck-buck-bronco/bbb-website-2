import assert from "node:assert/strict";
import { readBoundedBody } from "../src/lib/read-bounded-body.mjs";

const small = new Request("http://127.0.0.1/api/staging-auth", {
  method: "POST",
  headers: { "content-length": "2" },
  body: "ok",
});
assert.deepEqual(await readBoundedBody(small, 4), { ok: true, text: "ok" });

const declared = new Request("http://127.0.0.1/api/staging-auth", {
  method: "POST",
  headers: { "content-length": "9" },
  body: "123456789",
});
assert.deepEqual(await readBoundedBody(declared, 4), { ok: false, reason: "length" });

const stream = new Request("http://127.0.0.1/api/staging-auth", {
  method: "POST",
  body: "123456789",
  duplex: "half",
});
assert.equal((await readBoundedBody(stream, 4)).ok, false);

console.log("read-bounded-body checks ok");
