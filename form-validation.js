// Sistema di validazione form avanzato
class FormValidator {
  constructor() {
    this.patterns = {
      email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      phone: /^[+]?[0-9\s\-$$$$]{10,}$/,
      name: /^[a-zA-ZÀ-ÿ\s]{2,50}$/,
      password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    }

    this.messages = {
      required: "Questo campo è obbligatorio",
      email: "Inserisci un indirizzo email valido",
      phone: "Inserisci un numero di telefono valido",
      name: "Il nome deve contenere solo lettere e spazi (2-50 caratteri)",
      password:
        "La password deve contenere almeno 8 caratteri, una maiuscola, una minuscola, un numero e un carattere speciale",
      passwordMatch: "Le password non coincidono",
      minLength: "Minimo {min} caratteri richiesti",
      maxLength: "Massimo {max} caratteri consentiti",
      terms: "Devi accettare i termini e condizioni",
    }

    this.init()
  }

  init() {
    // Inizializza la validazione per tutti i form
    document.addEventListener("DOMContentLoaded", () => {
      this.setupFormValidation()
      this.setupRealTimeValidation()
      this.setupPasswordStrengthMeter()
      this.setupCustomValidations()
    })
  }

  setupFormValidation() {
    const forms = document.querySelectorAll("form")

    forms.forEach((form) => {
      form.addEventListener("submit", (e) => {
        if (!this.validateForm(form)) {
          e.preventDefault()
          this.showFormErrors(form)
        }
      })
    })
  }

  setupRealTimeValidation() {
    const inputs = document.querySelectorAll("input, textarea, select")

    inputs.forEach((input) => {
      // Validazione durante la digitazione
      input.addEventListener("input", () => {
        this.validateField(input)
      })

      // Validazione quando si perde il focus
      input.addEventListener("blur", () => {
        this.validateField(input)
      })

      // Rimuovi errori quando si inizia a digitare
      input.addEventListener("focus", () => {
        this.clearFieldError(input)
      })
    })
  }

  validateForm(form) {
    let isValid = true
    const inputs = form.querySelectorAll("input, textarea, select")

    inputs.forEach((input) => {
      if (!this.validateField(input)) {
        isValid = false
      }
    })

    return isValid
  }

  validateField(field) {
    const value = field.value.trim()
    const fieldType = field.type
    const fieldName = field.name
    const isRequired = field.hasAttribute("required")

    // Rimuovi errori precedenti
    this.clearFieldError(field)

    // Controllo campo obbligatorio
    if (isRequired && !value) {
      this.showFieldError(field, this.messages.required)
      return false
    }

    // Se il campo è vuoto e non obbligatorio, è valido
    if (!value && !isRequired) {
      return true
    }

    // Validazioni specifiche per tipo
    switch (fieldType) {
      case "email":
        if (!this.patterns.email.test(value)) {
          this.showFieldError(field, this.messages.email)
          return false
        }
        break

      case "tel":
        if (!this.patterns.phone.test(value)) {
          this.showFieldError(field, this.messages.phone)
          return false
        }
        break

      case "password":
        if (!this.validatePassword(field, value)) {
          return false
        }
        break

      case "text":
        if (fieldName === "name" || fieldName === "nome") {
          if (!this.patterns.name.test(value)) {
            this.showFieldError(field, this.messages.name)
            return false
          }
        }
        break

      case "checkbox":
        if (fieldName === "terms" || fieldName === "termsAgree") {
          if (!field.checked) {
            this.showFieldError(field, this.messages.terms)
            return false
          }
        }
        break
    }

    // Controllo lunghezza minima e massima
    const minLength = field.getAttribute("minlength")
    const maxLength = field.getAttribute("maxlength")

    if (minLength && value.length < Number.parseInt(minLength)) {
      this.showFieldError(field, this.messages.minLength.replace("{min}", minLength))
      return false
    }

    if (maxLength && value.length > Number.parseInt(maxLength)) {
      this.showFieldError(field, this.messages.maxLength.replace("{max}", maxLength))
      return false
    }

    // Controllo conferma password
    if (fieldName === "confirmPassword") {
      const passwordField = document.querySelector('input[name="password"]')
      if (passwordField && value !== passwordField.value) {
        this.showFieldError(field, this.messages.passwordMatch)
        return false
      }
    }

    // Se arriviamo qui, il campo è valido
    this.showFieldSuccess(field)
    return true
  }

  validatePassword(field, value) {
    if (!this.patterns.password.test(value)) {
      this.showFieldError(field, this.messages.password)
      return false
    }

    // Aggiorna il meter della forza password
    this.updatePasswordStrength(field, value)
    return true
  }

  showFieldError(field, message) {
    field.classList.add("error")
    field.classList.remove("success")

    // Rimuovi messaggio di errore esistente
    this.removeErrorMessage(field)

    // Crea nuovo messaggio di errore
    const errorDiv = document.createElement("div")
    errorDiv.className = "field-error"
    errorDiv.textContent = message

    // Inserisci il messaggio dopo il campo
    field.parentNode.insertBefore(errorDiv, field.nextSibling)

    // Aggiungi animazione
    setTimeout(() => {
      errorDiv.classList.add("show")
    }, 10)
  }

