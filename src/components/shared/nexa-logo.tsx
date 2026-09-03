import { cn } from "@/lib/utils";
import Image from "next/image";

interface NexaLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  variant?: "default" | "mono";
}

export function NexaLogo({ className, size = 28, showText = true, variant = "default" }: NexaLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "relative shrink-0 overflow-hidden rounded-md bg-zinc-900",
          variant === "mono" && "bg-transparent",
        )}
        style={{ width: size, height: size }}
      >
        <Image
          src="/sandlip_logo_-_white.png"
          alt="Sad logo"
          fill
          sizes={`${size}px`}
          className="object-contain"
          priority
        />
      </span>
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
    <span className={cn("relative inline-block shrink-0 overflow-hidden rounded-md bg-zinc-900", className)} style={{ width: size, height: size }}>
      <Image src="/sandlip_logo_-_white.png" alt="Sad logo" fill sizes={`${size}px`} className="object-contain" />
    </span>
  );
}
