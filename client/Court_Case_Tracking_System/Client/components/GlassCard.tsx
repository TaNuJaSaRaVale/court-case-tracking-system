import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-white/60 backdrop-blur-xl",
        "border border-[var(--amber-light)]/60",
        "shadow-lg shadow-[var(--amber-primary)]/5",
        hover && "transition-all duration-300 hover:shadow-xl hover:shadow-[var(--amber-primary)]/10 hover:border-[var(--amber-primary)]/30 hover:-translate-y-1",
        className
      )}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
      <div className="relative">{children}</div>
    </div>
  );
}
