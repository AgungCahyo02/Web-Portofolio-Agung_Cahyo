/**
 * AGUNG CAHYO - PORTFOLIO INTERACTIVITY
 * SMKN 1 KEPANJEN - REKAYASA PERANGKAT LUNAK
 */

document.addEventListener('DOMContentLoaded', () => {
    const pageLoader = document.querySelector('#page-loader');
    if (pageLoader) {
        const minimumDisplayTime = 1000;
        const loaderStartedAt = performance.now();

        const hidePageLoader = () => {
            const remainingDisplayTime = Math.max(
                0,
                minimumDisplayTime - (performance.now() - loaderStartedAt)
            );

            window.setTimeout(() => {
                pageLoader.setAttribute('aria-hidden', 'true');
                pageLoader.classList.add('is-hidden');
            }, remainingDisplayTime);
        };

        if (document.readyState === 'complete') {
            hidePageLoader();
        } else {
            window.addEventListener('load', hidePageLoader, { once: true });
        }
    }

    const profileCard = document.querySelector('.image-card');
    const canTiltProfileCard = window.matchMedia('(hover: hover) and (pointer: fine)');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (profileCard && canTiltProfileCard.matches && !prefersReducedMotion.matches) {
        profileCard.addEventListener('pointermove', (event) => {
            const bounds = profileCard.getBoundingClientRect();
            const pointerX = (event.clientX - bounds.left) / bounds.width;
            const pointerY = (event.clientY - bounds.top) / bounds.height;
            const tiltX = (0.5 - pointerY) * 8;
            const tiltY = (pointerX - 0.5) * 8;

            profileCard.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
            profileCard.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
            profileCard.style.setProperty('--pointer-x', `${(pointerX * 100).toFixed(2)}%`);
            profileCard.style.setProperty('--pointer-y', `${(pointerY * 100).toFixed(2)}%`);
            profileCard.classList.add('is-interactive');
        });

        profileCard.addEventListener('pointerleave', () => {
            profileCard.classList.remove('is-interactive');
            profileCard.style.removeProperty('--tilt-x');
            profileCard.style.removeProperty('--tilt-y');
            profileCard.style.removeProperty('--pointer-x');
            profileCard.style.removeProperty('--pointer-y');
        });
    }

    // ==========================================
    // 1. FITUR DARK / LIGHT MODE DENGAN LOCALSTORAGE
    // ==========================================
    const btnToggleTema = document.querySelector('#theme-toggle');
    const bodyHalaman = document.body;
    const themeLabel = btnToggleTema
        ? btnToggleTema.querySelector('.theme-label')
        : null;

    function updateThemeToggle(isLight) {
        if (themeLabel) {
            themeLabel.textContent = isLight ? 'Dark mode' : 'Light mode';
        }
        if (btnToggleTema) {
            btnToggleTema.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} mode`);
        }
    }

    function ambilTemaTersimpan() {
        try {
            return localStorage.getItem('theme-preference');
        } catch (e) {
            return null;
        }
    }

    function simpanTema(tema) {
        try {
            localStorage.setItem('theme-preference', tema);
        } catch (e) {
            // Abaikan jika localStorage tidak diizinkan
        }
    }

    // Inisialisasi tema saat pertama kali halaman dibuka
    const temaTersimpan = ambilTemaTersimpan();
    if (temaTersimpan === 'light') {
        bodyHalaman.classList.add('light-mode');
    } else {
        bodyHalaman.classList.remove('light-mode');
    }
    updateThemeToggle(bodyHalaman.classList.contains('light-mode'));

    // Event listener tombol ganti tema
    if (btnToggleTema) {
        btnToggleTema.addEventListener('click', (event) => {
            event.preventDefault();
            const isLight = bodyHalaman.classList.toggle('light-mode');
            simpanTema(isLight ? 'light' : 'dark');
            updateThemeToggle(isLight);
        });
    }

    // ==========================================
    // 2. NAVIGASI MOBILE (HAMBURGER MENU)
    // ==========================================
    const menuToggle = document.querySelector('#menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    function closeMobileMenu() {
        if (menuToggle && navLinks) {
            menuToggle.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('is-open');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.className = 'fa-solid fa-bars';
            }
            menuToggle.setAttribute('aria-label', 'Open navigation menu');
        }
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
            }
            menuToggle.setAttribute(
                'aria-label',
                isOpen ? 'Close navigation menu' : 'Open navigation menu'
            );
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });
    }

    // ==========================================
    // 3. SCROLLSPY (INDIKATOR NAVIGASI AKTIF)
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');

    if ('IntersectionObserver' in window && sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -65% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    navAnchors.forEach((anchor) => {
                        const href = anchor.getAttribute('href');
                        if (href === `#${currentId}` || (currentId === 'hero' && href === '#home')) {
                            anchor.classList.add('active');
                        } else {
                            anchor.classList.remove('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach((section) => sectionObserver.observe(section));
    }

    const revealTargets = document.querySelectorAll(
        '.stats-strip, #about .about-intro, #about .about-detail-row, '
        + '#expertise .skills-heading, #expertise .skills-list > span, '
        + '#projects .section-header, #projects .project-card, '
        + '#contact-section .cta-card, footer .footer-brand, '
        + 'footer .footer-explore, footer .footer-bottom'
    );

    if (
        'IntersectionObserver' in window
        && !prefersReducedMotion.matches
        && revealTargets.length > 0
    ) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px 5% 0px',
            threshold: 0.12
        });

        revealTargets.forEach((target) => {
            target.classList.add('scroll-reveal');
            revealObserver.observe(target);
        });
    }

    // ==========================================
    // 4. DATA STUDI KASUS PROYEK
    // ==========================================
    const dataStudiKasus = {
        '1': {
            title: 'Student Digital Profile',
            tag: 'TASK 1 — INDUSTRY CLASS, SMKN 1 KEPANJEN',
            stack: 'Semantic HTML5 | External CSS3 | Git & GitHub',
            overview: 'Built a first personal digital profile page to learn the foundations of front-end architecture. Focused on writing semantic HTML5 and separating presentation into an external stylesheet.',
            points: [
                'Structured the document hierarchy with standard semantic tags (header, section, footer, article, and aside).',
                'Applied the CSS box model (margin, padding, border, and box-sizing) and styled the typography.',
                'Organized project files and managed profile image assets.',
                'Initialized Git version control and published the code repository to GitHub.'
            ],
            repo: 'https://github.com/AgungCahyo02/Tugas-1-SMKN-1-KEPANJEN.git'
        },
        '2': {
            title: 'Responsive Digital Profile Card & Skill Matrix',
            tag: 'TASK 2 — INDUSTRY CLASS, SMKN 1 KEPANJEN',
            stack: 'HTML5 Semantic | CSS3 Flexbox | Responsive Media Queries',
            overview: 'Developed a responsive profile card using a mobile-first approach. The interface adapts from a single-column smartphone layout to a two-column desktop layout.',
            points: [
                'Created a flexible layout with CSS Flexbox (flex-direction, justify-content, and align-items).',
                'Added responsive media queries to support multiple viewport breakpoints.',
                'Built an interactive skill matrix with tags and modern hover effects.',
                'Tested responsive layouts and device simulations with Chrome DevTools.'
            ],
            repo: 'https://github.com/AgungCahyo02/Tugas-2-SMKN-1-KEPANJEN.git'
        },
        '3': {
            title: 'Interactive Digital Profile (Modal & Interactivity)',
            tag: 'TASK 3 — INDUSTRY CLASS, SMKN 1 KEPANJEN',
            stack: 'HTML5 | CSS3 | Vanilla JavaScript (DOM Manipulation)',
            overview: 'Integrated vanilla JavaScript to add dynamic interactions without reloading the page, including modal popups and event handling.',
            points: [
                'Manipulated the Document Object Model (DOM) with querySelector and classList.',
                'Implemented an interactive modal and handled events with event.preventDefault().',
                'Added multiple dismissal options: a close button, clicking the overlay, and the Escape key.',
                'Organized the code into a modular structure that is easy to extend.'
            ],
            repo: 'https://github.com/AgungCahyo02/Tugas-3-SMKN-1-KEPANJEN.git'
        }
    };

    // ==========================================
    // 5. MANAJEMEN MODAL (STUDI KASUS, RESUME)
    // ==========================================
    const modalStudiKasus = document.querySelector('#modalStudiKasus');
    const modalResume = document.querySelector('#modalResume');

    const btnBukaResume = document.querySelector('#btn-resume');
    const btnTutupResume = document.querySelector('#btnTutupResume');

    const btnTutupStudiKasus = document.querySelector('#btnTutupStudiKasus');
    const triggersStudiKasus = document.querySelectorAll('.modal-trigger');

    let activeModal = null;
    let previouslyFocusedElement = null;
    let previousBodyOverflow = '';

    function getModalFocusableElements(modalElement) {
        return Array.from(modalElement.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter((element) => element.getClientRects().length > 0);
    }

    function bukaModal(modalElement) {
        if (!modalElement) {
            return;
        }

        previouslyFocusedElement = document.activeElement;
        previousBodyOverflow = document.body.style.overflow;
        activeModal = modalElement;
        modalElement.classList.add('show');
        modalElement.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        modalElement.querySelector('.modal-box')?.focus();
    }

    function tutupSemuaModal() {
        document.querySelectorAll('.modal-overlay').forEach((modal) => {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
        });
        activeModal = null;
        document.body.style.overflow = previousBodyOverflow;
        if (previouslyFocusedElement instanceof HTMLElement && previouslyFocusedElement.isConnected) {
            previouslyFocusedElement.focus();
        }
        previouslyFocusedElement = null;
    }

    if (btnBukaResume) {
        btnBukaResume.addEventListener('click', (event) => {
            event.preventDefault();
            bukaModal(modalResume);
        });
    }

    if (btnTutupResume) {
        btnTutupResume.addEventListener('click', tutupSemuaModal);
    }

    triggersStudiKasus.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            const projectId = btn.getAttribute('data-project');
            const data = dataStudiKasus[projectId];

            if (data && modalStudiKasus) {
                document.querySelector('#studiKasusTitle').textContent = data.title;
                document.querySelector('#studiKasusTag').textContent = data.tag;
                document.querySelector('#studiKasusStack').textContent = data.stack;
                document.querySelector('#studiKasusOverview').textContent = data.overview;

                const pointsContainer = document.querySelector('#studiKasusPoints');
                pointsContainer.innerHTML = '';
                data.points.forEach((point) => {
                    const li = document.createElement('li');
                    const icon = document.createElement('i');
                    icon.className = 'fa-solid fa-circle-check';
                    icon.setAttribute('aria-hidden', 'true');
                    const text = document.createElement('span');
                    text.textContent = point;
                    li.append(icon, text);
                    pointsContainer.appendChild(li);
                });

                const repoBtn = document.querySelector('#studiKasusRepo');
                if (repoBtn) {
                    repoBtn.setAttribute('href', data.repo);
                }

                bukaModal(modalStudiKasus);
            }
        });
    });

    if (btnTutupStudiKasus) {
        btnTutupStudiKasus.addEventListener('click', tutupSemuaModal);
    }

    document.querySelectorAll('.modal-overlay').forEach((modal) => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                tutupSemuaModal();
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && activeModal) {
            tutupSemuaModal();
        }

        if (event.key === 'Escape') {
            closeMobileMenu();
        }

        if (event.key !== 'Tab' || !activeModal) {
            return;
        }

        const focusableElements = getModalFocusableElements(activeModal);
        if (focusableElements.length === 0) {
            event.preventDefault();
            activeModal.querySelector('.modal-box')?.focus();
            return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const focusIsOutsideModal = !activeModal.contains(document.activeElement);
        const focusIsOnDialog = activeModal.querySelector('.modal-box') === document.activeElement;

        if (event.shiftKey && (
            document.activeElement === firstElement
            || focusIsOutsideModal
            || focusIsOnDialog
        )) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && (document.activeElement === lastElement || focusIsOutsideModal)) {
            event.preventDefault();
            firstElement.focus();
        }
    });

    // ==========================================
    // 6. FITUR SALIN EMAIL DENGAN TOAST FEEDBACK
    // ==========================================
    const btnCopyEmail = document.querySelector('#btn-copy-email');
    const toast = document.querySelector('#toast');
    const toastMessage = document.querySelector('#toast-message');
    const toastIcon = toast ? toast.querySelector('i') : null;
    const copyText = document.querySelector('#copy-text');
    let toastTimer;
    let copyTextTimer;

    function tampilkanToast(message, isError = false) {
        if (toast) {
            if (toastMessage) {
                toastMessage.textContent = message;
            }
            if (toastIcon) {
                toastIcon.className = isError
                    ? 'fa-solid fa-circle-exclamation'
                    : 'fa-solid fa-circle-check';
            }
            window.clearTimeout(toastTimer);
            toast.classList.add('show');
            toastTimer = window.setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    if (btnCopyEmail) {
        btnCopyEmail.addEventListener('click', async () => {
            const email = 'agungrplkanesa@gmail.com';
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(email);
                } else {
                    // Fallback untuk lingkungan non-HTTPS
                    const textArea = document.createElement('textarea');
                    textArea.value = email;
                    textArea.style.position = 'fixed';
                    textArea.style.opacity = '0';
                    document.body.appendChild(textArea);
                    try {
                        textArea.select();
                        if (!document.execCommand('copy')) {
                            throw new Error('Browser menolak perintah salin.');
                        }
                    } finally {
                        textArea.remove();
                    }
                }
                
                if (copyText) {
                    copyText.textContent = 'Copied! ✓';
                    window.clearTimeout(copyTextTimer);
                    copyTextTimer = window.setTimeout(() => {
                        copyText.textContent = 'Copy Email';
                    }, 2500);
                }
                tampilkanToast('Email address copied to clipboard!');
            } catch (err) {
                console.error('Gagal menyalin alamat email.', err);
                if (copyText) {
                    copyText.textContent = 'Copy failed';
                    window.clearTimeout(copyTextTimer);
                    copyTextTimer = window.setTimeout(() => {
                        copyText.textContent = 'Copy Email';
                    }, 2500);
                }
                tampilkanToast('Copy failed. Please copy the email address manually.', true);
            }
        });
    }

    // ==========================================
    // 7. TOMBOL KEMBALI KE ATAS (BACK TO TOP)
    // ==========================================
    const btnBackToTop = document.querySelector('#btn-back-to-top');
    if (btnBackToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 350) {
                btnBackToTop.classList.add('visible');
            } else {
                btnBackToTop.classList.remove('visible');
            }
        });

        btnBackToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // 8. AUTO UPDATE TAHUN FOOTER
    // ==========================================
    const elemYear = document.querySelector('#year');
    if (elemYear) {
        elemYear.textContent = new Date().getFullYear();
    }
});