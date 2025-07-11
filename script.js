document.addEventListener('DOMContentLoaded', () => {

    // --- Animation "fade-in" au scroll ---
    const fadeInElements = document.querySelectorAll('.fade-in');
    if (fadeInElements.length > 0) {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Amélioration : on arrête d'observer un élément déjà visible
                }
            });
        }, observerOptions);

        fadeInElements.forEach(el => observer.observe(el));
    }

    // --- Smooth scroll pour les liens internes (ancres) ---
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            try {
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            } catch (error) {
                console.error(`L'ancre "${targetId}" n'a pas pu être trouvée.`, error);
            }
        });
    });

    // --- Système de cartes empilées (Quiz) ---
    const quizContainer = document.getElementById('quizContainer');
    // On exécute ce code seulement si la section du quiz existe sur la page
    if (quizContainer) {
        const cards = quizContainer.querySelectorAll('.quiz-card');
        const indicators = document.querySelectorAll('.quiz-indicator');
        const playBtn = document.getElementById('playBtn');
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');

        let currentCardIndex = 0;
        let autoPlayInterval = null;
        let isAutoPlaying = false;

        const updateStackingStyles = () => {
            const currentCards = quizContainer.querySelectorAll('.quiz-card');
            currentCards.forEach((card, index) => {
                // On nettoie les anciennes classes de position
                card.classList.remove('stack-pos-1', 'stack-pos-2', 'stack-pos-3', 'stack-pos-4', 'is-leaving');
                // On applique les styles seulement aux 4 premières cartes de la pile
                if (index < 4) {
                    card.classList.add(`stack-pos-${index + 1}`);
                }
            });
        };

        const updateIndicators = () => {
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentCardIndex);
            });
        };

        const rotateToNextCard = () => {
            if (cards.length < 2) return; // Pas de rotation si moins de 2 cartes
            
            const firstCard = quizContainer.querySelector('.quiz-card');
            firstCard.classList.add('is-leaving');
            
            setTimeout(() => {
                quizContainer.appendChild(firstCard); // Déplace la première carte à la fin

                currentCardIndex = (currentCardIndex + 1) % cards.length;
                updateIndicators();
                updateStackingStyles();
            }, 400); // Doit correspondre à la durée de la transition CSS
        };

        const rotateToPreviousCard = () => {
            if (cards.length < 2) return;
            const currentCards = quizContainer.querySelectorAll('.quiz-card');
            const lastCard = currentCards[currentCards.length - 1];
            quizContainer.insertBefore(lastCard, currentCards[0]); // Déplace la dernière carte au début

            currentCardIndex = (currentCardIndex - 1 + cards.length) % cards.length;
            updateIndicators();
            updateStackingStyles();
        };

        const startAutoPlay = () => {
            if (isAutoPlaying) return; // Déjà en lecture
            isAutoPlaying = true;
            playBtn.textContent = '⏸';
            playBtn.classList.add('active');
            autoPlayInterval = setInterval(rotateToNextCard, 3000);
        };

        const stopAutoPlay = () => {
            isAutoPlaying = false;
            playBtn.textContent = '▶';
            playBtn.classList.remove('active');
            clearInterval(autoPlayInterval);
        };

        const toggleAutoPlay = () => {
            if (isAutoPlaying) {
                stopAutoPlay();
            } else {
                startAutoPlay();
            }
        };

        // === Attacher les écouteurs d'événements ===
        nextBtn.addEventListener('click', rotateToNextCard);
        prevBtn.addEventListener('click', rotateToPreviousCard);
        playBtn.addEventListener('click', toggleAutoPlay);

        quizContainer.addEventListener('click', (e) => {
            // Permet de cliquer sur la carte elle-même pour passer à la suivante
            if (e.target.closest('.quiz-card')) {
                rotateToNextCard();
            }
        });

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                if (index === currentCardIndex) return;
                stopAutoPlay(); // Arrête la lecture auto si l'utilisateur interagit
                const diff = (index - currentCardIndex + cards.length) % cards.length;
                for (let i = 0; i < diff; i++) {
                    setTimeout(rotateToNextCard, i * 200); // Tourne les cartes rapidement pour atteindre la bonne
                }
            });
        });

        quizContainer.addEventListener('mouseenter', () => {
            if (isAutoPlaying) {
                clearInterval(autoPlayInterval);
            }
        });

        quizContainer.addEventListener('mouseleave', () => {
            if (isAutoPlaying) {
                startAutoPlay();
            }
        });

        // Initialisation au chargement
        updateIndicators();
        updateStackingStyles();
        startAutoPlay();
    }
});