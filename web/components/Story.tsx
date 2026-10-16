"use client";

import { useEffect, useRef, useState } from "react";

export type Step = { n: string; title: string; text: string };

export function Story({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);
  const [count, setCount] = useState(3);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (active !== 1) return;
    setCount(3);
    const t = setInterval(() => setCount((c) => (c > 1 ? c - 1 : 3)), 900);
    return () => clearInterval(t);
  }, [active]);

  return (
    <section id="saadan" className="section" aria-labelledby="story-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Sådan virker den</span>
          <h2 id="story-title" className="h-l">
            Fra tryk til billede på under et minut.
          </h2>
        </div>
        <div className="story">
          <div className="story-stage">
            <div className="box" data-step={active} role="img" aria-label={steps[active].title}>
              <div className="notch">
                <i />
              </div>
              <div className="screen">
                {active === 0 && (
                  <div>
                    <b>Tryk for at tage et billede</b>
                    <div className="shutter">
                      <i />
                    </div>
                  </div>
                )}
                {active === 1 && <span className="count">{count}</span>}
                {active >= 2 && <b>Smil</b>}
                <span className="flash" />
              </div>
              <div className="print">
                <i />
              </div>
            </div>
          </div>
          <div className="story-steps">
            {steps.map((s, i) => (
              <div
                key={s.n}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                data-i={i}
                className={`story-step${active === i ? " on" : ""}`}
              >
                <span className="n">{s.n}</span>
                <h3 className="h-m">{s.title}</h3>
                <p className="lede">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
