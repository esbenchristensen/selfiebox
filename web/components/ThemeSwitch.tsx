"use client";

import { useEffect, useState } from "react";
import { THEME_KEY as KEY } from "@/lib/theme";

type Choice = "system" | "light" | "dark";


function apply(choice: Choice) {
  const root = document.documentElement;
  if (choice === "system") delete root.dataset.theme;
  else root.dataset.theme = choice;
  try {
    if (choice === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, choice);
  } catch {
    // Storage can be blocked; the choice still applies for this visit.
  }
}

export function ThemeSwitch() {
  const [choice, setChoice] = useState<Choice>("system");

  useEffect(() => {
    const t = document.documentElement.dataset.theme;
    if (t === "light" || t === "dark") setChoice(t);
  }, []);

  const options: [Choice, string][] = [
    ["system", "System"],
    ["light", "Lys"],
    ["dark", "Mørk"],
  ];

  return (
    <div className="theme-switch">
      <span id="theme-label">Tema</span>
      <div className="seg" role="group" aria-labelledby="theme-label">
        {options.map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={choice === value}
            onClick={() => {
              setChoice(value);
              apply(value);
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
