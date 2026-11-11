"use client";
import { useEffect, useRef, useState } from "react";

interface PdfPageCanvasProps {
  url: string;
  targetWidth: number;
  className?: string;
  loadingLabel?: string;
  errorLabel?: string;
}

export function PdfPageCanvas({
                                url,
                                targetWidth,
                                className,
                                loadingLabel = "Загрузка...",
                                errorLabel = "Не удалось загрузить PDF",
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
    // Typed loosely so pdfjs types don't have to be imported eagerly
    let loadingTask: { destroy: () => Promise<void> } | null = null;
    let renderTask: { cancel: () => void } | null = null;

    setStatus("loading");

    async function render() {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
            "pdfjs-dist/build/pdf.worker.min.mjs",
            import.meta.url,
        ).toString();

        const task = pdfjsLib.getDocument({ url });
        loadingTask = task;
        const pdf = await task.promise;
        if (cancelled) return;

        const page = await pdf.getPage(1);
        if (cancelled) return;

        // Render at device pixel ratio (capped) so it stays sharp on retina
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const baseViewport = page.getViewport({ scale: 1 });
        const scale = (targetWidth * dpr) / baseViewport.width;
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!canvas || !context) return;
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        const rt = page.render({ canvasContext: context, viewport });
        renderTask = rt;
        await rt.promise;
        if (!cancelled) setStatus("ready");
      } catch (err) {
        // A cancelled render throws RenderingCancelledException; ignore it
        if (cancelled) return;
        console.error("Failed to render PDF page:", err);
        setStatus("error");
      }
    }

    render();

    return () => {
      cancelled = true;
      renderTask?.cancel();
      // Frees the document and its worker-side memory
      void loadingTask?.destroy();
    };
  }, [inView, url, targetWidth]);

  return (
      <div
          ref={containerRef}
          className={`relative flex items-center justify-center ${className ?? ""}`}
      >
        {(status === "idle" || status === "loading") && (
            <span className="font-body text-xs text-brand-black/70" role="status">
          {loadingLabel}
        </span>
        )}
        {status === "error" && (
            <span className="font-body text-xs text-red-700" role="alert">
          {errorLabel}
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