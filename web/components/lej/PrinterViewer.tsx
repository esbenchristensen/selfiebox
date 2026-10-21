"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { OutlinePrinter } from "../Outline";

// three.js is only fetched when the viewer gets close to the screen; the line drawing stands in until then.
const PrinterStage = dynamic(() => import("../three/PrinterStage"), { ssr: false, loading: () => null });

// The printer in 3D: it sways by itself, and a drag turns it by hand.
export function PrinterViewer() {
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
    <div className="lej-box3d lej-printer3d">
      <div ref={ref} className={`viewer${ready ? " is-ready" : ""}`} role="img" aria-label="Selfi printer i 3D, som den kommer i kassen">
        <div className="viewer-poster" aria-hidden="true">
          <OutlinePrinter poster />
        </div>
        {near && webgl && <PrinterStage onReady={() => setReady(true)} />}
      </div>
      <span className="lej-box3d-hint" aria-hidden="true">
        Træk for at dreje
      </span>
    </div>
  );
}
