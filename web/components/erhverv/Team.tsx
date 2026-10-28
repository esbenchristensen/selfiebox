import { OutlineExploded } from "@/components/Outline";
import { Ph } from "@/components/Placeholder";
import { contact } from "@/lib/erhverv/placeholder";

// Who the owner is talking to. A B2B buyer trusts a face and a town more than a logo wall, and we have
// no customers to show yet. The photo and the town are placeholders.
export function Team() {
  return (
    <section id="hvem" className="section team" aria-labelledby="team-title">
      <div className="wrap team-grid">
        <div className="sec-head" style={{ marginBottom: 0 }}>
          <span className="label">Hvem I taler med</span>
          <h2 id="team-title" className="h-l">
            Boksen er tegnet, printet og samlet i Danmark.
          </h2>
          <p className="lede">
            Selfi er startet af {contact.founders}. Elektronikken, kabinettet og softwaren er udviklet her, delene printes på vores egne printere, og det er os selv, der svarer, når I skriver.
          </p>
          <p className="muted">
            Skriv til{" "}
            <Ph note="e-mail mangler">
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </Ph>
            .
          </p>
        </div>
        <div className="team-art">
          <Ph block note="foto af stifterne med boksen mangler; stregtegningen står her, indtil det findes">
            <OutlineExploded />
          </Ph>
        </div>
      </div>
    </section>
  );
}
