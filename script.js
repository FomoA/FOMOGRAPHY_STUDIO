// Attendi che il DOM sia completamente caricato
document.addEventListener("DOMContentLoaded", () => {
  // Preloader
  const preloader = document.querySelector(".preloader")
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.classList.add("fade-out")
      setTimeout(() => {
        preloader.style.display = "none"
      }, 500)

      // Avvia le animazioni dopo il caricamento
      animateOnScroll()
      startCounters()
    })
  }

  // Gestione tema (dark/light mode)
  const themeToggle = document.getElementById("theme-toggle")
  const htmlElement = document.documentElement

  if (themeToggle) {
    // Controlla se c'è una preferenza salvata
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      htmlElement.setAttribute("data-theme", savedTheme)
    }

    themeToggle.addEventListener("click", () => {
      const currentTheme = htmlElement.getAttribute("data-theme")
      const newTheme = currentTheme === "dark" ? "light" : "dark"

      htmlElement.setAttribute("data-theme", newTheme)
      localStorage.setItem("theme", newTheme)

      // Animazione di transizione
      document.body.style.transition = "background-color 0.5s ease, color 0.5s ease"
    })
  }

  // Menu Toggle
  const menuToggle = document.querySelector(".menu-toggle")
  const navMenu = document.querySelector(".nav-menu")

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active")
      this.classList.toggle("active")
    })
  }

  // Chiudi menu quando si clicca su un link
  const navLinks = document.querySelectorAll(".nav-menu a")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu) navMenu.classList.remove("active")
      if (menuToggle) menuToggle.classList.remove("active")
    })
  })

  // Gestione dello scroll - cambia lo sfondo della navbar
  window.addEventListener("scroll", () => {
    const header = document.querySelector("header")
    if (header) {
      if (window.scrollY > 50) {
        header.style.padding = "10px 0"
        header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)"
      } else {
        header.style.padding = "15px 0"
        header.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)"
      }
    }

    // Back to top button
    const backToTopBtn = document.getElementById("backToTop")
    if (backToTopBtn) {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("active")
      } else {
        backToTopBtn.classList.remove("active")
      }
    }

    // Animate elements on scroll
    animateOnScroll()
  })

  // Back to top button
  const backToTopBtn = document.getElementById("backToTop")
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  // Testimonial Slider
  const testimonialSlides = document.querySelectorAll(".testimonial-slide")
  const dots = document.querySelectorAll(".dot")
  const prevBtn = document.querySelector(".prev-testimonial")
  const nextBtn = document.querySelector(".next-testimonial")
  let currentSlide = 0
  let testimonialInterval

  function showSlide(n) {
    if (testimonialSlides.length === 0) return

    testimonialSlides.forEach((slide) => slide.classList.remove("active"))
    dots.forEach((dot) => dot.classList.remove("active"))

    currentSlide = (n + testimonialSlides.length) % testimonialSlides.length

    if (testimonialSlides[currentSlide]) {
      testimonialSlides[currentSlide].classList.add("active")
    }
    if (dots[currentSlide]) {
      dots[currentSlide].classList.add("active")
    }

    // Reset interval
    clearInterval(testimonialInterval)
    startTestimonialInterval()
  }

  function startTestimonialInterval() {
    if (testimonialSlides.length > 0) {
      testimonialInterval = setInterval(() => {
        showSlide(currentSlide + 1)
      }, 5000)
    }
  }

  if (dots.length > 0) {
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => showSlide(index))
    })
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => showSlide(currentSlide - 1))
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => showSlide(currentSlide + 1))
  }

  // Start automatic testimonial slider
  if (testimonialSlides.length > 0) {
    startTestimonialInterval()
  }

  // Animate elements on scroll
  function animateOnScroll() {
    const elements = document.querySelectorAll(".animate-on-scroll")

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      if (elementPosition < windowHeight - 50) {
        element.classList.add("show")
      }
    })
  }

  // Animate counters
  function startCounters() {
    const counters = document.querySelectorAll(".stat-number")

    counters.forEach((counter) => {
      const target = Number.parseInt(counter.getAttribute("data-count"))
      if (!target) return

      const duration = 2000 // 2 seconds
      const step = Math.ceil(target / (duration / 20)) // Update every 20ms
      let current = 0

      const updateCounter = () => {
        current += step
        if (current > target) {
          current = target
          clearInterval(interval)
        }
        counter.textContent = current
      }

      const interval = setInterval(updateCounter, 20)
    })
  }

  // Newsletter Form
  const newsletterForm = document.getElementById("newsletterForm")
  const newsletterMessage = document.getElementById("newsletterMessage")

  if (newsletterForm && newsletterMessage) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const email = document.getElementById("newsletterEmail")?.value

      if (!email) {
        newsletterMessage.textContent = "Per favore, inserisci il tuo indirizzo email."
        newsletterMessage.className = "form-message error"
        return
      }

      // Simulate form submission
      newsletterMessage.textContent = "Grazie per l'iscrizione alla nostra newsletter!"
      newsletterMessage.className = "form-message success"

      // Reset form
      this.reset()

      // Hide message after 5 seconds
      setTimeout(() => {
        newsletterMessage.textContent = ""
        newsletterMessage.className = "form-message"
      }, 5000)
    })
  }

  // Cookie Consent
  const cookieConsent = document.getElementById("cookieConsent")
  const acceptCookies = document.getElementById("acceptCookies")
  const declineCookies = document.getElementById("declineCookies")

  if (cookieConsent && acceptCookies && declineCookies) {
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem("cookieConsent")

    if (!cookieChoice) {
      // Show cookie consent after 2 seconds
      setTimeout(() => {
        cookieConsent.classList.add("active")
      }, 2000)
    }

    acceptCookies.addEventListener("click", () => {
      localStorage.setItem("cookieConsent", "accepted")
      cookieConsent.classList.remove("active")
    })

    declineCookies.addEventListener("click", () => {
      localStorage.setItem("cookieConsent", "declined")
      cookieConsent.classList.remove("active")
    })
  }
})
