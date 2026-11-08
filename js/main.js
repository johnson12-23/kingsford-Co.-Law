const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");
document.documentElement.classList.add("js");

if (menuToggle && navigation) {
  const practiceDropdown = navigation.querySelector(".nav-dropdown");
  const practiceToggle = navigation.querySelector(".nav-dropdown-toggle");
  const desktopNavigation = window.matchMedia("(min-width: 64rem)");

  const setPracticeDropdownOpen = (isOpen) => {
    if (!practiceDropdown || !practiceToggle) return;
    practiceDropdown.classList.toggle("is-open", isOpen);
    practiceToggle.setAttribute("aria-expanded", String(isOpen));
  };

  if (practiceDropdown && practiceToggle) {
    practiceToggle.addEventListener("click", () => {
      if (!desktopNavigation.matches) {
        setPracticeDropdownOpen(practiceToggle.getAttribute("aria-expanded") !== "true");
      }
    });

    practiceDropdown.addEventListener("mouseenter", () => {
      if (desktopNavigation.matches) setPracticeDropdownOpen(true);
    });
    practiceDropdown.addEventListener("mouseleave", () => {
      if (desktopNavigation.matches) setPracticeDropdownOpen(false);
    });
    practiceDropdown.addEventListener("focusin", () => {
      if (desktopNavigation.matches) setPracticeDropdownOpen(true);
    });
    practiceDropdown.addEventListener("focusout", (event) => {
      if (desktopNavigation.matches && !practiceDropdown.contains(event.relatedTarget)) {
        setPracticeDropdownOpen(false);
      }
    });
    desktopNavigation.addEventListener("change", (event) => {
      if (!event.matches) setPracticeDropdownOpen(false);
    });
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    const clickedLink = event.target instanceof Element ? event.target.closest("a") : null;
    if (clickedLink && navigation.contains(clickedLink)) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
      navigation.classList.remove("is-open");
      setPracticeDropdownOpen(false);
    }
  });
}

const backToTop = document.querySelector(".back-to-top");
if (backToTop) {
  const updateBackToTop = () => backToTop.classList.toggle("is-visible", window.scrollY > 420);
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();
}

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
  { quote: "“I never felt like a case number. The team explained each step, listened carefully, and made a difficult process feel manageable.”", name: "Jordan M.", detail: "Family law client", initials: "JM" },
  { quote: "“The advice was direct, thoughtful, and grounded in what mattered to our business. I always knew what to expect next.”", name: "Morgan R.", detail: "Business client", initials: "MR" },
  { quote: "“I felt heard from our very first meeting. Their calm guidance helped me understand my options and move forward with confidence.”", name: "Taylor A.", detail: "Real estate client", initials: "TA" },
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

const consultationForms = document.querySelectorAll("[data-consultation-form]");
const consultationParams = new URLSearchParams(window.location.search);

consultationForms.forEach((form) => {
  const practiceField = form.querySelector('[data-field="practice"]');
  const attorneyField = form.querySelector('[data-field="attorney"]');
  const requestedPractice = consultationParams.get("practice");
  const requestedAttorney = consultationParams.get("attorney");

  if (practiceField instanceof HTMLSelectElement && requestedPractice) {
    const matchingPractice = Array.from(practiceField.options).find((option) => option.value === requestedPractice);
    if (matchingPractice) practiceField.value = matchingPractice.value;
  }
  if (attorneyField instanceof HTMLSelectElement && requestedAttorney) {
    const matchingAttorney = Array.from(attorneyField.options).find((option) => option.value === requestedAttorney);
    if (matchingAttorney) attorneyField.value = matchingAttorney.value;
  }

  const validateField = (field) => {
    const value = field.value.trim();
    let message = "";

    if (field.required && !value) {
      message = "This field is required.";
    } else if (value && field.dataset.field === "name" && value.length < 2) {
      message = "Please enter your full name.";
    } else if (value && field.dataset.field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = "Enter a valid email address.";
    } else if (value && field.dataset.field === "phone") {
      const digits = value.replace(/\D/g, "");
      if (digits.length < 7 || digits.length > 15) message = "Enter a valid phone number.";
    } else if (value && field.dataset.field === "date") {
      const selectedDate = new Date(`${value}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) message = "Choose today or a future date.";
    }

    field.setAttribute("aria-invalid", String(Boolean(message)));
    const errorId = field.getAttribute("aria-describedby");
    const errorElement = errorId ? document.getElementById(errorId) : null;
    if (errorElement) errorElement.textContent = message;
    return !message;
  };

  form.querySelectorAll("[data-field]").forEach((field) => {
    const eventName = field instanceof HTMLSelectElement ? "change" : "input";
    field.addEventListener(eventName, () => {
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fields = Array.from(form.querySelectorAll("[data-field]"));
    const invalidFields = fields.filter((field) => !validateField(field));
    const status = form.querySelector("[data-form-status]");
    const submitButton = form.querySelector('button[type="submit"]');

    if (invalidFields.length) {
      if (status) {
        status.className = "form-status is-error";
        status.textContent = "Please review the highlighted fields and try again.";
      }
      invalidFields[0].focus();
      return;
    }

    const fullName = form.querySelector('[data-field="name"]').value.trim();
    if (/YOUR_FORMSPREE_ID/i.test(form.action)) {
      if (status) {
        status.className = "form-status is-demo";
        status.textContent = `Thanks, ${fullName}. Your details are ready, but this demo form has not sent them. Replace YOUR_FORMSPREE_ID in the form action with your Formspree form ID to enable email delivery.`;
      }
      return;
    }

    if (!(submitButton instanceof HTMLButtonElement)) {
      throw new Error("Consultation form is missing its submit button.");
    }

    submitButton.disabled = true;
    if (status) {
      status.className = "form-status";
      status.textContent = "Sending your request…";
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        if (status) {
          status.className = "form-status is-error";
          status.textContent = `We couldn’t send your request (HTTP ${response.status}). Please try again or call (202) 555-0148.`;
        }
        return;
      }

      form.reset();
      form.querySelectorAll("[data-field]").forEach((field) => {
        field.removeAttribute("aria-invalid");
        const errorId = field.getAttribute("aria-describedby");
        const errorElement = errorId ? document.getElementById(errorId) : null;
        if (errorElement) errorElement.textContent = "";
      });
      if (status) {
        status.className = "form-status is-success";
        status.textContent = "Thank you. Your consultation request has been sent. Our team will be in touch shortly.";
      }
    } catch (error) {
      console.error("Consultation request could not be sent.", error);
      if (status) {
        status.className = "form-status is-error";
        status.textContent = "We couldn’t reach the form service. Please try again or call (202) 555-0148.";
      }
    } finally {
      submitButton.disabled = false;
    }
  });
});
