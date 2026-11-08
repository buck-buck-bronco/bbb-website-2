/**
 * Read a request body up to maxBytes.
 * Over-cap declared length and over-cap streamed bytes are "length" (HTTP 413).
 * A non-numeric Content-Length or a failed read is malformed (HTTP 400).
 * This is a per-request limit, not a platform throttle or a slow-client timeout.
 */
export function bodyRejectionStatus(reason) {
  return reason === "length" ? 413 : 400;
}

async function cancelStream(stream) {
  if (!stream || typeof stream.cancel !== "function") return;
  try {
    await stream.cancel();
  } catch {
    /* already closed or not cancellable */
  }
}

export async function readBoundedBody(request, maxBytes) {
  const declared = request.headers.get("content-length");
  if (declared !== null) {
    if (!/^\d+$/.test(declared)) {
      await cancelStream(request.body);
      return { ok: false, reason: "malformed" };
    }
    if (Number(declared) > maxBytes) {
      await cancelStream(request.body);
      return { ok: false, reason: "length" };
    }
  }
  if (!request.body) return { ok: true, text: "" };

  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        try {
          await reader.cancel();
        } catch {
          /* already closed */
        }
        return { ok: false, reason: "length" };
      }
      chunks.push(value);
    }
  } catch {
    try {
      await reader.cancel();
    } catch {
      /* already closed */
    }
    return { ok: false, reason: "read" };
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { ok: true, text: new TextDecoder().decode(bytes) };
}
