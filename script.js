document.addEventListener("DOMContentLoaded", function () {

    /* ================= GENERAL ================= */

    function scrollToSection() {
        window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth"
        });
    }

    window.addEventListener("scroll", function () {
        const navbar = document.querySelector(".custom-navbar");
        if (window.scrollY > 50) {
            navbar.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
        } else {
            navbar.style.boxShadow = "none";
        }
    });

    /*-------------------MODO OSCURO------------------------*/
    const darkToggle = document.getElementById("darkModeToggle");

darkToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        darkToggle.textContent = "☀️";
    } else {
        darkToggle.textContent = "🌙";
    }
});

    /* ================= PROYECTOS - CARRUSEL ================= */

    const cards = document.querySelectorAll(".project-card");
    let currentIndex = 0;

    function updateCarousel() {
        cards.forEach(card => {
            card.classList.remove("active", "left", "right");
        });

        const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
        const nextIndex = (currentIndex + 1) % cards.length;

        cards[currentIndex].classList.add("active");
        cards[prevIndex].classList.add("left");
        cards[nextIndex].classList.add("right");
    }

    window.moveSlide = function (direction) {
        currentIndex += direction;

        if (currentIndex < 0) currentIndex = cards.length - 1;
        if (currentIndex >= cards.length) currentIndex = 0;

        updateCarousel();
    };

    window.flipCard = function (card) {
        card.classList.toggle("flipped");
    };

    updateCarousel();

    /* ================= ALERTA FLOTANTE ================= */

    const alertBox = document.getElementById("projectAlert");
const projectsSection = document.getElementById("proyectos");

let manuallyClosed = false;

// 🔥 La hacemos global
window.closeAlert = function () {
    manuallyClosed = true;
    alertBox.style.display = "none";
};

window.addEventListener("scroll", function () {

    if (!projectsSection) return;

    const rect = projectsSection.getBoundingClientRect();

    const sectionVisible =
        rect.top < window.innerHeight * 0.6 &&
        rect.bottom > window.innerHeight * 0.4;

    if (sectionVisible && !manuallyClosed) {
        alertBox.style.display = "block";
    } else {
        alertBox.style.display = "none";
    }
});

//-----------------------Formacion------------------------------------
/* ================= REVEAL FORMACION ================= */

const revealElements = document.querySelectorAll(".reveal-left, .reveal-right");
const formacionSection = document.getElementById("formacion");

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {

            revealElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add("reveal-visible");
                }, index * 150); // efecto cascada elegante
            });

        }
    });
}, {
    threshold: 0.3
});

if (formacionSection) {
    revealObserver.observe(formacionSection);
}

});

//------------------------Habilidades tecnicas--------------------*/

/* ================= BURBUJAS INTERACTIVAS ================= */

const bubbles = document.querySelectorAll(".bubble");
const area = document.getElementById("bubbleContainer");

let mouseX = 0;
let mouseY = 0;

/* POSICIONES INICIALES ALEATORIAS */
bubbles.forEach(bubble => {
    bubble.style.left = Math.random() * 80 + "%";
    bubble.style.top = Math.random() * 70 + "%";
});

/* MOVIMIENTO DIRECCIONAL SUAVE */
area.addEventListener("mousemove", (e) => {

    const rect = area.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    bubbles.forEach(bubble => {

        if (bubble.dataset.dragging === "true") return;

        const bubbleRect = bubble.getBoundingClientRect();
        const bubbleX = bubbleRect.left - rect.left + bubbleRect.width / 2;
        const bubbleY = bubbleRect.top - rect.top + bubbleRect.height / 2;

        const dx = bubbleX - mouseX;
        const dy = bubbleY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {

            const angle = Math.atan2(dy, dx);
            const moveX = Math.cos(angle) * 40;
            const moveY = Math.sin(angle) * 40;

            bubble.style.transform = `translate(${moveX}px, ${moveY}px)`;

        } else {
            bubble.style.transform = "translate(0,0)";
        }

    });

});


/* ================= DRAG ================= */

bubbles.forEach(bubble => {

    let offsetX, offsetY;

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

        if (bubble.dataset.dragging === "true") {

            const rect = area.getBoundingClientRect();

            let newX = e.clientX - rect.left - offsetX;
            let newY = e.clientY - rect.top - offsetY;

            /* LIMITES */
            newX = Math.max(0, Math.min(newX, area.clientWidth - bubble.offsetWidth));
            newY = Math.max(0, Math.min(newY, area.clientHeight - bubble.offsetHeight));

            bubble.style.left = newX + "px";
            bubble.style.top = newY + "px";
        }

    });

});

//---------------------MAs alla del codigo-------------------------------
const cards = document.querySelectorAll(".hobby-card");
const modal = document.getElementById("customModal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const spotifyBtn = document.getElementById("spotifyBtn");
const closeModal = document.querySelector(".close-modal");

cards.forEach(card => {

  card.addEventListener("click", () => {

    modal.classList.add("active");

    modalImg.src = card.dataset.img;
    modalTitle.textContent = card.dataset.title;

    if (card.dataset.spotify) {
      spotifyBtn.style.display = "inline-block";
      spotifyBtn.href = card.dataset.spotify;
    } else {
      spotifyBtn.style.display = "none";
    }

  });

});

closeModal.addEventListener("click", () => {
  modal.classList.remove("active");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
  }
});

//------------------------------------------CONTACTO----------------------------------------------------------
/* COPIAR EMAIL Y TELÉFONO */

document.querySelectorAll(".copy-item").forEach(item => {
  item.addEventListener("click", () => {

    const text = item.dataset.copy;

    navigator.clipboard.writeText(text);

    item.style.background = "#e7f9ef";

    setTimeout(() => {
      item.style.background = "#fff";
    }, 800);

  });
});


/* LIMPIAR FORMULARIO AL ENVIAR */

document.getElementById("contactForm")
  .addEventListener("submit", function(e) {

    e.preventDefault();

    this.reset();

  });

  