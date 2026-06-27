"use client";

import { useEffect, useRef, useState } from "react";

interface PdfPageCanvasProps {
  url: string;
  targetWidth: number;
  className?: string;
}

export function PdfPageCanvas({
  url,
  targetWidth,
  className,
}: PdfPageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

        const pdf = await pdfjsLib.getDocument({ url }).promise;
        if (cancelled) return;
        const page = await pdf.getPage(1);

        const baseViewport = page.getViewport({ scale: 1 });
        const scale = targetWidth / baseViewport.width;
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!canvas || !context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvas, canvasContext: context, viewport }).promise;
        if (!cancelled) setStatus("ready");
      } catch (err) {
        console.error("Failed to render PDF page:", err);
        if (!cancelled) setStatus("error");
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [url, targetWidth]);

  return (
    <div
      className={`relative flex items-center justify-center ${className ?? ""}`}
    >
      {status === "loading" && (
        <span className="font-body text-xs text-brand-black/40">
          Загрузка...
        </span>
      )}
      {status === "error" && (
        <span className="font-body text-xs text-red-500">
          Не удалось загрузить PDF
        </span>
      )}
      <canvas
        ref={canvasRef}
        className={
          status === "ready" ? "h-full w-full object-contain" : "hidden"
        }
      />
    </div>
  );
}
