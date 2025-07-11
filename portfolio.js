// Script specifico per la pagina Portfolio
document.addEventListener("DOMContentLoaded", () => {
  // Variabili per il portfolio
  const filterBtns = document.querySelectorAll(".filter-btn")
  const galleryItems = document.querySelectorAll(".gallery-item")
  const noResultsMessage = document.getElementById("noResultsMessage")
  const categoryLinks = document.querySelectorAll(".category-overlay .btn")

  // Variabili per il lightbox
  const lightbox = document.getElementById("lightbox")
  const lightboxImg = document.getElementById("lightbox-img")
  const lightboxCaption = document.getElementById("lightbox-caption")
  const lightboxCounter = document.getElementById("lightbox-counter")
  const closeLightbox = document.querySelector(".close-lightbox")
  const prevImage = document.querySelector(".prev-image")
  const nextImage = document.querySelector(".next-image")
  const viewButtons = document.querySelectorAll(".view-image")

  let currentImageIndex = 0
  let galleryImages = []

  // Filtro portfolio
  function filterGallery(filter) {
    let visibleItems = 0

    galleryItems.forEach((item) => {
      if (filter === "all" || item.getAttribute("data-category") === filter) {
        item.style.display = "block"
        visibleItems++
      } else {
        item.style.display = "none"
      }
    })

    // Mostra/nascondi messaggio "nessun risultato"
    if (noResultsMessage) {
      if (visibleItems === 0) {
        noResultsMessage.style.display = "block"
      } else {
        noResultsMessage.style.display = "none"
      }
    }

    // Aggiorna la classe active sul pulsante di filtro
    filterBtns.forEach((btn) => {
      if (btn.getAttribute("data-filter") === filter) {
        btn.classList.add("active")
      } else {
        btn.classList.remove("active")
      }
    })
  }

  // Event listener per i pulsanti di filtro
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter")
      filterGallery(filter)
    })
  })

  // Event listener per i link delle categorie
  categoryLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const filter = this.getAttribute("data-filter")
      filterGallery(filter)

      // Scorri fino alla galleria
      const portfolioGallery = document.querySelector(".portfolio-gallery")
      if (portfolioGallery) {
        portfolioGallery.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Funzioni per il lightbox
  function openLightbox(index) {
    if (!lightbox || !lightboxImg || !lightboxCaption || !lightboxCounter) return

    // Raccogli tutte le immagini visibili
    galleryImages = []
    document.querySelectorAll(".gallery-item:not([style*='display: none']) .view-image").forEach((btn) => {
      galleryImages.push({
        src: btn.getAttribute("data-src"),
        title: btn.getAttribute("data-title"),
      })
    })

    if (galleryImages.length === 0) return

    currentImageIndex = index < galleryImages.length ? index : 0
    updateLightboxImage()
    lightbox.style.display = "block"
    document.body.style.overflow = "hidden" // Impedisce lo scroll della pagina

    // Aggiungi event listener per i tasti
    document.addEventListener("keydown", handleKeyDown)
  }

  function closeLightboxFunc() {
    if (!lightbox) return

    lightbox.style.display = "none"
    document.body.style.overflow = "" // Ripristina lo scroll della pagina
    document.removeEventListener("keydown", handleKeyDown)
  }

  function updateLightboxImage() {
    if (!lightboxImg || !lightboxCaption || !lightboxCounter || galleryImages.length === 0) return

    const image = galleryImages[currentImageIndex]
    lightboxImg.src = image.src
    lightboxCaption.textContent = image.title
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`

    // Abilita/disabilita i pulsanti prev/next
    if (prevImage) {
      prevImage.style.opacity = currentImageIndex > 0 ? "1" : "0.5"
    }
    if (nextImage) {
      nextImage.style.opacity = currentImageIndex < galleryImages.length - 1 ? "1" : "0.5"
    }
  }

  function prevImageFunc() {
    if (currentImageIndex > 0) {
      currentImageIndex--
      updateLightboxImage()
    }
  }

  function nextImageFunc() {
    if (currentImageIndex < galleryImages.length - 1) {
      currentImageIndex++
      updateLightboxImage()
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      closeLightboxFunc()
    } else if (e.key === "ArrowLeft") {
      prevImageFunc()
    } else if (e.key === "ArrowRight") {
      nextImageFunc()
    }
  }

  // Event listeners per il lightbox
  viewButtons.forEach((btn, index) => {
    btn.addEventListener("click", function () {
      // Trova l'indice dell'immagine all'interno delle immagini visibili
      const visibleButtons = Array.from(
        document.querySelectorAll(".gallery-item:not([style*='display: none']) .view-image"),
      )
      const visibleIndex = visibleButtons.indexOf(this)
      openLightbox(visibleIndex)
    })
  })

  if (closeLightbox) {
    closeLightbox.addEventListener("click", closeLightboxFunc)
  }

  if (prevImage) {
    prevImage.addEventListener("click", prevImageFunc)
  }

  if (nextImage) {
    nextImage.addEventListener("click", nextImageFunc)
  }

  // Chiudi lightbox quando si clicca sullo sfondo
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightboxFunc()
      }
    })
  }

  // Effetto hover avanzato per le immagini della galleria
  galleryItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      const overlay = this.querySelector(".gallery-overlay")
      if (overlay) {
        overlay.style.opacity = "1"
      }
    })

    item.addEventListener("mouseleave", function () {
      const overlay = this.querySelector(".gallery-overlay")
      if (overlay) {
        overlay.style.opacity = "0"
      }
    })
  })

  // Animazione per le immagini quando entrano nel viewport
  const animateGalleryItems = () => {
    galleryItems.forEach((item) => {
      const itemPosition = item.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      if (itemPosition < windowHeight - 50) {
        item.classList.add("show")
      }
    })
  }

  // Esegui l'animazione al caricamento e allo scroll
  animateGalleryItems()
  window.addEventListener("scroll", animateGalleryItems)
})
