import { cn } from "@/lib/utils";

interface NexaLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  variant?: "default" | "mono";
}

export function NexaLogo({ className, size = 28, showText = true, variant = "default" }: NexaLogoProps) {
  const color = variant === "mono" ? "currentColor" : "hsl(var(--nexa-violet))";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Nexa symbol — a geometric nexus/asterisk shape */}
        <circle cx="16" cy="16" r="3" fill={color} />
        {/* Top ray */}
        <rect x="14.5" y="2" width="3" height="10" rx="1.5" fill={color} opacity="0.9" />
        {/* Bottom ray */}
        <rect x="14.5" y="20" width="3" height="10" rx="1.5" fill={color} opacity="0.9" />
        {/* Left ray */}
        <rect x="2" y="14.5" width="10" height="3" rx="1.5" fill={color} opacity="0.9" />
        {/* Right ray */}
        <rect x="20" y="14.5" width="10" height="3" rx="1.5" fill={color} opacity="0.9" />
        {/* Top-right diagonal */}
        <rect x="21.5" y="3.2" width="3" height="10" rx="1.5" transform="rotate(45 23 8.2)" fill={color} opacity="0.6" />
        {/* Bottom-left diagonal */}
        <rect x="5.2" y="19.5" width="3" height="10" rx="1.5" transform="rotate(45 6.7 24.5)" fill={color} opacity="0.6" />
        {/* Top-left diagonal */}
        <rect x="3.2" y="5.2" width="3" height="10" rx="1.5" transform="rotate(-45 4.7 10.2)" fill={color} opacity="0.6" />
        {/* Bottom-right diagonal */}
        <rect x="19.5" y="21.5" width="3" height="10" rx="1.5" transform="rotate(-45 21 26.5)" fill={color} opacity="0.6" />
      </svg>
      {showText && (
        <span className="text-lg font-semibold tracking-tight">
          Sad
        </span>
      )}
    </div>
  );
}

export function NexaIcon({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="16" cy="16" r="3" fill="currentColor" />
      <rect x="14.5" y="2" width="3" height="10" rx="1.5" fill="currentColor" opacity="0.9" />
      <rect x="14.5" y="20" width="3" height="10" rx="1.5" fill="currentColor" opacity="0.9" />
      <rect x="2" y="14.5" width="10" height="3" rx="1.5" fill="currentColor" opacity="0.9" />
      <rect x="20" y="14.5" width="10" height="3" rx="1.5" fill="currentColor" opacity="0.9" />
      <rect x="21.5" y="3.2" width="3" height="10" rx="1.5" transform="rotate(45 23 8.2)" fill="currentColor" opacity="0.6" />
      <rect x="5.2" y="19.5" width="3" height="10" rx="1.5" transform="rotate(45 6.7 24.5)" fill="currentColor" opacity="0.6" />
      <rect x="3.2" y="5.2" width="3" height="10" rx="1.5" transform="rotate(-45 4.7 10.2)" fill="currentColor" opacity="0.6" />
      <rect x="19.5" y="21.5" width="3" height="10" rx="1.5" transform="rotate(-45 21 26.5)" fill="currentColor" opacity="0.6" />
    </svg>
  );
}
