document.addEventListener("DOMContentLoaded", function () {

    /* ================= NAVBAR SCROLL SHADOW ================= */

    window.addEventListener("scroll", function () {
        const navbar = document.querySelector(".custom-navbar");
        if (window.scrollY > 50) {
            navbar.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
        } else {
            navbar.style.boxShadow = "none";
        }
    });

    /* ================= VER PROYECTOS BUTTON ================= */
    // FIX: was defined as a global function inside DOMContentLoaded, so onclick="" couldn't find it.
    // Now wired via addEventListener on the button's id.

    const verProyectosBtn = document.getElementById("verProyectosBtn");
    if (verProyectosBtn) {
        verProyectosBtn.addEventListener("click", function () {
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
        });
    }

    /* ================= DARK MODE ================= */

    const darkToggle = document.getElementById("darkModeToggle");

    // FIX: persist dark mode preference across page reloads
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        darkToggle.textContent = "☀️";
    }

    darkToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            darkToggle.textContent = "☀️";
            localStorage.setItem("darkMode", "enabled");
        } else {
            darkToggle.textContent = "🌙";
            localStorage.setItem("darkMode", "disabled");
        }
    });

    /* ================= CARRUSEL ================= */

    const projectCards = document.querySelectorAll(".project-card");
    let currentIndex = 0;

    function updateCarousel() {
        projectCards.forEach(card => card.classList.remove("active", "left", "right"));

        const prevIndex = (currentIndex - 1 + projectCards.length) % projectCards.length;
        const nextIndex = (currentIndex + 1) % projectCards.length;

        projectCards[currentIndex].classList.add("active");
        projectCards[prevIndex].classList.add("left");
        projectCards[nextIndex].classList.add("right");
    }

    // FIX: removed inline onclick from HTML — wired here instead
    document.getElementById("prevBtn").addEventListener("click", function () {
        currentIndex = (currentIndex - 1 + projectCards.length) % projectCards.length;
        updateCarousel();
    });

    document.getElementById("nextBtn").addEventListener("click", function () {
        currentIndex = (currentIndex + 1) % projectCards.length;
        updateCarousel();
    });

    // Flip cards on click — only on active card for better UX
    projectCards.forEach(card => {
        card.addEventListener("click", function () {
            this.classList.toggle("flipped");
        });
    });

    updateCarousel();

    /* ================= ALERTA FLOTANTE ================= */

    const alertBox = document.getElementById("projectAlert");
    const projectsSection = document.getElementById("proyectos");
    let manuallyClosed = false;

    // FIX: wired via id instead of inline onclick
    document.getElementById("closeAlertBtn").addEventListener("click", function () {
        manuallyClosed = true;
        alertBox.style.display = "none";
    });

    window.addEventListener("scroll", function () {
        if (!projectsSection || manuallyClosed) return;

        const rect = projectsSection.getBoundingClientRect();
        const sectionVisible =
            rect.top < window.innerHeight * 0.6 &&
            rect.bottom > window.innerHeight * 0.4;

        alertBox.style.display = sectionVisible ? "block" : "none";
    });

    /* ================= REVEAL FORMACION ================= */

    const revealElements = document.querySelectorAll(".reveal-left, .reveal-right");
    const formacionSection = document.getElementById("formacion");

    if (formacionSection && revealElements.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealElements.forEach((el, index) => {
                        setTimeout(() => el.classList.add("reveal-visible"), index * 150);
                    });
                }
            });
        }, { threshold: 0.3 });

        revealObserver.observe(formacionSection);
    }

    /* ================= BURBUJAS TECNICAS ================= */

    const bubbles = document.querySelectorAll(".bubble");
    const area = document.getElementById("bubbleContainer");

    if (area && bubbles.length) {

        // Random initial positions
        bubbles.forEach(bubble => {
            bubble.style.left = Math.random() * 80 + "%";
            bubble.style.top  = Math.random() * 70 + "%";
        });

        // Mouse repel effect
        area.addEventListener("mousemove", (e) => {
            const rect = area.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            bubbles.forEach(bubble => {
                if (bubble.dataset.dragging === "true") return;

                const bRect  = bubble.getBoundingClientRect();
                const bX = bRect.left - rect.left + bRect.width  / 2;
                const bY = bRect.top  - rect.top  + bRect.height / 2;

                const dx = bX - mouseX;
                const dy = bY - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const angle = Math.atan2(dy, dx);
                    bubble.style.transform = `translate(${Math.cos(angle) * 40}px, ${Math.sin(angle) * 40}px)`;
                } else {
                    bubble.style.transform = "translate(0,0)";
                }
            });
        });

        // FIX: touch + drag events are now INSIDE the forEach loop so `bubble` is defined
        bubbles.forEach(bubble => {
            let offsetX, offsetY;

            /* --- MOUSE DRAG --- */
            bubble.addEventListener("mousedown", (e) => {
                bubble.dataset.dragging = "true";
                bubble.style.transition = "none";
                const rect = bubble.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;
            });

            document.addEventListener("mouseup", () => {
                bubble.dataset.dragging = "false";
                bubble.style.transition = "transform 0.2s ease";
            });

            document.addEventListener("mousemove", (e) => {
                if (bubble.dataset.dragging !== "true") return;
                const rect = area.getBoundingClientRect();
                let newX = e.clientX - rect.left - offsetX;
                let newY = e.clientY - rect.top  - offsetY;
                newX = Math.max(0, Math.min(newX, area.clientWidth  - bubble.offsetWidth));
                newY = Math.max(0, Math.min(newY, area.clientHeight - bubble.offsetHeight));
                bubble.style.left = newX + "px";
                bubble.style.top  = newY + "px";
            });

            /* --- TOUCH DRAG (FIX: was outside the loop, bubble was undefined) --- */
            bubble.addEventListener("touchstart", (e) => {
                const touch = e.touches[0];
                bubble.dataset.dragging = "true";
                const rect = bubble.getBoundingClientRect();
                offsetX = touch.clientX - rect.left;
                offsetY = touch.clientY - rect.top;
            }, { passive: true });

            document.addEventListener("touchmove", (e) => {
                if (bubble.dataset.dragging !== "true") return;
                const touch = e.touches[0];
                const rect  = area.getBoundingClientRect();
                let newX = touch.clientX - rect.left - offsetX;
                let newY = touch.clientY - rect.top  - offsetY;
                newX = Math.max(0, Math.min(newX, area.clientWidth  - bubble.offsetWidth));
                newY = Math.max(0, Math.min(newY, area.clientHeight - bubble.offsetHeight));
                bubble.style.left = newX + "px";
                bubble.style.top  = newY + "px";
            }, { passive: true });

            document.addEventListener("touchend", () => {
                bubble.dataset.dragging = "false";
            });
        });
    }

    /* ================= MAS ALLA DEL CODIGO — MODAL ================= */

    // FIX: renamed from `cards` to `hobbyCards` to avoid conflict with carousel variable
    const hobbyCards  = document.querySelectorAll(".hobby-card");
    const modal       = document.getElementById("customModal");
    const modalImg    = document.getElementById("modalImg");
    const modalTitle  = document.getElementById("modalTitle");
    const spotifyBtn  = document.getElementById("spotifyBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");

    hobbyCards.forEach(card => {
        card.addEventListener("click", () => {
            modalImg.src               = card.dataset.img;
            modalImg.alt               = card.dataset.title;
            modalTitle.textContent     = card.dataset.title;

            if (card.dataset.spotify) {
                spotifyBtn.style.display = "inline-block";
                spotifyBtn.href          = card.dataset.spotify;
            } else {
                spotifyBtn.style.display = "none";
            }

            modal.classList.add("active");
        });
    });

    closeModalBtn.addEventListener("click", () => modal.classList.remove("active"));

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
    });

    // Close modal on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") modal.classList.remove("active");
    });

    /* ================= CONTACTO — COPIAR AL PORTAPAPELES ================= */

    document.querySelectorAll(".copy-item").forEach(item => {
        item.addEventListener("click", () => {
            navigator.clipboard.writeText(item.dataset.copy).then(() => {
                const original = item.style.background;
                item.style.background = "#e7f9ef";
                setTimeout(() => { item.style.background = original || "#fff"; }, 800);
            });
        });
    });

    /* ================= CONTACTO — FORMULARIO ================= */
    // FIX: form now gives feedback. If you hook up Formspree it will actually send.
    // For a working backend: replace action="https://formspree.io/f/YOUR_FORM_ID" in HTML.

    const contactForm = document.getElementById("contactForm");
    const formStatus  = document.getElementById("formStatus");

    if (contactForm) {
        contactForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const action   = contactForm.action;

            // If the form action still has the placeholder, just show a local success message
            if (action.includes("YOUR_FORM_ID")) {
                formStatus.textContent = "✅ ¡Mensaje enviado! (Configura Formspree para recibirlo por email)";
                contactForm.reset();
                return;
            }

            try {
                const response = await fetch(action, {
                    method: "POST",
                    body: formData,
                    headers: { "Accept": "application/json" }
                });

                if (response.ok) {
                    formStatus.textContent = "✅ ¡Gracias! Tu mensaje fue enviado correctamente.";
                    contactForm.reset();
                } else {
                    formStatus.textContent = "❌ Hubo un problema al enviar. Intenta de nuevo.";
                }
            } catch {
                formStatus.textContent = "❌ Error de conexión. Intenta más tarde.";
            }
        });
    }

}); // end DOMContentLoaded


