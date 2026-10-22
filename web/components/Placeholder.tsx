import { PLACEHOLDERS_VISIBLE } from "@/lib/erhverv/placeholder";

// Marks text that is made up or not decided yet (lib/erhverv/placeholder.ts). While PLACEHOLDERS_VISIBLE is
// true it draws a yellow dotted outline and the word "pladsholder", so nobody mistakes it for a fact.
// `block` wraps a whole box (a quote, a logo) instead of a run of text. The block's div (.ph-block) stays when
// the marks are off, because layouts use it as a grid or flex box (.case-body, .quote, .case-study).
export function Ph({ children, block, note }: { children: React.ReactNode; block?: boolean; note?: string }) {
  if (block) {
    if (!PLACEHOLDERS_VISIBLE) return <div className="ph-block">{children}</div>;
    return (
      <div className="ph-block ph-mark" title={note ? `Pladsholder: ${note}` : "Pladsholder: skal skiftes ud"}>
        {children}
      </div>
    );
  }
  if (!PLACEHOLDERS_VISIBLE) return <>{children}</>;
  return (
    <span className="ph-mark" title={note ? `Pladsholder: ${note}` : "Pladsholder: skal skiftes ud"}>
      {children}
    </span>
  );
}
