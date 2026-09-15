// components/consultation-modal.tsx
"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ConsultationModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
}

export function ConsultationModal({ open, onClose, title }: ConsultationModalProps) {
    const dialogRef = useRef<HTMLDivElement>(null);

    // Close on Escape, lock body scroll while open
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        // Move focus into the dialog for accessibility
        dialogRef.current?.focus();

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={onClose}
            aria-hidden="true"
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="consultation-modal-title"
                tabIndex={-1}
                className="w-full max-w-md rounded-2xl bg-[#F7F5F2] p-8 shadow-xl outline-none"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-6 flex items-start justify-between">
                    <h2 id="consultation-modal-title" className="font-serif text-2xl text-[#1A1A1A]">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="text-[#1A1A1A]/50 hover:text-[#1A1A1A]"
                    >
                        ✕
                    </button>
                </div>

                {/* Replace with your real form / API call */}
                <form
                    className="flex flex-col gap-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        // TODO: submit to your endpoint
                        onClose();
                    }}
                >
                    <input
                        type="text"
                        name="name"
                        placeholder="Ваше имя"
                        required
                        className="rounded-lg border border-[#1A1A1A]/15 bg-white px-4 py-3 text-sm"
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Телефон"
                        required
                        className="rounded-lg border border-[#1A1A1A]/15 bg-white px-4 py-3 text-sm"
                    />
                    <button
                        type="submit"
                        className="mt-2 rounded-lg bg-[#1F3A2E] px-4 py-3 text-sm font-medium text-white hover:bg-[#1F3A2E]/90"
                    >
                        Отправить
                    </button>
                </form>
            </div>
        </div>,
        document.body,
    );
}