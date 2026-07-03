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
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [inView, setInView] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );

  // Only start loading once the card is near the viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    setStatus("loading");

    async function render() {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        // Self-hosted worker: bundled by Next from node_modules, no
        // dependency on cdnjs having mirrored the exact installed version.
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();
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
  }, [inView, url, targetWidth]);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center ${className ?? ""}`}
    >
      {(status === "idle" || status === "loading") && (
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
