document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const mainContent = document.getElementById('main');
    const showCenikBtn = document.getElementById('show-cenik-btn'); // Nový prvek
    const cenikSection = document.getElementById('cenik-section'); // Nový prvek

    // 1. Funkce pro Hamburger menu
    if (hamburger && navLinks && mainContent) {
        hamburger.addEventListener('click', () => {
            // Přepíná aktivní třídy pro zobrazení/skrytí menu a animaci ikony
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            // Posun hlavní části obsahu při otevření menu (pro mobilní zobrazení)
            mainContent.classList.toggle('menu-open'); 
        });
    }

    // 2. Funkce pro Zobrazení/Skrytí Ceníku
    if (showCenikBtn && cenikSection) {
        showCenikBtn.addEventListener('click', () => {
            const isActive = cenikSection.classList.toggle('active');
            
            // Změna textu tlačítka
            showCenikBtn.textContent = isActive ? 'Skrýt ceník' : 'Zobrazit ceník';

            // Po rozbalení ceníku se posune na začátek sekce
            if (isActive) {
                // Použijeme setTimeout, aby se animace nejdříve spustila a element se zobrazil
                setTimeout(() => {
                    cenikSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 500); // Počkejte na část animace
            }
        });
    }

    // 3. Implementace animace při scrollu (Intersection Observer)
    const observerOptions = {
        root: null, // Vztahuje se k viewportu
        rootMargin: '0px',
        threshold: 0.1 // Zobrazí se, jakmile je 10% elementu viditelných
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Přidá třídu 'visible', která spustí CSS animaci
                entry.target.classList.add('visible');
                // Přestane sledovat již animovaný prvek
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Sleduje všechny prvky s třídou .fade-in
    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });

    // 4. (Volitelné) Funkce pro drag-scroll galerie (pokud je na index.html)
    // Aby drag-scroll fungoval, musí se volat na správný element,
    // proto se tato část může případně přesunout do externí funkce,
    // která se volá jen na index.html, ale pro jednoduchost ji necháme zde.
    window.initGallery = function(galleryId) {
        const gallery = document.getElementById(galleryId);

        if (gallery) {
            let isDown = false;
            let startX;
            let scrollLeft;

            gallery.addEventListener('mousedown', (e) => {
                isDown = true;
                gallery.classList.add('active');
                startX = e.pageX - gallery.offsetLeft;
                scrollLeft = gallery.scrollLeft;
            });

            gallery.addEventListener('mouseleave', () => {
                isDown = false;
                gallery.classList.remove('active');
            });

            gallery.addEventListener('mouseup', () => {
                isDown = false;
                gallery.classList.remove('active');
            });

            gallery.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - gallery.offsetLeft;
                const walk = (x - startX) * 2; // Rychlost scrollu
                gallery.scrollLeft = scrollLeft - walk;
            });
            // Přidání touch událostí pro mobilní zařízení
            gallery.addEventListener('touchstart', (e) => {
                isDown = true;
                gallery.classList.add('active');
                startX = e.touches[0].pageX - gallery.offsetLeft;
                scrollLeft = gallery.scrollLeft;
            });

            gallery.addEventListener('touchend', () => {
                isDown = false;
                gallery.classList.remove('active');
            });

            gallery.addEventListener('touchmove', (e) => {
                if (!isDown) return;
                const x = e.touches[0].pageX - gallery.offsetLeft;
                const walk = (x - startX) * 2;
                gallery.scrollLeft = scrollLeft - walk;
            });
        }
    }
});