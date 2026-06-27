// src/components/sections/contact-form.tsx
"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

type Labels = {
  name: string;
  phone: string;
  email: string;
  company: string;
  comment: string;
  submit: string;
  success: string;
  error: string;
  errorName: string;
  errorPhone: string;
  errorEmail: string;
  errorComment: string;
};

const NAME_REGEX = /^[A-Za-zА-Яа-яЁё\s-]+$/;
const KZ_PHONE_REGEX = /^(\+7|8)7\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COMMENT_MAX_LENGTH = 320;

type FormState = {
  name: string;
  phone: string;
  email: string;
  company: string;
  comment: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;
export function ContactForm({ labels }: { labels: Labels }) {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    company: "",
    comment: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleChange =
    (field: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear that field's error as soon as they start fixing it
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};

    if (!form.name || !NAME_REGEX.test(form.name)) {
      errors.name = labels.errorName;
    }

    const normalizedPhone = form.phone.replace(/[\s()-]/g, "");
    if (!form.phone || !KZ_PHONE_REGEX.test(normalizedPhone)) {
      errors.phone = labels.errorPhone;
    }

    if (!form.email || !EMAIL_REGEX.test(form.email)) {
      errors.email = labels.errorEmail;
    }

    if (form.comment.length > COMMENT_MAX_LENGTH) {
      errors.comment = labels.errorComment;
    }

    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      setForm({ name: "", phone: "", email: "", company: "", comment: "" });
      setFieldErrors({});
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
        <div>
          <input
            required
            value={form.name}
            onChange={handleChange("name")}
            placeholder={`${labels.name}*`}
            className="w-full rounded-xl border border-brand-black/15 bg-transparent px-5 py-4 font-body text-brand-black placeholder:text-brand-black/40 focus:border-brand-green focus:outline-none"
          />
          {fieldErrors.name && (
            <p className="mt-1 font-body text-sm text-red-600">
              {fieldErrors.name}
            </p>
          )}
        </div>
        <div>
          <input
            required
            type="tel"
            value={form.phone}
            onChange={handleChange("phone")}
            placeholder={`${labels.phone}*`}
            className="w-full rounded-xl border border-brand-black/15 bg-transparent px-5 py-4 font-body text-brand-black placeholder:text-brand-black/40 focus:border-brand-green focus:outline-none"
          />
          {fieldErrors.phone && (
            <p className="mt-1 font-body text-sm text-red-600">
              {fieldErrors.phone}
            </p>
          )}
        </div>
      </div>

      <div>
        <input
          required
          type="email"
          value={form.email}
          onChange={handleChange("email")}
          placeholder={`${labels.email}*`}
          className="w-full rounded-xl border border-brand-black/15 bg-transparent px-5 py-4 font-body text-brand-black placeholder:text-brand-black/40 focus:border-brand-green focus:outline-none"
        />
        {fieldErrors.email && (
          <p className="mt-1 font-body text-sm text-red-600">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <input
        value={form.company}
        onChange={handleChange("company")}
        placeholder={labels.company}
        className="w-full rounded-xl border border-brand-black/15 bg-transparent px-5 py-4 font-body text-brand-black placeholder:text-brand-black/40 focus:border-brand-green focus:outline-none"
      />

      <div>
        <textarea
          value={form.comment}
          onChange={handleChange("comment")}
          placeholder={labels.comment}
          rows={5}
          maxLength={COMMENT_MAX_LENGTH}
          className="w-full resize-none rounded-xl border border-brand-black/15 bg-transparent px-5 py-4 font-body text-brand-black placeholder:text-brand-black/40 focus:border-brand-green focus:outline-none"
        />
        <div className="mt-1 flex items-center justify-between">
          {fieldErrors.comment ? (
            <p className="font-body text-sm text-red-600">
              {fieldErrors.comment}
            </p>
          ) : (
            <span />
          )}
          <span className="font-body text-xs text-brand-black/40">
            {form.comment.length}/{COMMENT_MAX_LENGTH}
          </span>
        </div>
      </div>

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
