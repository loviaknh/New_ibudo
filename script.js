
        // Animation au scroll - subtile et élégante
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observer tous les éléments avec fade-in
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Smooth scroll pour les liens internes
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Animation du logo au chargement
        window.addEventListener('load', function() {
            document.querySelectorAll('.fade-in').forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('visible');
                }, index * 200);
            });
        });

        // === SYSTÈME DE CARTES EMPILÉES ===
        let currentCardIndex = 0;
        let autoPlayInterval;
        let isAutoPlaying = false;

        const container = document.getElementById('quizContainer');
        const cards = container.querySelectorAll('.quiz-card');
        const indicators = document.querySelectorAll('.quiz-indicator');
        const playBtn = document.getElementById('playBtn');

        // ...existing code...
            // Fonction pour faire tourner vers la carte suivante
            function nextCard() {
                container.classList.add('rotating');
                
                setTimeout(() => {
                    // Toujours récupérer la liste actuelle des cartes
                    const cards = container.querySelectorAll('.quiz-card');
                    const firstCard = cards[0];
                    container.appendChild(firstCard);

                    currentCardIndex = (currentCardIndex + 1) % cards.length;
                    updateIndicators();

                    container.classList.remove('rotating');
                }, 400);
            }

            // Fonction pour la carte précédente
            function previousCard() {
                const cards = container.querySelectorAll('.quiz-card');
                const lastCard = cards[cards.length - 1];
                container.insertBefore(lastCard, cards[0]);

                currentCardIndex = (currentCardIndex - 1 + cards.length) % cards.length;
                updateIndicators();
            }
        // ...existing code...

        // Fonction pour mettre à jour les indicateurs
        function updateIndicators() {
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentCardIndex);
            });
        }

        // Fonction pour activer/désactiver le défilement automatique
        function toggleAutoPlay() {
            if (isAutoPlaying) {
                clearInterval(autoPlayInterval);
                playBtn.textContent = '▶';
                playBtn.classList.remove('active');
                isAutoPlaying = false;
            } else {
                startAutoPlay();
                playBtn.textContent = '⏸';
                playBtn.classList.add('active');
                isAutoPlaying = false;
            }
        }

        // Fonction pour démarrer le défilement automatique
        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                nextCard();
            }, 3000); // Change de carte toutes les 3 secondes
        }

        // Ajout des événements pour les indicateurs
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                // Calculer combien de fois il faut tourner pour atteindre la carte voulue
                const diff = (index - currentCardIndex + cards.length) % cards.length;
                
                for (let i = 0; i < diff; i++) {
                    setTimeout(() => nextCard(), i * 200);
                }
            });
        });



        // Pause auto-play au survol
        container.addEventListener('mouseenter', () => {
            if (isAutoPlaying) {
                clearInterval(autoPlayInterval);
            }
        });

        container.addEventListener('mouseleave', () => {
            if (isAutoPlaying) {
                startAutoPlay();
            }
        });

        // Démarrer le défilement automatique au chargement
                window.addEventListener('load', () => {
            playBtn.textContent = '▶';
            playBtn.classList.remove('active');
        });

        // Fonction pour faire tourner les cartes au clic
        container.addEventListener('click', (e) => {
            if (e.target.closest('.quiz-card')) {
                nextCard();
            }
        });
    