  showFieldSuccess(field) {
    field.classList.add("success")
    field.classList.remove("error")
    this.removeErrorMessage(field)
  }

  clearFieldError(field) {
    field.classList.remove("error", "success")
    this.removeErrorMessage(field)
  }

  removeErrorMessage(field) {
    const existingError = field.parentNode.querySelector(".field-error")
    if (existingError) {
      existingError.remove()
    }
  }

  showFormErrors(form) {
    const firstError = form.querySelector(".error")
    if (firstError) {
      firstError.focus()
      firstError.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  setupPasswordStrengthMeter() {
    const passwordFields = document.querySelectorAll('input[type="password"]')

    passwordFields.forEach((field) => {
      if (field.name === "password") {
        this.createPasswordStrengthMeter(field)
      }
    })
  }

  createPasswordStrengthMeter(field) {
    const meterContainer = document.createElement("div")
    meterContainer.className = "password-strength-meter"

    const meterBar = document.createElement("div")
    meterBar.className = "strength-bar"

    const meterText = document.createElement("div")
    meterText.className = "strength-text"
    meterText.textContent = "Forza password"

    meterContainer.appendChild(meterBar)
    meterContainer.appendChild(meterText)

    field.parentNode.insertBefore(meterContainer, field.nextSibling)
  }

  updatePasswordStrength(field, password) {
    const meterContainer = field.parentNode.querySelector(".password-strength-meter")
    if (!meterContainer) return

    const meterBar = meterContainer.querySelector(".strength-bar")
    const meterText = meterContainer.querySelector(".strength-text")

    const strength = this.calculatePasswordStrength(password)

    meterBar.className = `strength-bar strength-${strength.level}`
    meterBar.style.width = `${strength.percentage}%`
    meterText.textContent = `Forza password: ${strength.text}`
  }

  calculatePasswordStrength(password) {
    let score = 0
    const feedback = []

    // Lunghezza
    if (password.length >= 8) score += 25
    else feedback.push("almeno 8 caratteri")

    // Lettere minuscole
    if (/[a-z]/.test(password)) score += 25
    else feedback.push("lettere minuscole")

    // Lettere maiuscole
    if (/[A-Z]/.test(password)) score += 25
    else feedback.push("lettere maiuscole")

    // Numeri
    if (/\d/.test(password)) score += 25
    else feedback.push("numeri")

    // Caratteri speciali
    if (/[@$!%*?&]/.test(password)) score += 25
    else feedback.push("caratteri speciali")

    // Bonus per lunghezza extra
    if (password.length >= 12) score += 10
    if (password.length >= 16) score += 10

    let level, text
    if (score < 50) {
      level = "weak"
      text = "Debole"
    } else if (score < 75) {
      level = "medium"
      text = "Media"
    } else if (score < 100) {
      level = "strong"
      text = "Forte"
    } else {
      level = "very-strong"
      text = "Molto forte"
    }

    return {
      score,
      percentage: Math.min(score, 100),
      level,
      text,
      feedback,
    }
  }

  setupCustomValidations() {
    // Validazione rating stelle
    this.setupStarRating()

    // Validazione accordion FAQ
    this.setupFAQAccordion()

    // Validazione tab login/registrazione
    this.setupAuthTabs()

    // Validazione filtri portfolio
    this.setupPortfolioFilters()
  }

  setupStarRating() {
    const stars = document.querySelectorAll(".star")
    const ratingInput = document.getElementById("rating")

    stars.forEach((star, index) => {
      star.addEventListener("click", () => {
        const rating = index + 1
        if (ratingInput) ratingInput.value = rating

        stars.forEach((s, i) => {
          if (i < rating) {
            s.classList.add("active")
          } else {
            s.classList.remove("active")
          }
        })
      })

      star.addEventListener("mouseover", () => {
        const rating = index + 1
        stars.forEach((s, i) => {
          if (i < rating) {
            s.classList.add("hover")
          } else {
            s.classList.remove("hover")
          }
        })
      })
    })

    const ratingContainer = document.querySelector(".rating-select")
    if (ratingContainer) {
      ratingContainer.addEventListener("mouseleave", () => {
        stars.forEach((s) => s.classList.remove("hover"))
      })
    }
  }

  setupFAQAccordion() {
    const accordionHeaders = document.querySelectorAll(".accordion-header")

    accordionHeaders.forEach((header) => {
      header.addEventListener("click", () => {
        const accordionItem = header.parentElement
        const isActive = accordionItem.classList.contains("active")

        // Chiudi tutti gli altri accordion
        document.querySelectorAll(".accordion-item").forEach((item) => {
          item.classList.remove("active")
        })

        // Apri/chiudi quello cliccato
        if (!isActive) {
          accordionItem.classList.add("active")
        }
      })
    })
  }

  setupAuthTabs() {
    const formTabs = document.querySelectorAll(".form-tab")
    const authForms = document.querySelectorAll(".auth-form")

    formTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const targetForm = tab.getAttribute("data-form")

        // Rimuovi active da tutti i tab e form
        formTabs.forEach((t) => t.classList.remove("active"))
        authForms.forEach((f) => f.classList.remove("active"))

        // Attiva il tab e form selezionato
        tab.classList.add("active")
        const targetFormElement = document.getElementById(`${targetForm}Form`)
        if (targetFormElement) {
          targetFormElement.classList.add("active")
        }
      })
    })
  }

  setupPortfolioFilters() {
    const categoryTabs = document.querySelectorAll(".category-tab")
    const faqCategories = document.querySelectorAll(".faq-category")

    categoryTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const category = tab.getAttribute("data-category")

        // Rimuovi active da tutti i tab
        categoryTabs.forEach((t) => t.classList.remove("active"))
        tab.classList.add("active")

        // Mostra/nascondi categorie
        faqCategories.forEach((cat) => {
          if (cat.id === category) {
            cat.classList.add("active")
          } else {
            cat.classList.remove("active")
          }
        })
      })
    })
  }

  // Metodi di utilità
  static validateEmail(email) {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return pattern.test(email)
  }

  static validatePhone(phone) {
    const pattern = /^[+]?[0-9\s\-$$$$]{10,}$/
    return pattern.test(phone)
  }

  static sanitizeInput(input) {
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/[<>]/g, "")
  }
}

