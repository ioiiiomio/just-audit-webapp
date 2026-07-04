"use client";

import { useState } from "react";
import { X, Paperclip, Loader2, CheckCircle2 } from "lucide-react";

interface CareerApplicationModalProps {
  open: boolean;
  onClose: () => void;
  labels: {
    title: string;
    name: string;
    phone: string;
    email: string;
    city: string;
    position: string;
    comment: string;
    resume: string;
    submit: string;
    success: string;
  };
}

export function CareerApplicationModal({
  open,
  onClose,
  labels,
}: CareerApplicationModalProps) {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/careers-apply", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Ошибка отправки");
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
      setFileName(null);
    } catch {
      setErrorMsg("Не удалось отправить заявку. Попробуйте снова.");
      setStatus("error");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-[#F7F5F2] p-6 shadow-xl md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-2xl text-brand-green">
            {labels.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="rounded-full p-1 text-brand-black hover:bg-[#EDE9E3]"
          >
            <X size={20} />
          </button>
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 className="text-brand-green" size={40} />
            <p className="text-brand-black">{labels.success}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              name="name"
              required
              placeholder={labels.name}
              className="rounded-lg border border-[#EDE9E3] bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-green"
            />
            <input
              name="phone"
              required
              placeholder={labels.phone}
              className="rounded-lg border border-[#EDE9E3] bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-green"
            />
            <input
              name="email"
              type="email"
              required
              placeholder={labels.email}
              className="rounded-lg border border-[#EDE9E3] bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-green"
            />
            <input
              name="city"
              placeholder={labels.city}
              className="rounded-lg border border-[#EDE9E3] bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-green"
            />
            <input
              name="position"
              required
              placeholder={labels.position}
              className="rounded-lg border border-[#EDE9E3] bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-green"
            />
            <textarea
              name="comment"
              rows={3}
              placeholder={labels.comment}
              className="resize-none rounded-lg border border-[#EDE9E3] bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-green"
            />

            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-brand-green/40 px-4 py-3 text-sm text-brand-green">
              <Paperclip size={16} />
              {fileName ?? labels.resume}
              <input
                type="file"
                name="resume"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
              />
            </label>

            {status === "error" && errorMsg && (
              <p className="text-sm text-red-600">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-brand-green px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-green/90 disabled:opacity-60"
            >
              {status === "submitting" && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {labels.submit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
