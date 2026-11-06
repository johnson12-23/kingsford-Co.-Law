const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");
document.documentElement.classList.add("js");

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
      navigation.classList.remove("is-open");
    }
  });
}

const backToTop = document.querySelector(".back-to-top");
if (backToTop) {
  const updateBackToTop = () => backToTop.classList.toggle("is-visible", window.scrollY > 420);
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();
}

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const reviewQuote = document.querySelector("[data-review-quote]");
const reviewName = document.querySelector("[data-review-name]");
const reviewDetail = document.querySelector("[data-review-detail]");
const reviewInitials = document.querySelector("[data-review-initials]");
const reviewIndex = document.querySelector("[data-review-index]");
const reviewControls = document.querySelectorAll("[data-review-step]");
const reviews = [
  { quote: "“I never felt like a case number. The team explained each step, listened carefully, and made a difficult process feel manageable.”", name: "Jordan M.", detail: "Family law client · Illustrative placeholder", initials: "JM" },
  { quote: "“The advice was direct, thoughtful, and grounded in what mattered to our business. I always knew what to expect next.”", name: "Morgan R.", detail: "Business client · Illustrative placeholder", initials: "MR" },
  { quote: "“I felt heard from our very first meeting. Their calm guidance helped me understand my options and move forward with confidence.”", name: "Taylor A.", detail: "Real estate client · Illustrative placeholder", initials: "TA" },
];

if (reviewQuote && reviewName && reviewDetail && reviewInitials && reviewIndex) {
  let activeReview = 0;
  reviewControls.forEach((control) => {
    control.addEventListener("click", () => {
      const direction = Number(control.getAttribute("data-review-step"));
      activeReview = (activeReview + direction + reviews.length) % reviews.length;
      const review = reviews[activeReview];
      reviewQuote.textContent = review.quote;
      reviewName.textContent = review.name;
      reviewDetail.textContent = review.detail;
      reviewInitials.textContent = review.initials;
      reviewIndex.textContent = `${String(activeReview + 1).padStart(2, "0")} / ${String(reviews.length).padStart(2, "0")}`;
    });
  });
}
