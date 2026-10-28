import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Contact } from "@/components/Contact";
import { ContentCalc } from "@/components/ContentMachine";
import { FeatureIcon } from "@/components/FeatureIcon";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { Nav } from "@/components/Nav";
import { Faq } from "@/components/Sections";
import { Soon } from "@/components/Soon";
import { featureBySlug, featureGroups, features } from "@/content";

// selfi.dk/funktioner/<slug>: one page per function, all from `features` in content.ts.

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return features.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const f = featureBySlug((await params).slug);
  if (!f) return {};
  const url = `/funktioner/${f.slug}`;
  return {
    title: f.seo.title,
    description: f.seo.description,
    alternates: { canonical: url },
    openGraph: { title: f.seo.title, description: f.seo.description, url, images: [{ url: f.photo.src, alt: f.photo.alt }] },
  };
}

export default async function FeaturePage({ params }: Props) {
  const f = featureBySlug((await params).slug);
  if (!f) notFound();
  const group = featureGroups.find((g) => g.id === f.group)!;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `${f.name} i Selfi`,
      description: f.seo.description,
      provider: { "@type": "Organization", name: "Selfi", url: "https://selfi.dk" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: f.faq.map((q) => ({ "@type": "Question", name: q.q, acceptedAnswer: { "@type": "Answer", text: q.a } })),
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <Nav
        links={[
          { label: "Forside", href: "/" },
          { label: "Sådan bruges den", href: "#brug" },
          { label: "Spørgsmål", href: "#faq" },
        ]}
      />
      <main>
        <Hero
          label={`Funktioner · ${group.name}${f.soon ? " · Kommer snart" : ""}`}
          title={f.title}
          lede={f.lede}
          primary={{ label: "Book en uforpligtende snak", href: "#kontakt" }}
          secondary={{ label: "Se alle funktioner", href: "/funktioner" }}
          image={f.photo}
        />
        <section className="section" aria-labelledby="points-title">
          <div className="wrap">
            <div className="sec-head">
              <span className="label feature-label">
                <FeatureIcon d={f.icon} /> {f.name}
              </span>
              <h2 id="points-title" className="h-l">
                Det får I.
              </h2>
            </div>
            <div className="gains">
              {f.points.map(([title, text, soon]) => (
                <div className="gain" key={title}>
                  <h3>{title}{soon && <Soon />}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
            {f.slug === "contentmaskine" && (
              <div className="cm-solo">
                <h3 className="h-m">Hvad svarer det til i medarbejdertimer?</h3>
                <ContentCalc />
              </div>
            )}
          </div>
        </section>
        <section id="brug" className="section" aria-labelledby="uses-title">
          <div className="wrap">
            <div className="sec-head">
              <span className="label">Sådan bruges den</span>
              <h2 id="uses-title" className="h-l">
                Sådan bruger stederne {f.name.toLowerCase()}.
              </h2>
            </div>
            <div className="gains">
              {f.uses.map(([place, text, soon]) => (
                <div className="gain" key={place}>
                  <h3>{place}{soon && <Soon />}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <Faq title={`Spørgsmål om ${f.name.toLowerCase()}.`} items={f.faq} />
        <Features label="Flere funktioner" title="Det kan boksen også." skip={f.slug} />
        <Contact topic={f.slug} />
      </main>
      <Footer />
    </>
  );
}
