"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import bars from "@/components/three/bars.json";
import type { Venue } from "@/components/three/HaloBox";

// The Red Bull box in 3D on the catalogue page: drag to turn it. The render stays underneath until the
// model is ready, and it is what prints, so the PDF and the database copy show the same box.
const Stage = dynamic(() => import("@/components/three/Stage"), { ssr: false, loading: () => null });
const RB = (bars as Venue[]).find((v) => v.id === "red_bull")!;

export function Box3D({ poster, alt }: { poster: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let gl = false;
    try {
      const c = document.createElement("canvas");
      gl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {}
    const el = ref.current;
    if (!gl || !el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setNear(true), io.disconnect()), { rootMargin: "400px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`viewer kat-3d${ready ? " is-ready" : ""}`} role="img" aria-label={alt}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="kat-3d-poster" src={poster} alt="" />
      {near && <Stage design={{ venue: RB }} variant="venue" preload={[RB]} onReady={() => setReady(true)} />}
    </div>
  );
}
