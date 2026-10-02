/**
 * AGUNG CAHYO - PORTFOLIO INTERACTIVITY
 * SMKN 1 KEPANJEN - REKAYASA PERANGKAT LUNAK
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. FITUR DARK / LIGHT MODE DENGAN LOCALSTORAGE
    // ==========================================
    const btnToggleTema = document.querySelector('#theme-toggle');
    const bodyHalaman = document.body;

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

    // Event listener tombol ganti tema
    if (btnToggleTema) {
        btnToggleTema.addEventListener('click', (event) => {
            event.preventDefault();
            const isLight = bodyHalaman.classList.toggle('light-mode');
            simpanTema(isLight ? 'light' : 'dark');
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
    // 5. MANAJEMEN MODAL (KONTAK, STUDI KASUS, RESUME)
    // ==========================================
    const modalKontak = document.querySelector('#modalKontak');
    const modalStudiKasus = document.querySelector('#modalStudiKasus');
    const modalResume = document.querySelector('#modalResume');

    const btnBukaKontak = document.querySelector('#btn-kontak');
    const btnTutupKontak = document.querySelector('#btnTutupModal');

    const btnBukaResume = document.querySelector('#btn-resume');
    const btnTutupResume = document.querySelector('#btnTutupResume');

    const btnTutupStudiKasus = document.querySelector('#btnTutupStudiKasus');
    const triggersStudiKasus = document.querySelectorAll('.modal-trigger');

    function bukaModal(modalElement) {
        if (modalElement) {
            modalElement.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    function tutupSemuaModal() {
        document.querySelectorAll('.modal-overlay').forEach((modal) => {
            modal.classList.remove('show');
        });
        document.body.style.overflow = '';
    }

    if (btnBukaKontak) {
        btnBukaKontak.addEventListener('click', (event) => {
            event.preventDefault();
            bukaModal(modalKontak);
        });
    }

    if (btnTutupKontak) {
        btnTutupKontak.addEventListener('click', tutupSemuaModal);
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
                    li.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${point}</span>`;
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
        if (event.key === 'Escape') {
            tutupSemuaModal();
            closeMobileMenu();
        }
    });

    // ==========================================
    // 6. FITUR SALIN EMAIL DENGAN TOAST FEEDBACK
    // ==========================================
    const btnCopyEmail = document.querySelector('#btn-copy-email');
    const toast = document.querySelector('#toast');
    const copyText = document.querySelector('#copy-text');

    function tampilkanToast() {
        if (toast) {
            toast.classList.add('show');
            setTimeout(() => {
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
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                }
                
                if (copyText) {
                    copyText.textContent = 'Copied! ✓';
                    setTimeout(() => {
                        copyText.textContent = 'Copy Email';
                    }, 2500);
                }
                tampilkanToast();
            } catch (err) {
                console.warn('Gagal menyalin email otomatis: ', err);
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