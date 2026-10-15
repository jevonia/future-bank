"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ArchivePhoto } from "./archive-photos";

const ADVANCE_MS = 6000;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeToMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * One photo at a time. Swipe or use the buttons; it also advances on its own
 * unless the viewer prefers reduced motion, pauses it, or is hovering over or
 * focused inside it.
 */
export function PhotoSlideshow({ photos }: { photos: ArchivePhoto[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  // null until the viewer presses Play or Pause; then their choice wins.
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [held, setHeld] = useState(false);
  const reduceMotion = useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
  const playing = userPaused === null ? !reduceMotion : !userPaused;

  function goTo(index: number) {
    const el = track.current;
    if (!el) return;
    const next = (index + photos.length) % photos.length;
    el.scrollTo({
      left: next * el.clientWidth,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  useEffect(() => {
    if (!playing || held) return;
    const timer = window.setTimeout(() => {
      const el = track.current;
      if (!el) return;
      const next = (current + 1) % photos.length;
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    }, ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [playing, held, current, photos.length]);

  return (
    <div
      role="region"
      aria-roledescription="slideshow"
      aria-label="More historical photos"
      className="min-w-0"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <div
        ref={track}
        onScroll={(event) => {
          const el = event.currentTarget;
          setCurrent(Math.round(el.scrollLeft / el.clientWidth));
        }}
        aria-live={playing ? "off" : "polite"}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo, index) => (
          <figure
            key={photo.href}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${photos.length}`}
            aria-hidden={index !== current}
            className="w-full shrink-0 snap-start"
          >
            <a
              href={photo.href}
              target="_blank"
              rel="noreferrer"
              tabIndex={index === current ? 0 : -1}
              className="group block"
            >
              <Image
                src={photo.src}
                alt=""
                placeholder="blur"
                sizes="(min-width: 1024px) 50vw, 100vw"
                style={
                  photo.focus ? { objectPosition: photo.focus } : undefined
                }
                className="aspect-[4/3] w-full rounded-2xl object-cover"
              />
              <figcaption className="mt-3">
                <span className="block leading-7 text-slate-700 group-hover:text-cobalt">
                  {photo.caption}
                </span>
                <span className="mt-1 block text-base text-slate-600">
                  {photo.credit}
                </span>
              </figcaption>
            </a>
          </figure>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          aria-label="Previous photo"
          className="grid h-12 w-12 place-items-center rounded-full border-2 border-cobalt text-2xl font-bold text-cobalt hover:bg-sky"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          onClick={() => goTo(current + 1)}
          aria-label="Next photo"
          className="grid h-12 w-12 place-items-center rounded-full border-2 border-cobalt text-2xl font-bold text-cobalt hover:bg-sky"
        >
          <span aria-hidden="true">→</span>
        </button>
        <p className="text-base font-bold text-slate-700">
          Photo {current + 1} of {photos.length}
        </p>
        <button
          type="button"
          onClick={() => setUserPaused(playing)}
          className="ml-auto rounded-full bg-sky px-4 py-2.5 text-base font-bold text-cobalt-deep hover:bg-violet-200"
        >
          {playing ? "Pause slideshow" : "Play slideshow"}
        </button>
      </div>
    </div>
  );
}
