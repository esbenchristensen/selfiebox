import { PLACEHOLDERS_VISIBLE } from "@/lib/erhverv/placeholder";

// Marks text that is made up or not decided yet (lib/erhverv/placeholder.ts). While PLACEHOLDERS_VISIBLE is
// true it draws a yellow dotted outline and the word "pladsholder", so nobody mistakes it for a fact.
// `block` wraps a whole box (a quote, a logo) instead of a run of text.
export function Ph({ children, block, note }: { children: React.ReactNode; block?: boolean; note?: string }) {
  if (!PLACEHOLDERS_VISIBLE) return <>{children}</>;
  const Tag = block ? "div" : "span";
  return (
    <Tag className={`ph-mark${block ? " ph-mark--block" : ""}`} title={note ? `Pladsholder: ${note}` : "Pladsholder: skal skiftes ud"}>
      {children}
    </Tag>
  );
}
