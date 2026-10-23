"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { OutlinePrinter } from "../Outline";

// three.js is only fetched when the viewer gets close to the screen; the line drawing stands in until then.
const PrinterStage = dynamic(() => import("../three/PrinterStage"), { ssr: false, loading: () => null });

// The printer in 3D: it sways by itself, a drag turns it by hand, and a print slides into the pocket as the page
// scrolls: nothing when the viewer comes in at the bottom of the screen, as far out as it goes when it has reached
// the upper part. Scrolling back pulls the print in again.
// `erhverv`: the same viewer on /erhverv, where lej.css is not loaded.
export function PrinterViewer({ variant = "lej" }: { variant?: "lej" | "erhverv" }) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
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
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const update = () => {
      if (reduce) {
        progress.current = 1;
        return;
      }
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const centre = r.top + r.height / 2;
      progress.current = Math.min(1, Math.max(0, (vh * 0.95 - centre) / (vh * 0.5)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
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
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className={variant === "lej" ? "lej-box3d lej-printer3d" : "pr-3d"}>
      <div ref={ref} className={`viewer${ready ? " is-ready" : ""}`} role="img" aria-label="Selfi printer i 3D, som den kommer i kassen">
        <div className="viewer-poster" aria-hidden="true">
          <OutlinePrinter poster />
        </div>
        {near && webgl && <PrinterStage onReady={() => setReady(true)} progress={progress} />}
      </div>
      <span className={variant === "lej" ? "lej-box3d-hint" : "pr-3d-hint"} aria-hidden="true">
        Træk for at dreje
      </span>
    </div>
  );
}
