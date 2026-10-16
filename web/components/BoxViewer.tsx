"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { OutlinePoster } from "./Outline";
import type { StageProps } from "./three/Stage";

// three.js is only fetched when the viewer gets close to the screen.
const Stage = dynamic(() => import("./three/Stage"), { ssr: false, loading: () => null });

export function BoxViewer({ design, variant, label }: { design: StageProps["design"]; variant: StageProps["variant"]; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setWebgl(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`viewer${ready ? " is-ready" : ""}`} role="img" aria-label={label}>
      <div className="viewer-poster" aria-hidden="true">
        <OutlinePoster />
      </div>
      {near && webgl && <Stage design={design} variant={variant} onReady={() => setReady(true)} />}
    </div>
  );
}
