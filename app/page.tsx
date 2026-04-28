import { HomeCarousel } from "../components/home-carousel";

export default function HomePage() {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/assets/generated/aryo-campaign-noir.png"
      />
      <main className="home-main">
        <HomeCarousel />
      </main>
    </>
  );
}
