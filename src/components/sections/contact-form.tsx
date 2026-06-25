// src/components/sections/contact-form.tsx
"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

type Labels = {
  name: string;
  phone: string;
  company: string;
  comment: string;
  submit: string;
  success: string;
  error: string;
};

export function ContactForm({ labels }: { labels: Labels }) {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    company: "",
    comment: "",
  });

  const handleChange =
    (field: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setForm({ name: "", phone: "", company: "", comment: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-brand-green/20 bg-brand-green/5 p-8 text-center">
        <p className="font-body text-brand-green">{labels.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          required
          value={form.name}
          onChange={handleChange("name")}
          placeholder={`${labels.name}*`}
          className="rounded-xl border border-brand-black/15 bg-transparent px-5 py-4 font-body text-brand-black placeholder:text-brand-black/40 focus:border-brand-green focus:outline-none"
        />
        <input
          required
          type="tel"
          value={form.phone}
          onChange={handleChange("phone")}
          placeholder={`${labels.phone}*`}
          className="rounded-xl border border-brand-black/15 bg-transparent px-5 py-4 font-body text-brand-black placeholder:text-brand-black/40 focus:border-brand-green focus:outline-none"
        />
      </div>

      <input
        value={form.company}
        onChange={handleChange("company")}
        placeholder={labels.company}
        className="w-full rounded-xl border border-brand-black/15 bg-transparent px-5 py-4 font-body text-brand-black placeholder:text-brand-black/40 focus:border-brand-green focus:outline-none"
      />

      <textarea
        value={form.comment}
        onChange={handleChange("comment")}
        placeholder={labels.comment}
        rows={5}
        className="w-full resize-none rounded-xl border border-brand-black/15 bg-transparent px-5 py-4 font-body text-brand-black placeholder:text-brand-black/40 focus:border-brand-green focus:outline-none"
      />

      <Button
        type="submit"
        size="lg"
        disabled={status === "submitting"}
        className="w-full bg-brand-green text-brand-milk hover:bg-brand-green/90 disabled:opacity-60"
      >
        {status === "submitting" ? "…" : labels.submit}
      </Button>

      {status === "error" && (
        <p className="font-body text-sm text-red-600">{labels.error}</p>
      )}
    </form>
  );
}
