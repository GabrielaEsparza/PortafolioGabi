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