document.addEventListener('DOMContentLoaded', () => {

    // 1. NAVIGÁCIÓ AKTÍV LINK KEZELÉSE (Global)
    // Ezt azért kell, mert a linket statikusan adtuk meg, de a JS dinamikusan tudja kezelni
    function setActiveNav() {
        // Lekérjük az aktuális URL fájl nevét (pl. index.html, rolunk.html)
        const currentPath = window.location.pathname;
        const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
        
        // Lekérjük az összes navigációs linket
        const navLinks = document.querySelectorAll('nav ul li a');
        
        navLinks.forEach(link => {
            // Megkeressük, hogy a link href attribútuma megegyezik-e az aktuális fájlnévvel
            if (link.getAttribute('href') === currentFile) {
                // Töröljük a class-t minden linkről
                navLinks.forEach(l => l.classList.remove('active'));
                // Hozzáadjuk a class-t az aktív linkhez
                link.classList.add('active');
            }
        });
    }

    setActiveNav();


    // 2. TERMÉKSZŰRŐ LOGIKA (termekek.html / ujsagok.html)
    const filterLinks = document.querySelectorAll('.szuro-link');
    const productCards = document.querySelectorAll('.termek-kartya');

    if (filterLinks.length > 0 && productCards.length > 0) {
        
        filterLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Kiemeljük az aktív szűrőt
                filterLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Lekérjük a szűrő kategóriát
                const filterValue = link.getAttribute('data-filter');

                // Végigmegyünk az összes termékkártyán
                productCards.forEach(card => {
                    const cardCategories = card.getAttribute('data-kategoria');
                    
                    // Ellenőrizzük, hogy a kártya megfelel-e a szűrőnek
                    if (filterValue === 'all' || cardCategories.includes(filterValue)) {
                        card.style.display = 'block'; // Megjelenítés
                    } else {
                        card.style.display = 'none';  // Elrejtés
                    }
                });
            });
        });
    }


    // 3. TERMÉKOLDAL GALÉRIA KEZELÉSE (product-page.html)
    const thumbnails = document.querySelectorAll('.thumbnail-images img');
    const mainImage = document.querySelector('.main-image img');

    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                
                // Beállítjuk a fő kép forrását az indexkép forrására
                mainImage.src = thumb.src;
                mainImage.alt = thumb.alt;

                // Frissítjük az aktív állapotot az indexképeken
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });
        
        // Kezdeti állapot beállítása: az első indexkép legyen aktív
        if(thumbnails[0]) {
            thumbnails[0].classList.add('active');
        }
    }

    // 4. KOSÁR MENNYISÉG SZINKRONIZÁLÁSA (cart.html)
    const quantityInputs = document.querySelectorAll('.kosar-termek input[type="number"]');
    
    // Bár a tényleges kosárlogika backendet igényel, ez a kód biztosítja, 
    // hogy a változtatások megtörténjenek és a termékek ne tűnjenek el.
    quantityInputs.forEach(input => {
        input.addEventListener('change', () => {
            if (input.value < 1) {
                // Megakadályozza, hogy 0 vagy negatív mennyiség legyen
                input.value = 1; 
            }
            // Itt kellene frissíteni a végösszeget egy valós webáruházban,
            // de itt csak a vizuális változás történik meg.
            console.log(`Termék mennyiség változott: ${input.id}, új mennyiség: ${input.value}`);
        });
    });
    
});
