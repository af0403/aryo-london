import { createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata({
  title: "House",
  description:
    "Discover the ARYO house: a London-based label built through structure, material, and restraint.",
  path: "/about",
  image: "/assets/generated/luma-pack/wide-collection-still-life.png",
  imageAlt: "Pennicella collection still life",
});

const houseSections = [
  {
    id: "founder",
    label: "Founder",
    title: "ARYO begins with a controlled first point of view.",
    text: "The house is being built through a smaller and more disciplined release structure. Pennicella opens with fewer pieces and more focus, so the product can carry the language before the catalogue grows.",
    image: "/assets/generated/luma-pack/homepage-hero-noir-desktop.png",
    alt: "Pennicella noir full look — Pennicella Jacket and Essential Trouser",
  },
  {
    id: "savoir-faire",
    label: "Savoir-Faire",
    title: "Construction details do the talking.",
    text: "Collar shape, lining, zip, snap hardware, and signature placement are treated as the main visual events. That keeps the finish elevated while the overall language remains quiet.",
    image: "/assets/generated/luma-pack/detail-noir-hardware.png",
    alt: "Pennicella Jacket hardware and collar detail",
  },
  {
    id: "timeline",
    label: "Timeline",
    title: "Pennicella is the opening chapter.",
    text: "The first release introduces noir and ivory through outerwear and trousers. The next step is a wider campaign and the continuation of the collection into new silhouettes.",
    image: "/assets/generated/luma-pack/wide-collection-still-life.png",
    alt: "Pennicella collection still life",
  },
];

export default function AboutPage() {
  return (
    <main className="section house-page">
      <nav className="house-nav" aria-label="House sections">
        {houseSections.map((section) => (
          <a href={`#${section.id}`} key={section.id}>
            {section.label}
          </a>
        ))}
      </nav>
      <div className="house-stack">
        {houseSections.map((section, index) => (
          <section className="house-panel" id={section.id} key={section.id}>
            <figure className="house-panel-media">
              <img src={section.image} alt={section.alt} />
            </figure>
            <div className="house-panel-copy">
              {index === 0 ? (
                <div className="house-intro">
                  <p className="eyebrow">House</p>
                  <h1 className="page-title">ARYO</h1>
                  <p>
                    A tighter house language built through structure, material,
                    and restraint rather than volume, graphics, or noise.
                  </p>
                </div>
              ) : null}
              <p className="eyebrow">{section.label}</p>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
