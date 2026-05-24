import type { SVGProps } from "react";

export function BotanicalSprig({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M5 20 Q 35 18, 60 20 T 115 20" />
      <path d="M20 20 Q 22 12, 30 10" />
      <path d="M30 20 Q 32 28, 40 30" />
      <path d="M45 20 Q 47 11, 56 9" />
      <path d="M58 20 Q 60 29, 68 31" />
      <path d="M72 20 Q 74 12, 82 10" />
      <path d="M85 20 Q 87 28, 95 30" />
      <ellipse cx="60" cy="20" rx="2" ry="1" fill="currentColor" opacity="0.5" />
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