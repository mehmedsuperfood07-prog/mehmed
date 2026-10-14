"use client";

import { useEffect, useRef, useState } from "react";

type Connection = { saveData?: boolean; effectiveType?: string };

// Decorative background video layered over the hero photo. The photo
// (rendered server-side with priority) stays the LCP element; this mounts
// the <video> only after the page has fully loaded and the browser is idle,
// and skips it entirely for reduced-motion, Data Saver and slow
// connections. Phones only get a video if a mobile file was provided.
export function HeroVideo({ desktopSrc, mobileSrc }: { desktopSrc?: string; mobileSrc?: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    const blocked =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      connection?.saveData === true ||
      ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "");
    if (blocked) return;

    const isPhone = window.matchMedia("(max-width: 639px)").matches;
    const chosen = isPhone ? mobileSrc : desktopSrc;
    if (!chosen) return;

    let cancelled = false;
    const start = () => {
      const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
      idle(() => {
        if (!cancelled) setSrc(chosen);
      });
    };

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", start);
    };
  }, [desktopSrc, mobileSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  if (!src) return null;

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      autoPlay
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      onCanPlay={() => setReady(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
