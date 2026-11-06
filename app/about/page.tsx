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
    title: "The house carries its founder's name.",
    text: "ARYO is Aryo's own name, written آریو in Persian. He started the house in London to make clothing at the level of the houses he admired, built here and made to order. The heritage is carried in the name, and in every decision that follows.",
    image: "/assets/generated/product-refresh/stills/noir-jacket-open-label.png",
    alt: "The Noir Pennicella Jacket open to show the lining and the ARYO neck label",
    position: "center 14%",
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
              <img
                src={section.image}
                alt={section.alt}
                style={
                  "position" in section
                    ? { objectPosition: section.position }
                    : undefined
                }
              />
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
