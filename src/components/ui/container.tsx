// src/components/ui/container.tsx
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared horizontal layout for every section, header and footer.
 * Gutters: 24px on mobile, 64px from lg. Content width capped at 1152px
 * (80rem box minus 2 × 4rem padding), so every section starts on the same line.
 */
export function Container({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cn("mx-auto w-full max-w-[80rem] px-6 lg:px-16", className)}
            {...props}
        />
    );
}