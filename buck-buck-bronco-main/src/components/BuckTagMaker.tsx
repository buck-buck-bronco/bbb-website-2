"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { siteConfig } from "@/lib/site";

type TagFields = {
  from: string;
  note: string;
};

const DEFAULT: TagFields = {
  from: "",
  note: "Sweet ride. Hope this made your day. Keep it going!",
};

export function BuckTagMaker() {
  const [fields, setFields] = useState<TagFields>(DEFAULT);
  const [pending, startTransition] = useTransition();
  const [logo, setLogo] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setLogo(img);
    img.src = siteConfig.images.logo;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = "#050505";
    roundRect(ctx, 24, 24, w - 48, h - 48, 12);
    ctx.fill();

    ctx.fillStyle = "#f5c518";
    ctx.fillRect(24, 24, w - 48, 14);

    if (logo) {
      const size = 88;
      const x = 56;
      const y = 88;
      ctx.drawImage(logo, x, y, size, size);
    }

    const textX = logo ? 160 : 56;

    ctx.fillStyle = "#ffffff";
    ctx.font = "400 40px 'Bebas Neue', Impact, sans-serif";
    ctx.fillText("YOU'VE BEEN BUCKED", textX, 118);

    ctx.fillStyle = "#f5c518";
    ctx.font = "400 26px 'Bebas Neue', Impact, sans-serif";
    ctx.fillText("BUCK BUCK BRONCO", textX, 156);

    ctx.fillStyle = "#d7dde3";
    ctx.font = "400 22px 'Source Sans 3', system-ui, sans-serif";
    wrapText(ctx, fields.note || DEFAULT.note, 56, 230, w - 112, 32);

    ctx.fillStyle = "#ffffff";
    ctx.font = "600 20px 'Source Sans 3', system-ui, sans-serif";
    ctx.fillText(
      fields.from ? `From ${fields.from}` : "From a fellow Bronco driver",
      56,
      h - 90,
    );

    ctx.fillStyle = "#8b96a1";
    ctx.font = "500 16px 'Source Sans 3', system-ui, sans-serif";
    ctx.fillText("Share a Smile · buckbuckbronco.com", 56, h - 56);
  }, [fields, logo]);

  function download() {
    startTransition(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "youve-been-bucked.png";
      a.click();
    });
  }

  function printTag() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const win = window.open("");
    if (!win) return;
    win.document.write(
      `<img src="${url}" style="width:100%;max-width:600px;margin:2rem auto;display:block" />`,
    );
    win.document.close();
    win.focus();
    win.print();
  }

  return (
    <div className="tag-maker">
      <form
        className="tag-maker__form"
        onSubmit={(e) => {
          e.preventDefault();
          download();
        }}
      >
        <label className="field">
          <span>Your name (optional)</span>
          <input
            value={fields.from}
            onChange={(e) => setFields((f) => ({ ...f, from: e.target.value }))}
            placeholder="Trail name or initials"
            maxLength={40}
          />
        </label>
        <label className="field">
          <span>Note on the tag</span>
          <textarea
            value={fields.note}
            onChange={(e) => setFields((f) => ({ ...f, note: e.target.value }))}
            rows={3}
            maxLength={160}
          />
        </label>
        <div className="tag-maker__actions">
          <button type="submit" className="btn-cta" disabled={pending}>
            Download PNG
          </button>
          <button type="button" className="btn-ghost" onClick={printTag}>
            Print
          </button>
        </div>
      </form>
      <div className="tag-maker__preview">
        <canvas
          ref={canvasRef}
          width={900}
          height={520}
          aria-label="Preview of your You've Been Bucked tag"
        />
      </div>
    </div>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let yy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy);
      line = word;
      yy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, yy);
}
