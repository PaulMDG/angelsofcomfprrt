import type { SVGProps } from "react";

export function BotanicalSprig({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Central stem, gently arching like a real twig */}
      <path d="M8 22 Q 60 16, 112 22" />
      {/* Upper leaves — paired ovals along the stem */}
      <path d="M34 19 Q 30 12, 36 8 Q 42 11, 40 18 Z" fill="currentColor" opacity="0.85" />
      <path d="M58 17 Q 54 10, 60 6 Q 66 9, 64 16 Z" fill="currentColor" opacity="0.85" />
      <path d="M82 18 Q 78 11, 84 7 Q 90 10, 88 17 Z" fill="currentColor" opacity="0.85" />
      {/* Lower leaves — mirrored beneath the stem */}
      <path d="M46 23 Q 50 30, 44 34 Q 38 31, 40 24 Z" fill="currentColor" opacity="0.85" />
      <path d="M70 23 Q 74 30, 68 34 Q 62 31, 64 24 Z" fill="currentColor" opacity="0.85" />
      {/* Tip leaf */}
      <path d="M104 21 Q 110 16, 116 18 Q 114 24, 106 24 Z" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

export function MonogramAC({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden="true">
      <circle cx="30" cy="30" r="28" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <path
        d="M20 42 L28 18 L32 18 L40 42 M23 34 L37 34"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M30 8 L30 14 M30 46 L30 52" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

export function HeartOutline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className={className} aria-hidden="true">
      <path d="M12 20.5 C 7 16, 3 13, 3 8.5 A 4.5 4.5 0 0 1 12 7 A 4.5 4.5 0 0 1 21 8.5 C 21 13, 17 16, 12 20.5 Z" />
    </svg>
  );
}