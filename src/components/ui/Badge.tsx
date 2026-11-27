import type { ReactNode } from "react";

type BadgeTone = "neutral" | "accent" | "sale" | "dark";

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-surface text-ink border border-border",
  accent: "bg-accent-soft text-accent border border-accent/20",
  sale: "bg-sale text-white border border-sale",
  dark: "bg-ink text-white border border-ink",
};

export function Badge({ tone = "neutral", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
