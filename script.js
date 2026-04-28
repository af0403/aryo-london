const header = document.querySelector(".site-header");
const heroImage = document.querySelector(".hero-image");
const revealTargets = document.querySelectorAll(".reveal");
const waitlistForm = document.querySelector("#waitlist-form");
const waitlistEmail = document.querySelector("#waitlist-email");
const formMessage = document.querySelector("#form-message");

const updateChrome = () => {
  const scrollY = window.scrollY;

  if (header) {
    header.classList.toggle("is-scrolled", scrollY > 12);
  }

  if (heroImage) {
    const shift = Math.min(scrollY * 0.045, 18);
    const scale = 1.03 + Math.min(scrollY * 0.00005, 0.02);
    heroImage.style.setProperty("--hero-shift", `${shift}px`);
    heroImage.style.setProperty("--hero-scale", String(scale));
  }
};

updateChrome();
window.addEventListener("scroll", updateChrome, { passive: true });

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
);

revealTargets.forEach((target) => revealObserver.observe(target));

if (waitlistForm && waitlistEmail && formMessage) {
  waitlistForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = waitlistEmail.value.trim();
    if (!email) {
      formMessage.textContent = "Add an email address first.";
      return;
    }

    const stored = JSON.parse(localStorage.getItem("aryo-waitlist-prototype") || "[]");
    if (!stored.includes(email)) {
      stored.push(email);
      localStorage.setItem("aryo-waitlist-prototype", JSON.stringify(stored));
    }

    formMessage.textContent =
      "Saved locally for this prototype. The live version can be connected to your access list next.";
    waitlistForm.reset();
  });
}