// Inizializza il validatore
const formValidator = new FormValidator()

// Funzioni specifiche per i form del sito
document.addEventListener("DOMContentLoaded", () => {
  // Gestione form testimonianze
  const testimonialForm = document.getElementById("testimonialForm")
  const testimonialMessage = document.getElementById("testimonialMessage")

  if (testimonialForm && testimonialMessage) {
    testimonialForm.addEventListener("submit", function (e) {
      e.preventDefault()

      if (formValidator.validateForm(this)) {
        const formData = new FormData(this)
        const rating = document.getElementById("rating")?.value

        if (!rating || rating === "0") {
          testimonialMessage.textContent = "Per favore, seleziona una valutazione."
          testimonialMessage.className = "form-message error"
          return
        }

        // Simula invio form
        testimonialMessage.textContent = "Grazie per la tua testimonianza! Sarà pubblicata dopo la revisione."
        testimonialMessage.className = "form-message success"

        // Reset form
        this.reset()
        document.querySelectorAll(".star").forEach((star) => star.classList.remove("active"))
        document.getElementById("rating").value = "0"

        // Nascondi messaggio dopo 5 secondi
        setTimeout(() => {
          testimonialMessage.textContent = ""
          testimonialMessage.className = "form-message"
        }, 5000)
      }
    })
  }

  // Gestione form FAQ
  const questionForm = document.getElementById("questionForm")
  const questionMessage = document.getElementById("questionMessage")

  if (questionForm && questionMessage) {
    questionForm.addEventListener("submit", function (e) {
      e.preventDefault()

      if (formValidator.validateForm(this)) {
        // Simula invio form
        questionMessage.textContent = "La tua domanda è stata inviata! Ti risponderemo al più presto."
        questionMessage.className = "form-message success"

        // Reset form
        this.reset()

        // Nascondi messaggio dopo 5 secondi
        setTimeout(() => {
          questionMessage.textContent = ""
          questionMessage.className = "form-message"
        }, 5000)
      }
    })
  }

  // Gestione form login/registrazione
  const loginForm = document.getElementById("loginForm")
  const registerForm = document.getElementById("registerForm")
  const authMessage = document.getElementById("authMessage")

  if (loginForm && authMessage) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault()

      if (formValidator.validateForm(this)) {
        const email = document.getElementById("loginEmail")?.value
        const password = document.getElementById("loginPassword")?.value

        // Simula autenticazione
        if (email === "demo@fomography.it" && password === "Demo123!") {
          authMessage.textContent = "Login effettuato con successo!"
          authMessage.className = "form-message success"

          // Simula redirect dopo 2 secondi
          setTimeout(() => {
            window.location.href = "index.html"
          }, 2000)
        } else {
          authMessage.textContent = "Credenziali non valide. Prova con: demo@fomography.it / Demo123!"
          authMessage.className = "form-message error"
        }
      }
    })
  }

  if (registerForm && authMessage) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault()

      if (formValidator.validateForm(this)) {
        // Simula registrazione
        authMessage.textContent = "Registrazione completata! Controlla la tua email per confermare l'account."
        authMessage.className = "form-message success"

        // Reset form
        this.reset()

        // Passa al tab login dopo 3 secondi
        setTimeout(() => {
          document.querySelector('.form-tab[data-form="login"]')?.click()
          authMessage.textContent = ""
          authMessage.className = "form-message"
        }, 3000)
      }
    })
  }

  // Gestione toggle password visibility
  const passwordToggles = document.querySelectorAll('input[type="checkbox"][id^="show"]')

  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("change", function () {
      const passwordField = this.closest(".form-group").querySelector('input[type="password"], input[type="text"]')

      if (passwordField) {
        if (this.checked) {
          passwordField.type = "text"
        } else {
          passwordField.type = "password"
        }
      }
    })
  })
})
