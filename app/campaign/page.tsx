const campaignFrames = [
  {
    image: "/assets/generated/luma-pack/homepage-hero-noir-desktop.png",
    alt: "Full noir Pennicella look — Structure Jacket and Essential Trouser",
    eyebrow: "Noir look",
    title: "The collection opens through silhouette.",
    text: "Pennicella is introduced through the full noir look. The jacket and trouser are designed as one piece of language — structure and ease held in the same quiet register.",
  },
  {
    image: "/assets/generated/luma-pack/detail-noir-hardware.png",
    alt: "Silver hardware and collar detail on the Structure Jacket",
    eyebrow: "Detail",
    title: "Hardware and collar are kept precise.",
    text: "The strength of the jacket sits in the collar line, the zip, and the way the surface texture holds them together.",
  },
  {
    image: "/assets/generated/luma-pack/detail-ivory-embroidery.png",
    alt: "ARYO signature embroidery on the ivory Essential Trouser",
    eyebrow: "Ivory",
    title: "A softer tone without changing the language.",
    text: "The ivory trouser keeps the same measured proportion. Only the colour shifts the mood.",
  },
];

export default function CampaignPage() {
  return (
    <main className="section campaign-page">
      <div className="campaign-lead">
        <p className="eyebrow">Campaign</p>
        <h1 className="page-title">Pennicella | AF by ARYO</h1>
        <p>
          The direction stays stripped back so the house, the silhouette, and the material can lead.
        </p>
      </div>

      <div className="campaign-stack">
        {campaignFrames.map((frame, index) => (
          <section className={`campaign-frame ${index === 0 ? "campaign-frame-full" : ""}`} key={frame.title}>
            <figure className="campaign-frame-media">
              <img src={frame.image} alt={frame.alt} />
            </figure>

            <div className="campaign-frame-copy">
              <p className="eyebrow">{frame.eyebrow}</p>
              <h2>{frame.title}</h2>
              <p>{frame.text}</p>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
