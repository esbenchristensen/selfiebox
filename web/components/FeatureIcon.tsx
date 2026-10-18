// The line icon for a function: a path in a 48 × 48 box, from `features` in content.ts.
export function FeatureIcon({ d, className }: { d: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
