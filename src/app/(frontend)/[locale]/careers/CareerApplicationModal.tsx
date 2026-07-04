// src/app/(frontend)/[locale]/careers/CareerApplicationModal.tsx
"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Labels = {
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
  error: string;
  errorName: string;
  errorPhone: string;
  errorEmail: string;
  errorPosition: string;
  errorComment: string;
  errorResumeType: string;
  errorResumeSize: string;
};

const NAME_REGEX = /^[A-Za-zА-Яа-яЁё\s-]+$/;
const KZ_PHONE_REGEX = /^(\+7|8)7\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COMMENT_MAX_LENGTH = 320;
const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5MB

type FormState = {
  name: string;
  phone: string;
  email: string;
  city: string;
  position: string;
  comment: string;
};

type FieldErrors = Partial<Record<keyof FormState | "resume", string>>;

const emptyForm: FormState = {
  name: "",
  phone: "",
  email: "",
  city: "",
  position: "",
  comment: "",
};

interface CareerApplicationModalProps {
  open: boolean;
  onClose: () => void;
  labels: Labels;
}

export function CareerApplicationModal({
  open,
  onClose,
  labels,
}: CareerApplicationModalProps) {
  const [status, setStatus] = useState <"idle" | "submitting" | "success" | "error">("idle");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [resume, setResume] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  if (!open) return null;

  const handleChange =
    (field: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleResumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFieldErrors((prev) => ({ ...prev, resume: undefined }));

    if (!file) {
      setResume(null);
      return;
    }
    if (file.type !== "application/pdf") {
      setFieldErrors((prev) => ({ ...prev, resume: labels.errorResumeType }));
      e.target.value = "";
      return;
    }
    if (file.size > MAX_RESUME_BYTES) {
      setFieldErrors((prev) => ({ ...prev, resume: labels.errorResumeSize }));
      e.target.value = "";
      return;
    }
    setResume(file);
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

    if (!form.position) {
      errors.position = labels.errorPosition;
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
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("phone", form.phone);
      formData.append("email", form.email);
      formData.append("city", form.city);
      formData.append("position", form.position);
      formData.append("comment", form.comment);
      if (resume) formData.append("resume", resume);

      const res = await fetch("/api/careers-apply", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      setForm(emptyForm);
      setResume(null);
      setFieldErrors({});
    } catch {
      setStatus("error");
    }
  };

  const handleClose = () => {
    onClose();
    // Reset after the close animation would run, so a reopen starts fresh
    setStatus("idle");
    setForm(emptyForm);
    setResume(null);
    setFieldErrors({});
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-brand-milk p-6 shadow-xl md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-2xl text-brand-green">
            {labels.title}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Закрыть"
            className="rounded-full p-1 text-brand-black hover:bg-brand-black/5"
          >
            <X size={20} />
          </button>
        </div>

        {status === "success" ? (
          <div className="rounded-2xl border border-brand-green/20 bg-brand-green/5 p-8 text-center">
            <p className="font-body text-brand-green">{labels.success}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={form.city}
                onChange={handleChange("city")}
                placeholder={labels.city}
                className="w-full rounded-xl border border-brand-black/15 bg-transparent px-5 py-4 font-body text-brand-black placeholder:text-brand-black/40 focus:border-brand-green focus:outline-none"
              />
              <div>
                <input
                  required
                  value={form.position}
                  onChange={handleChange("position")}
                  placeholder={`${labels.position}*`}
                  className="w-full rounded-xl border border-brand-black/15 bg-transparent px-5 py-4 font-body text-brand-black placeholder:text-brand-black/40 focus:border-brand-green focus:outline-none"
                />
                {fieldErrors.position && (
                  <p className="mt-1 font-body text-sm text-red-600">
                    {fieldErrors.position}
                  </p>
                )}
              </div>
            </div>

            <div>
              <textarea
                value={form.comment}
                onChange={handleChange("comment")}
                placeholder={labels.comment}
                rows={4}
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

            <div>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-brand-green/40 px-5 py-4 font-body text-sm text-brand-green">
                <Paperclip size={16} />
                {resume?.name ?? labels.resume}
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleResumeChange}
                />
              </label>
              {fieldErrors.resume && (
                <p className="mt-1 font-body text-sm text-red-600">
                  {fieldErrors.resume}
                </p>
              )}
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
        )}
      </div>
    </div>
  );
}
