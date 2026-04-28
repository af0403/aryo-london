const houseSections = [
  {
    id: "founder",
    label: "Founder",
    title: "ARYO begins with a controlled first point of view.",
    text: "The house is being built through a smaller and more disciplined release structure. Pennicella opens with fewer pieces and more focus, so the product can carry the language before the catalogue grows.",
    image: "/assets/generated/luma-pack/homepage-hero-noir-desktop.png",
    alt: "Pennicella noir full look — Structure Jacket and Essential Trouser",
  },
  {
    id: "heritage",
    label: "Heritage",
    title: "Made in London, built around texture and restraint.",
    text: "The reference point is not speed or noise. The collection is shaped through controlled silhouette, heavier surface, cleaner finishes, and branding that does not interrupt the garment.",
    image: "/assets/generated/luma-pack/wide-collection-still-life.png",
    alt: "Pennicella collection still life — structure jacket and essential trouser",
  },
  {
    id: "savoir-faire",
    label: "Savoir-Faire",
    title: "Construction details do the talking.",
    text: "Collar shape, lining, zip, snap hardware, and signature placement are treated as the main visual events. That keeps the finish elevated while the overall language remains quiet.",
    image: null,
    alt: "",
  },
  {
    id: "timeline",
    label: "Timeline",
    title: "Pennicella is the opening chapter.",
    text: "The first release introduces noir and ivory through outerwear and trousers. The next step is a wider campaign and the continuation of the collection into new silhouettes.",
    image: null,
    alt: "",
  },
];

export default function AboutPage() {
  return (
    <main className="section house-page">
      <div className="page-intro house-intro">
        <p className="eyebrow">House</p>
        <h1 className="page-title">ARYO</h1>
        <p>
          A tighter house language built through structure, material, and restraint rather than volume, graphics, or
          noise.
        </p>
      </div>

      <nav className="house-nav" aria-label="House sections">
        {houseSections.map((section) => (
          <a href={`#${section.id}`} key={section.id}>
            {section.label}
          </a>
        ))}
      </nav>

      <div className="house-stack">
        {houseSections.map((section, index) => (
          <section
            className={`house-panel ${index % 2 === 1 ? "is-reverse" : ""}`}
            id={section.id}
            key={section.id}
          >
            {section.image ? (
              <figure className="house-panel-media">
                <img src={section.image} alt={section.alt} />
              </figure>
            ) : null}

            <div className="house-panel-copy">
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
