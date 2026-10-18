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
    roundRect(ctx, 24, 24, w - 48, h - 48, 16);
    ctx.fill();

    ctx.fillStyle = "#f5c518";
    ctx.fillRect(24, 24, w - 48, 16);

    if (logo) {
      const size = 128;
      ctx.drawImage(logo, 56, 72, size, size);
    }

    const textX = logo ? 208 : 56;

    ctx.fillStyle = "#ffffff";
    ctx.font = "400 78px 'Bebas Neue', Impact, sans-serif";
    ctx.fillText("YOU'VE BEEN BUCKED", textX, 140);

    ctx.fillStyle = "#f5c518";
    ctx.font = "400 46px 'Bebas Neue', Impact, sans-serif";
    ctx.fillText("BUCK BUCK BRONCO", textX, 196);

    ctx.fillStyle = "#d7dde3";
    ctx.font = "400 42px 'Source Sans 3', system-ui, sans-serif";
    wrapText(ctx, fields.note || DEFAULT.note, 56, 280, w - 112, 54, h - 180);

    ctx.fillStyle = "#ffffff";
    ctx.font = "600 38px 'Source Sans 3', system-ui, sans-serif";
    ctx.fillText(
      fields.from ? `From ${fields.from}` : "From a fellow Bronco driver",
      56,
      h - 118,
    );

    ctx.fillStyle = "#8b96a1";
    ctx.font = "500 36px 'Source Sans 3', system-ui, sans-serif";
    ctx.fillText("Share a Smile · buckbuckbronco.com", 56, h - 68);
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
          height={720}
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
  maxY: number,
) {
  const words = text.split(" ");
  let line = "";
  let yy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      if (yy > maxY) return;
      ctx.fillText(line, x, yy);
      line = word;
      yy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line && yy <= maxY) ctx.fillText(line, x, yy);
}
